// Test file to fetch tweets from Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testFetchTweets() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not found in environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Fetching tweets from collected_tweets table...');
    
    // Fetch all tweets
    const { data: tweets, error } = await supabase
      .from('collected_tweets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching tweets: ${error.message}`);
    }

    console.log(`Found ${tweets.length} tweets:`);
    console.log('=' .repeat(50));
    
    tweets.forEach((tweet) => {
      console.log(`Tweet ${tweet.id}:`);
      console.log(`ID: ${tweet.x_id}`);
      console.log(`Author: ${tweet.author_username}`);
      console.log(`Content: ${tweet.full_text}`);
      console.log(`Created: ${tweet.created_at}`);
      console.log('-'.repeat(30));
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the test
testFetchTweets(); 