# Slack Bot (Hack Club Stardance)

A Slack bot built with [@slack/bolt](https://slack.dev/bolt-js/) and Socket Mode.

## Commands

| Command | Description |
|---|---|
| `/dsb-ping-akhil` | Check bot latency |
| `/dsb-help-akhil` | List available commands |
| `/dsb-catfact-akhil` | Get a random cat fact |
| `/dsb-joke-akhil` | Get a random joke |

## Setup

1. Copy `.env.example` to `.env` and add your Slack tokens.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the bot:

   ```bash
   npm start
   ```

Register each slash command in your [Slack app dashboard](https://api.slack.com/apps) before using them.
