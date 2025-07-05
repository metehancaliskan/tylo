import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

// Define the Tweet interface
interface Tweet {
  id: number;
  content: string;
  author: string;
  created_at?: string;
  score?: number;
  sentiment?: string;
  // Add other fields as needed based on your table structure
}

class SupabaseService {
  private static instance: SupabaseClient;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getInstance(): SupabaseClient {
    if (!SupabaseService.instance) {
      const supabaseUrl = process.env.SUPABASE_URL || "";
      const supabaseKey = process.env.SUPABASE_KEY || "";

      if (!supabaseUrl || !supabaseKey) {
        throw new Error(
          "Supabase URL and Key must be set in the environment variables"
        );
      }

      SupabaseService.instance = createClient(supabaseUrl, supabaseKey);
    }

    return SupabaseService.instance;
  }

  // Method to fetch all tweets from collected_tweets table
  public static async getCollectedTweets(): Promise<Tweet[]> {
    try {
      const supabase = SupabaseService.getInstance();
      
      const { data, error } = await supabase
        .from('collected_tweets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error fetching tweets: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCollectedTweets:', error);
      throw error;
    }
  }

  // Method to fetch a single tweet by ID
  public static async getTweetById(id: number): Promise<Tweet | null> {
    try {
      const supabase = SupabaseService.getInstance();
      
      const { data, error } = await supabase
        .from('collected_tweets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw new Error(`Error fetching tweet: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getTweetById:', error);
      throw error;
    }
  }

  // Method to insert a new tweet
  public static async insertTweet(tweet: Omit<Tweet, 'id'>): Promise<Tweet> {
    try {
      const supabase = SupabaseService.getInstance();
      
      const { data, error } = await supabase
        .from('collected_tweets')
        .insert([tweet])
        .select()
        .single();

      if (error) {
        throw new Error(`Error inserting tweet: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in insertTweet:', error);
      throw error;
    }
  }

  // Method to update tweet score and sentiment
  public static async updateTweetScore(id: number, score: number, sentiment: string): Promise<Tweet> {
    try {
      const supabase = SupabaseService.getInstance();
      
      const { data, error } = await supabase
        .from('collected_tweets')
        .update({ score, sentiment })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating tweet: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in updateTweetScore:', error);
      throw error;
    }
  }
}

export default SupabaseService;
export type { Tweet }; 