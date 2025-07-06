import * as dotenv from "dotenv";
import { ApifyClient } from "apify-client";

dotenv.config();

export default class ApifyUtils {
  private client: ApifyClient;
  private actorId: string;

  constructor() {
    const token = process.env.APIFY_API_TOKEN || "";
    this.actorId = process.env.APIFY_ACTOR_ID || "";
    this.client = new ApifyClient({
      token: token,
    });
  }

  // Utility function to convert camelCase to snake_case
  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  // Utility function to convert object keys from camelCase to snake_case recursively
  private convertKeysToSnakeCase(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertKeysToSnakeCase(item));
    }

    if (typeof obj === "object" && obj.constructor === Object) {
      const newObj: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const snakeKey = this.camelToSnake(key);
          newObj[snakeKey] = this.convertKeysToSnakeCase(obj[key]);
        }
      }
      return newObj;
    }

    return obj;
  }

  async getLastWeekTweets(username: string) {
    try {
      const startDateObj = new Date();
      startDateObj.setDate(startDateObj.getDate() - 7);
      const endDateObj = new Date();

      const startDate = startDateObj.toISOString().slice(0, 10);
      const endDate = endDateObj.toISOString().slice(0, 10);

      const input = {
        maxItems: 1000,
        sort: "Latest",
        tweetLanguage: "en",
        author: username,
        start: startDate,
        end: endDate,
        //   customMapFunction: (object: any) => {
        //     return { ...object };
        //   },
      };

      const run = await this.client.actor(this.actorId).call(input);

      const { items } = await this.client
        .dataset(run.defaultDatasetId)
        .listItems();
      if (items.length === 0) {
        console.log("No tweets found for the last week.");
        return null;
      }

      // Convert the response to snake_case
      const response = {
        tweets: items,
        author: items[items.length - 1].author,
      };

      return this.convertKeysToSnakeCase(response);
    } catch (error) {
      console.error("Error fetching last week tweets:", error);
      return null;
    }
  }
}
