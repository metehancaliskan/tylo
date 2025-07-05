import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { spawn } from "child_process";

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
  private isRunning: boolean = false;
  private checkInterval: number = 30000; // Check every 30 seconds

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || "";
    const supabaseKey = process.env.SUPABASE_KEY || "";

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not found in environment variables");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Analyze tweet content using the Python agent
   */
  private async analyzeTweetWithAgent(content: string): Promise<{
    score: number;
    sentiment: string;
    explanation: string;
  }> {
    return new Promise((resolve, reject) => {
      try {
        // Create a mock tweet for the agent
        const mockTweet = {
          id: Date.now(), // Use timestamp as temporary ID
          content: content,
          author: "temp_author"
        };

        // Spawn Python process to run the agent
        const pythonProcess = spawn('python3', [
          'src/agent/my_first_agent.py',
          '--analyze-tweet',
          JSON.stringify(mockTweet)
        ]);

        let output = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
          if (code === 0) {
            try {
              // Try to extract JSON from the output (handle warnings)
              const lines = output.split('\n');
              let jsonLine = '';
              
              // Find the line that contains JSON
              for (const line of lines) {
                if (line.trim().startsWith('{') && line.trim().endsWith('}')) {
                  jsonLine = line.trim();
                  break;
                }
              }
              
              if (jsonLine) {
                const result = JSON.parse(jsonLine);
                resolve({
                  score: result.score || 0,
                  sentiment: result.sentiment || "Neutral",
                  explanation: result.explanation || "Analysis completed",
                });
              } else {
                console.error("No JSON found in agent output:", output);
                resolve({
                  score: 0,
                  sentiment: "Neutral",
                  explanation: "No JSON response from agent",
                });
              }
            } catch (parseError) {
              console.error("Error parsing agent response:", parseError);
              console.error("Raw output:", output);
              resolve({
                score: 0,
                sentiment: "Neutral",
                explanation: "Failed to parse agent response",
              });
            }
          } else {
            console.error("Agent process failed:", errorOutput);
            resolve({
              score: 0,
              sentiment: "Neutral",
              explanation: `Agent analysis failed: ${errorOutput}`,
            });
          }
        });

        pythonProcess.on('error', (error) => {
          console.error("Error spawning agent process:", error);
          resolve({
            score: 0,
            sentiment: "Neutral",
            explanation: `Agent process error: ${error.message}`,
          });
        });

      } catch (error) {
        console.error("Error in agent analysis:", error);
        resolve({
          score: 0,
          sentiment: "Neutral",
          explanation: `Agent analysis failed: ${error}`,
        });
      }
    });
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
      
      const analysis = await this.analyzeTweetWithAgent(tweetContent);
      
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