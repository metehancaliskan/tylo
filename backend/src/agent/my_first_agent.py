from uagents import Agent, Context, Model, Protocol
import re
import json
import os
import openai
from typing import Dict, Any
from uuid import uuid4
from datetime import datetime
from dotenv import load_dotenv

#import the necessary components from the chat protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    TextContent,
    chat_protocol_spec,
)

load_dotenv()
chat_proto = Protocol(spec=chat_protocol_spec)

# instantiate agent
agent = Agent(
    name="twitter_scorer",
    seed="s66767778788789799797789t565e",
    mailbox=True,
    publish_agent_details=True
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

# Message Handler - Process received messages and send acknowledgements
@chat_proto.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    for item in msg.content:
        if isinstance(item, TextContent):
            # Log received message
            ctx.logger.info(f"Received message from {sender}: {item.text}")
            
            # Send acknowledgment
            ack = ChatAcknowledgement(
                timestamp=datetime.utcnow(),
                acknowledged_msg_id=msg.msg_id
            )
            await ctx.send(sender, ack)
            
            # Process the message content
            message_text = item.text.lower()
            
            # Check if message is a request to score a specific tweet
            if message_text.startswith("score tweet"):
                try:
                    # Extract tweet ID from message (e.g., "score tweet 1" or "score tweet 2")
                    parts = message_text.split()
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
                            
                            # Send response message with tweet analysis
                            response_text = json.dumps({
                                "status": "success",
                                "result": tweet_result,
                                "message": f"Analyzed tweet #{tweet_id} with GPT successfully"
                            }, indent=2)
                            
                            response = ChatMessage(
                                timestamp=datetime.utcnow(),
                                msg_id=str(uuid4()),
                                content=[TextContent(type="text", text=response_text)]
                            )
                            await ctx.send(sender, response)
                        else:
                            error_text = json.dumps({
                                "status": "error",
                                "message": f"Tweet with ID {tweet_id} not found",
                                "available_tweets": [t["id"] for t in mock_tweets]
                            }, indent=2)
                            
                            response = ChatMessage(
                                timestamp=datetime.utcnow(),
                                msg_id=str(uuid4()),
                                content=[TextContent(type="text", text=error_text)]
                            )
                            await ctx.send(sender, response)
                    else:
                        error_text = json.dumps({
                            "status": "error",
                            "message": "Please specify tweet ID. Use 'score tweet 1' or 'score tweet 2'",
                            "available_tweets": [t["id"] for t in mock_tweets]
                        }, indent=2)
                        
                        response = ChatMessage(
                            timestamp=datetime.utcnow(),
                            msg_id=str(uuid4()),
                            content=[TextContent(type="text", text=error_text)]
                        )
                        await ctx.send(sender, response)
                except Exception as e:
                    error_text = json.dumps({
                        "status": "error",
                        "message": f"Error processing request: {str(e)}"
                    }, indent=2)
                    
                    response = ChatMessage(
                        timestamp=datetime.utcnow(),
                        msg_id=str(uuid4()),
                        content=[TextContent(type="text", text=error_text)]
                    )
                    await ctx.send(sender, response)
            
            elif message_text == "help":
                help_text = json.dumps({
                    "status": "help",
                    "available_commands": [
                        "score tweet 1 - Analyze the first mock tweet with GPT",
                        "score tweet 2 - Analyze the second mock tweet with GPT",
                        "help - Show this help message"
                    ],
                    "scoring_range": "Scores range from -100 to +100 (analyzed by GPT)",
                    "available_tweets": [t["id"] for t in mock_tweets],
                    "gpt_enabled": client is not None
                }, indent=2)
                
                response = ChatMessage(
                    timestamp=datetime.utcnow(),
                    msg_id=str(uuid4()),
                    content=[TextContent(type="text", text=help_text)]
                )
                await ctx.send(sender, response)
            
            else:
                error_text = json.dumps({
                    "status": "error",
                    "message": "Unknown command. Use 'help' to see available commands.",
                    "received_message": item.text
                }, indent=2)
                
                response = ChatMessage(
                    timestamp=datetime.utcnow(),
                    msg_id=str(uuid4()),
                    content=[TextContent(type="text", text=error_text)]
                )
                await ctx.send(sender, response)

# Acknowledgement Handler - Process received acknowledgements
@chat_proto.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    ctx.logger.info(f"Received acknowledgement from {sender} for message: {msg.acknowledged_msg_id}")

# Include the protocol in the agent to enable the chat functionality
# This allows the agent to send/receive messages and handle acknowledgements using the chat protocol
agent.include(chat_proto, publish_manifest=True)

if __name__ == "__main__":
    import sys
    import json
    
    # Check if called with command line arguments for analysis
    if len(sys.argv) > 2 and sys.argv[1] == "--analyze-tweet":
        try:
            # Suppress warnings and other output
            import warnings
            warnings.filterwarnings("ignore")
            
            # Redirect stderr to avoid warnings in output
            import os
            import sys
            stderr = sys.stderr
            sys.stderr = open(os.devnull, 'w')
            
            tweet_data = json.loads(sys.argv[2])
            result = score_tweet_content(tweet_data["content"])
            
            # Restore stderr
            sys.stderr.close()
            sys.stderr = stderr
            
            # Output JSON result to stdout
            print(json.dumps({
                "score": result["score"],
                "sentiment": result["sentiment"],
                "explanation": result["explanation"]
            }))
        except Exception as e:
            # Restore stderr in case of error
            if 'stderr' in locals():
                sys.stderr.close()
                sys.stderr = stderr
            
            print(json.dumps({
                "score": 0,
                "sentiment": "Neutral",
                "explanation": f"Error: {str(e)}"
            }))
    else:
        # Run the agent normally
        agent.run()