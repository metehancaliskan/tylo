#!/usr/bin/env ts-node
/**
 * Automatic Tweet Scoring Service Runner
 * This script runs the service that monitors Supabase for new tweets
 * and automatically scores them using GPT
 */

import TweetScoringService from "./src/supabase/TweetScoringService";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  try {
    console.log("🚀 Initializing Tweet Scoring Service...");
    
    // Create the service
    const scoringService = new TweetScoringService();
    
    // Start the service
    await scoringService.start();
    
    // Keep the process running
    console.log("🔄 Service is running. Press Ctrl+C to stop.");
    
    // Handle graceful shutdown
    process.on("SIGINT", () => {
      console.log("\n🛑 Received SIGINT, shutting down gracefully...");
      scoringService.stop();
      process.exit(0);
    });
    
    process.on("SIGTERM", () => {
      console.log("\n🛑 Received SIGTERM, shutting down gracefully...");
      scoringService.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error("❌ Failed to start Tweet Scoring Service:", error);
    process.exit(1);
  }
}

// Run the service
main().catch((error) => {
  console.error("❌ Unhandled error:", error);
  process.exit(1);
}); 