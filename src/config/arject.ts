import arcjet, { shield, detectBot, slidingWindow, } from "@arcjet/node";

if (!process.env.ARCJET_KEY && process.env.NODE_ENV !== "test" ){
  throw new Error("ARCJET_KEY env is required");
}

const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://console.arcjet.com
  rules: [
    // Shield protects your app from common attacks such as SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //b"CATEGORY:MONITOR", // Uptime monitoring services
        "CATEGORY:PREVIEW", // Link previews such as Slack, Discord
      ],
    }),
  slidingWindow({
    mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
    interval: "2s",
    max: 5,
    }),
  ],
});

export default aj;