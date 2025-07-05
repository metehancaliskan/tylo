import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// Define the Tweet interface based on actual table structure
interface Tweet {
  id: number;
  text: string; // Tweet content
  full_text: string; // Full tweet text
  author_username: string; // Author username
  created_at?: string;
  posted_at?: string;
  score?: number;
  sentiment?: string;
  explanation?: string;
  gpt_used?: boolean;
}

interface ScoredTweet extends Tweet {
  score: number;
  sentiment: string;
  explanation: string;
  gpt_used: boolean;
}

class TweetScoringService {
  private supabase: SupabaseClient;
  private openai: OpenAI;
  private isRunning: boolean = false;
  private checkInterval: number = 30000; // Check every 30 seconds

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || "";
    const supabaseKey = process.env.SUPABASE_KEY || "";
    const openaiKey = process.env.OPENAI_API_KEY || "";

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not found in environment variables");
    }

    if (!openaiKey) {
      throw new Error("OpenAI API key not found in environment variables");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.openai = new OpenAI({ apiKey: openaiKey });
  }

  /**
   * Analyze tweet content using ChatGPT
   */
  private async analyzeTweetWithGPT(content: string): Promise<{
    score: number;
    sentiment: string;
    explanation: string;
  }> {
    try {
      const prompt = `
        Analyze the following tweet about Flow blockchain and provide:
        1. A sentiment score between -100 and +100 (negative to positive)
        2. A sentiment category: "Positive", "Neutral", or "Negative"
        3. A brief explanation of your analysis

        Tweet: "${content}"

        Respond in JSON format:
        {
          "score": <number between -100 and 100>,
          "sentiment": "<Positive/Neutral/Negative>",
          "explanation": "<brief explanation>"
        }
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a sentiment analysis expert. Always respond with valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 200,
      });

      const responseText = response.choices[0].message.content?.trim() || "";
      
      // Extract JSON from response
      const startIdx = responseText.indexOf("{");
      const endIdx = responseText.lastIndexOf("}") + 1;
      
      if (startIdx === -1 || endIdx === 0) {
        throw new Error("No JSON found in GPT response");
      }

      const jsonStr = responseText.substring(startIdx, endIdx);
      const result = JSON.parse(jsonStr);

      // Ensure score is within bounds
      const score = Math.max(-100, Math.min(100, result.score || 0));

      return {
        score,
        sentiment: result.sentiment || "Neutral",
        explanation: result.explanation || "Analysis completed",
      };
    } catch (error) {
      console.error("Error in GPT analysis:", error);
      return {
        score: 0,
        sentiment: "Neutral",
        explanation: `GPT analysis failed: ${error}`,
      };
    }
  }

  /**
   * Fetch unscored tweets from Supabase
   */
  private async getUnscoredTweets(): Promise<Tweet[]> {
    try {
      const { data, error } = await this.supabase
        .from("collected_tweets")
        .select("*")
        .is("score", null)
        .order("created_at", { ascending: true });

      if (error) {
        throw new Error(`Error fetching unscored tweets: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching unscored tweets:", error);
      return [];
    }
  }

  /**
   * Update tweet with score and sentiment
   */
  private async updateTweetScore(
    tweetId: number,
    score: number
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("collected_tweets")
        .update({
          score,
        })
        .eq("id", tweetId);

      if (error) {
        throw new Error(`Error updating tweet score: ${error.message}`);
      }

      console.log(`✅ Tweet ${tweetId} scored: ${score}`);
    } catch (error) {
      console.error(`❌ Error updating tweet ${tweetId}:`, error);
    }
  }

  /**
   * Process a single tweet
   */
  private async processTweet(tweet: Tweet): Promise<void> {
    try {
      const tweetContent = tweet.full_text || tweet.text;
      console.log(`🤖 Analyzing tweet ${tweet.id}: "${tweetContent.substring(0, 50)}..."`);
      
      const analysis = await this.analyzeTweetWithGPT(tweetContent);
      
      await this.updateTweetScore(tweet.id, analysis.score);
    } catch (error) {
      console.error(`❌ Error processing tweet ${tweet.id}:`, error);
    }
  }

  /**
   * Process all unscored tweets
   */
  private async processUnscoredTweets(): Promise<void> {
    try {
      const unscoredTweets = await this.getUnscoredTweets();
      
      if (unscoredTweets.length === 0) {
        console.log("📭 No unscored tweets found");
        return;
      }

      console.log(`📊 Found ${unscoredTweets.length} unscored tweets to process`);
      
      // Process tweets sequentially to avoid rate limits
      for (const tweet of unscoredTweets) {
        await this.processTweet(tweet);
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log(`✅ Finished processing ${unscoredTweets.length} tweets`);
    } catch (error) {
      console.error("❌ Error processing unscored tweets:", error);
    }
  }

  /**
   * Start the automatic scoring service
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      console.log("⚠️ Service is already running");
      return;
    }

    console.log("🚀 Starting Tweet Scoring Service...");
    console.log(`⏰ Checking for new tweets every ${this.checkInterval / 1000} seconds`);
    
    this.isRunning = true;

    // Process any existing unscored tweets first
    await this.processUnscoredTweets();

    // Set up periodic checking
    const interval = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(interval);
        return;
      }

      await this.processUnscoredTweets();
    }, this.checkInterval);

    console.log("✅ Tweet Scoring Service is now running");
  }

  /**
   * Stop the automatic scoring service
   */
  public stop(): void {
    console.log("🛑 Stopping Tweet Scoring Service...");
    this.isRunning = false;
  }

  /**
   * Get service status
   */
  public getStatus(): { isRunning: boolean; checkInterval: number } {
    return {
      isRunning: this.isRunning,
      checkInterval: this.checkInterval,
    };
  }
}

export default TweetScoringService;
export type { Tweet, ScoredTweet }; 