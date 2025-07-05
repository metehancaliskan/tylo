from uagents import Agent, Context, Model
import re
import json
import os
import openai
from typing import Dict, Any
from dotenv import load_dotenv
load_dotenv()

# instantiate agent
agent = Agent(
    name="twitter_scorer",
    seed="secret_seed_phrase",
    port=8000,
    endpoint=["http://localhost:8000/submit"]
)

# Initialize OpenAI client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Mock Twitter posts for testing
mock_tweets = [
    {
        "id": 1,
        "content": "Flow blockchain is absolutely amazing! The speed and scalability are incredible. Best developer experience I've ever had. #Flow #Blockchain #Innovation",
        "author": "@crypto_enthusiast"
    },
    {
        "id": 2,
        "content": "Flow is such a disappointment. Slow, expensive, and the documentation is terrible. Waste of time and money. Avoid this garbage! #Flow #Disappointed",
        "author": "@frustrated_dev"
    }
]

def analyze_tweet_with_gpt(tweet_content: str) -> Dict[str, Any]:
    """
    Analyze tweet content using ChatGPT and return score and sentiment
    """
    try:
        if not client:
            raise ValueError("OpenAI client not found in environment variables")
        
        prompt = f"""
        Analyze the following tweet about Flow blockchain and provide:
        1. A sentiment score between -100 and +100 (negative to positive)
        2. A sentiment category: "Positive", "Neutral", or "Negative"
        3. A brief explanation of your analysis
        
        Tweet: "{tweet_content}"
        
        Respond in JSON format:
        {{
            "score": <number between -100 and 100>,
            "sentiment": "<Positive/Neutral/Negative>",
            "explanation": "<brief explanation>"
        }}
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a sentiment analysis expert. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=200
        )
        
        # Extract and parse JSON response
        response_text = response.choices[0].message.content.strip()
        
        # Try to extract JSON from the response
        try:
            # Look for JSON in the response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = response_text[start_idx:end_idx]
                result = json.loads(json_str)
            else:
                raise ValueError("No JSON found in response")
                
        except json.JSONDecodeError:
            # Fallback: create a basic response
            result = {
                "score": 0,
                "sentiment": "Neutral",
                "explanation": "Could not parse GPT response"
            }
        
        # Ensure score is within bounds
        score = max(-100, min(100, result.get("score", 0)))
        
        return {
            "score": score,
            "sentiment": result.get("sentiment", "Neutral"),
            "explanation": result.get("explanation", "Analysis completed"),
            "gpt_response": response_text
        }
        
    except Exception as e:
        print(f"Error in GPT analysis: {e}")
        # Fallback to basic scoring
        return {
            "score": 0,
            "sentiment": "Neutral",
            "explanation": f"GPT analysis failed: {str(e)}",
            "gpt_response": None
        }

def score_tweet_content(content: str) -> dict:
    """
    Score a tweet using ChatGPT analysis
    """
    # Use GPT for analysis
    gpt_result = analyze_tweet_with_gpt(content)
    
    return {
        "score": gpt_result["score"],
        "sentiment": gpt_result["sentiment"],
        "explanation": gpt_result["explanation"],
        "gpt_response": gpt_result.get("gpt_response")
    }

# startup handler
@agent.on_event("startup")
async def startup_function(ctx: Context):
    ctx.logger.info(f"Hello, I'm agent {agent.name} and my address is {agent.address}.")
    ctx.logger.info("Twitter post scoring agent with GPT integration is ready!")
    
    # Check if OpenAI API key is available
    if not client:
        ctx.logger.warning("OpenAI client not found! GPT analysis will not work.")
    else:
        ctx.logger.info("OpenAI client found. GPT analysis is enabled.")

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
                    ctx.logger.info(f"Analyzing tweet #{tweet_id} with GPT...")
                    result = score_tweet_content(tweet["content"])
                    
                    tweet_result = {
                        "user": tweet["author"],
                        "score": result["score"],
                        "sentiment": result["sentiment"],
                        "tweet_id": tweet["id"],
                        "content": tweet["content"],
                        "explanation": result["explanation"],
                        "gpt_used": result["gpt_response"] is not None
                    }
                    
                    # Send JSON response for single tweet
                    response_json = {
                        "status": "success",
                        "result": tweet_result,
                        "message": f"Analyzed tweet #{tweet_id} with GPT successfully"
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
                "score tweet 1 - Analyze the first mock tweet with GPT",
                "score tweet 2 - Analyze the second mock tweet with GPT",
                "help - Show this help message"
            ],
            "scoring_range": "Scores range from -100 to +100 (analyzed by GPT)",
            "available_tweets": [t["id"] for t in mock_tweets],
            "gpt_enabled": client is not None
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