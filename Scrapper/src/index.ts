// const contractAddress = process.env.BELLATOR_NFT_CONTRACT_ADDRESS || "";

import { ApifyClient } from "apify-client";
import ApifyUtils from "./apifyUtils";
import SupabaseUtils from "./supabaseUtils";

const apifyUtils = new ApifyUtils();
const supabaseUtils = new SupabaseUtils();


async function main() {
  console.log("STARTED");
  const startTime = Date.now(); // Start timing

  // const username = "doodlifts";
  const username = "cemekim";

  const lastWeekTweets = await apifyUtils.getLastWeekTweets(username);
  if (!lastWeekTweets) {
    console.log("No tweets found for the last week.");
    return;
  }

  const xUser = supabaseUtils.formatXUser(lastWeekTweets.author);
  if (!xUser) {
    console.log("Error formatting x user");
    return;
  }

  const userUpsertResult = await supabaseUtils.upsertXUser(xUser);
  if (!userUpsertResult) {
    console.log("Error inserting x user");
    return;
  }

  for (const tweet of lastWeekTweets.tweets) {
    const xTweet = supabaseUtils.formatXTweet(tweet);
    if (!xTweet) {
      console.log("Error formatting x tweet", tweet);
      continue;
    }
    xTweet.author_username = xUser.user_name;

    const insertResult = await supabaseUtils.insertXTweet(xTweet);
    if (!insertResult) {
      console.log("Error inserting x tweet", tweet);
      continue;
    }
  }

  const endTime = Date.now(); // End timing
  console.log(`COMPLETED in ${endTime - startTime} ms`);
}

function run() {
  main();
}

run();
