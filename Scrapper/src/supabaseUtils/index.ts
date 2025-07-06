import SupabaseService from "../supabase";
import * as dotenv from "dotenv";

dotenv.config();

export default class SupabaseUtils {
  private supabase: any;

  constructor() {
    this.supabase = SupabaseService.getInstance();
  }

  async upsertXUser(xUser: any) {
    try {
      const { data, error } = await this.supabase
        .from("x_users")
        .upsert(xUser, { onConflict: "user_name" });
      if (error) {
        console.error(`Error inserting new x user:`, error);
        return false;
      }
      return true;
    } catch (error) {
      console.log("ERROR INSERTING NEW X USER: ", error);
      return false;
    }
  }

  async insertXTweet(xTweet: any) {
    try {
      const { data, error } = await this.supabase
        .from("collected_tweets")
        .insert(xTweet);
      if (error) {
        console.error(`Error inserting new x tweet:`, error);
        return false;
      }
      return true;
    } catch (error) {
      console.log("ERROR INSERTING NEW X TWEET: ", error);
      return false;
    }
  }

  formatXUser(apifyXUser: any) {
    try {
      const xUser = { ...apifyXUser };
      delete xUser.type;
      xUser.x_id = xUser.id;
      delete xUser.id;
      xUser.joined_at = new Date(xUser.created_at).toISOString();
      delete xUser.created_at;
      return xUser;
    } catch (error) {
      console.log("ERROR FORMATTING X USER: ", error);
      return null;
    }
  }
  formatXTweet(apifyXTweet: any) {
    try {
      const xTweet = { ...apifyXTweet };
      delete xTweet.type;
      xTweet.x_id = xTweet.id;
      delete xTweet.id;
      xTweet.posted_at = new Date(xTweet.created_at).toISOString();
      delete xTweet.created_at;
      delete xTweet.author;
      return xTweet;
    } catch (error) {
      console.log("ERROR FORMATTING X TWEET: ", error);
      return null;
    }
  }
}
