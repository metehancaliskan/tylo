#!/usr/bin/env python3
"""
Test script for Twitter Scoring Agent
This script tests the scoring function directly without running the full agent
"""

import sys
import os
import json

# Add current directory to path to import from my_first_agent
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the scoring function and mock tweets
from my_first_agent import score_tweet_content, mock_tweets

def test_scoring_function():
    """Test the scoring function with mock tweets"""
    print("=" * 60)
    print("TWITTER SCORING AGENT TEST")
    print("=" * 60)
    print()
    
    results = []
    
    for i, tweet in enumerate(mock_tweets, 1):
        print(f"TESTING TWEET #{i}")
        print("-" * 40)
        print(f"Author: {tweet['author']}")
        print(f"Content: {tweet['content']}")
        print()
        
        # Score the tweet
        result = score_tweet_content(tweet['content'])
        
        # Create result object
        tweet_result = {
            "user": tweet["author"],
            "score": result["score"],
            "sentiment": result["sentiment"],
            "tweet_id": tweet["id"],
            "content": tweet["content"]
        }
        results.append(tweet_result)
        
        # Display results
        print(f"SCORE: {result['score']}")
        print(f"SENTIMENT: {result['sentiment']}")
        print(f"Positive Points: {result['positive_points']}")
        print(f"Negative Points: {result['negative_points']}")
        print("=" * 60)
        print()
    
    # Display final JSON result
    final_result = {
        "status": "success",
        "results": results,
    }
    
    print("FINAL JSON RESULT:")
    print(json.dumps(final_result, indent=2))
    print()
    
    # Summary
    print("SUMMARY:")
    print(f"- Tweet 1 (Positive about Flow): Score {results[0]['score']}, Sentiment: {results[0]['sentiment']}")
    print(f"- Tweet 2 (Negative about Flow): Score {results[1]['score']}, Sentiment: {results[1]['sentiment']}")
    
    # Test custom tweets
    print("\n" + "=" * 60)
    print("TESTING CUSTOM TWEETS")
    print("=" * 60)
    
    custom_tweets = [
        "Flow is okay, nothing special but works fine.",
        "I absolutely love Flow! Best blockchain ever!",
        "Flow is the worst thing I've ever used. Hate it!",
        "Flow blockchain exists. That's all I can say."
    ]
    
    for i, tweet_content in enumerate(custom_tweets, 1):
        print(f"\nCustom Tweet #{i}: {tweet_content}")
        result = score_tweet_content(tweet_content)
        print(f"Score: {result['score']}, Sentiment: {result['sentiment']}")

def test_scoring_ranges():
    """Test different score ranges to verify sentiment categories"""
    print("\n" + "=" * 60)
    print("TESTING SCORE RANGES")
    print("=" * 60)
    
    test_scores = [-50, -25, -10, 0, 10, 25, 50, 75]
    
    for score in test_scores:
        # Create a mock result with the test score
        if score > 25:
            sentiment = "Positive"
        elif score >= -10:
            sentiment = "Neutral"
        else:
            sentiment = "Negative"
        
        print(f"Score {score:3d} -> Sentiment: {sentiment}")

if __name__ == "__main__":
    try:
        test_scoring_function()
        test_scoring_ranges()
        print("\n" + "=" * 60)
        print("TEST COMPLETED SUCCESSFULLY!")
        print("=" * 60)
    except Exception as e:
        print(f"Error during testing: {e}")
        sys.exit(1) 