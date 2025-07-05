#!/usr/bin/env python3
"""
Test script for GPT-powered tweet analysis
Tests both mock tweets with ChatGPT
"""

import sys
import os
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the agent directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src', 'agent'))

# Import the scoring function and mock tweets
from my_first_agent import score_tweet_content, mock_tweets

def test_gpt_analysis():
    """Test GPT analysis on both mock tweets"""
    print("=" * 80)
    print("GPT TWEET ANALYSIS TEST")
    print("=" * 80)
    print()
    
    # Check if OpenAI API key is set
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ ERROR: OPENAI_API_KEY not found in environment variables!")
        print("Please set your OpenAI API key:")
        print("export OPENAI_API_KEY=sk-your-key-here")
        print("Or add it to your .env file")
        return
    
    print("✅ OpenAI API key found")
    print()
    
    results = []
    
    for i, tweet in enumerate(mock_tweets, 1):
        print(f"🔍 ANALYZING TWEET #{i}")
        print("-" * 50)
        print(f"Author: {tweet['author']}")
        print(f"Content: {tweet['content']}")
        print()
        
        try:
            # Analyze with GPT
            print("🤖 Sending to GPT for analysis...")
            result = score_tweet_content(tweet['content'])
            
            # Create result object
            tweet_result = {
                "user": tweet["author"],
                "score": result["score"],
                "sentiment": result["sentiment"],
                "tweet_id": tweet["id"],
                "content": tweet["content"],
                "explanation": result["explanation"],
                "gpt_used": result["gpt_response"] is not None
            }
            results.append(tweet_result)
            
            # Display results
            print(f"📊 SCORE: {result['score']}")
            print(f"🎭 SENTIMENT: {result['sentiment']}")
            print(f"💭 EXPLANATION: {result['explanation']}")
            
            if result.get("gpt_response"):
                print(f"🤖 GPT RESPONSE: {result['gpt_response'][:200]}...")
            
            print("=" * 80)
            print()
            
        except Exception as e:
            print(f"❌ Error analyzing tweet #{i}: {e}")
            print("=" * 80)
            print()
    
    # Display final JSON result
    final_result = {
        "status": "success",
        "results": results,
        "summary": f"Analyzed {len(results)} tweets with GPT successfully"
    }
    
    print("📋 FINAL JSON RESULT:")
    print(json.dumps(final_result, indent=2))
    print()
    
    # Summary
    print("📈 SUMMARY:")
    for i, result in enumerate(results, 1):
        print(f"Tweet {i} ({result['sentiment']}): Score {result['score']}")
    
    print()
    print("✅ TEST COMPLETED!")

if __name__ == "__main__":
    test_gpt_analysis() 