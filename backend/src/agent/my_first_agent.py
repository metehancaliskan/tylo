from uagents import Agent, Context, Model
import re
import json

# instantiate agent
agent = Agent(
    name="twitter_scorer",
    seed="secret_seed_phrase",
    port=8000,
    endpoint=["http://localhost:8000/submit"]
)

# Mock Twitter posts for testing
mock_tweets = [
    {
        "id": 1,
        "content": "Flow blockchain is absolutely amazing! The speed and scalability are incredible. Best developer experience I've ever had. #Flow #Blockchain #Innovation",
        "author": "@crypto_enthusiast"
    }
]

def score_tweet_content(content: str) -> dict:
    """
    Score a tweet based on its content sentiment and relevance
    Returns a score between -100 and +100
    """
    content_lower = content.lower()
    
    # Positive keywords and their weights
    positive_keywords = {
        'amazing': 15, 'incredible': 15, 'best': 12, 'great': 10, 'excellent': 12,
        'love': 8, 'awesome': 12, 'fantastic': 12, 'perfect': 14, 'outstanding': 14,
        'innovative': 10, 'fast': 8, 'scalable': 10, 'smooth': 6, 'efficient': 8,
        'brilliant': 12, 'outstanding': 14, 'superb': 12, 'wonderful': 10
    }
    
    # Negative keywords and their weights
    negative_keywords = {
        'disappointment': -15, 'terrible': -12, 'garbage': -14, 'waste': -10,
        'slow': -8, 'expensive': -6, 'bad': -8, 'awful': -12, 'horrible': -12,
        'avoid': -10, 'disappointed': -12, 'frustrated': -8, 'annoying': -6,
        'useless': -10, 'worst': -12, 'hate': -10, 'terrible': -12
    }
    
    # Calculate positive score
    positive_score = 0
    for keyword, weight in positive_keywords.items():
        if keyword in content_lower:
            positive_score += weight
    
    # Calculate negative score
    negative_score = 0
    for keyword, weight in negative_keywords.items():
        if keyword in content_lower:
            negative_score += weight
    
    # Calculate total score (can be negative or positive)
    total_score = positive_score + negative_score
    
    # Ensure score is between -100 and +100
    final_score = max(-100, min(100, total_score))
    
    # Determine sentiment category
    if final_score > 25:
        sentiment = "Positive"
    elif final_score >= -10:
        sentiment = "Neutral"
    else:
        sentiment = "Negative"
    
    return {
        "score": final_score,
        "sentiment": sentiment,
        "positive_points": positive_score,
        "negative_points": negative_score
    }

# startup handler
@agent.on_event("startup")
async def startup_function(ctx: Context):
    ctx.logger.info(f"Hello, I'm agent {agent.name} and my address is {agent.address}.")
    ctx.logger.info("Twitter post scoring agent is ready!")

# Message handler for scoring tweets
@agent.on_message(Model)
async def handle_message(ctx: Context, sender: str, message: str):
    ctx.logger.info(f"Received message from {sender}: {message}")
    
    # Check if message is a request to score a specific tweet
    if message.lower().startswith("score tweet"):
        try:
            # Extract tweet ID from message (e.g., "score tweet 1" or "score tweet 2")
            parts = message.lower().split()
            if len(parts) >= 3 and parts[2].isdigit():
                tweet_id = int(parts[2])
                
                # Find the tweet with the specified ID
                tweet = None
                for t in mock_tweets:
                    if t["id"] == tweet_id:
                        tweet = t
                        break
                
                if tweet:
                    ctx.logger.info(f"Scoring tweet #{tweet_id}...")
                    result = score_tweet_content(tweet["content"])
                    
                    tweet_result = {
                        "user": tweet["author"],
                        "score": result["score"],
                        "sentiment": result["sentiment"],
                        "tweet_id": tweet["id"],
                        "content": tweet["content"]
                    }
                    
                    # Send JSON response for single tweet
                    response_json = {
                        "status": "success",
                        "result": tweet_result,
                        "message": f"Scored tweet #{tweet_id} successfully"
                    }
                    
                    await ctx.send(sender, json.dumps(response_json, indent=2))
                else:
                    error_response = {
                        "status": "error",
                        "message": f"Tweet with ID {tweet_id} not found",
                        "available_tweets": [t["id"] for t in mock_tweets]
                    }
                    await ctx.send(sender, json.dumps(error_response, indent=2))
            else:
                error_response = {
                    "status": "error",
                    "message": "Please specify tweet ID. Use 'score tweet 1' or 'score tweet 2'",
                    "available_tweets": [t["id"] for t in mock_tweets]
                }
                await ctx.send(sender, json.dumps(error_response, indent=2))
        except Exception as e:
            error_response = {
                "status": "error",
                "message": f"Error processing request: {str(e)}"
            }
            await ctx.send(sender, json.dumps(error_response, indent=2))
    
    elif message.lower() == "help":
        help_response = {
            "status": "help",
            "available_commands": [
                "score tweet 1 - Score the first mock tweet (positive about Flow)",
                "score tweet 2 - Score the second mock tweet (negative about Flow)",
                "help - Show this help message"
            ],
            "scoring_range": "Scores range from -100 to +100",
            "available_tweets": [t["id"] for t in mock_tweets]
        }
        await ctx.send(sender, json.dumps(help_response, indent=2))
    
    else:
        error_response = {
            "status": "error",
            "message": "Unknown command. Use 'help' to see available commands.",
            "received_message": message
        }
        await ctx.send(sender, json.dumps(error_response, indent=2))

if __name__ == "__main__":
    agent.run()