require("dotenv").config();

const axios = require("axios");
const { App, LogLevel } = require("@slack/bolt");

// In shared workspaces (e.g. Hack Club), only ONE app can own a slash command name.
// Set COMMAND_SUFFIX in .env to something unique (your name) so your commands don't
// collide with everyone else's /dsb-ping, /dsb-help, etc.
const suffix = process.env.COMMAND_SUFFIX ? `-${process.env.COMMAND_SUFFIX}` : "";
const cmd = (name) => `/dsb-${name}${suffix}`;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel: LogLevel.DEBUG
});

app.use(async ({ payload, next }) => {
  if (payload?.command) {
    console.log(`[event] slash command received: ${payload.command}`);
  }
  await next();
});

app.command(cmd("ping"), async ({ ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command(cmd("help"), async ({ ack, respond }) => {
  await ack();
  await respond({
    text: `Available Commands:
${cmd("ping")} - Check bot latency
${cmd("help")} - Show this help message
${cmd("catfact")} - Get a cat fact
${cmd("joke")} - Get a random joke`
  });
});

app.command(cmd("catfact"), async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command(cmd("joke"), async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text: `${response.data.setup}\n\n${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

(async () => {
  await app.start();
  console.log("bot is running!");
  console.log("listening for commands:", [cmd("ping"), cmd("help"), cmd("catfact"), cmd("joke")].join(", "));
  if (!process.env.COMMAND_SUFFIX) {
    console.warn("WARNING: COMMAND_SUFFIX is not set. In Hack Club, /dsb-ping may route to someone else's app.");
    console.warn("Set COMMAND_SUFFIX=yourname in .env and register matching commands in Slack.");
  }
})();



