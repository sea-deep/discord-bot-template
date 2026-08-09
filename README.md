# Discord Bot Template

A structured, modular template for building Discord.js v14 bots. It provides a highly organized framework for handling commands, events, and all modern Discord UI components out-of-the-box.

## Key Features

### Unified Hybrid Commands (The USP)
The core feature of this template is the `HybridCommand` structure. Instead of writing separate logic for a Slash Command and a legacy Prefix Command, you write the execution logic **once**. 
- The framework automatically parses incoming Slash interaction options and Prefix message arguments, standardizing them into a unified format. 
- It handles automatic argument validation (rejecting prefix commands if required arguments are missing) and handles automatic interaction deferrals natively.
- Whether a user types `/ping` or `!ping`, the exact same callback is executed seamlessly.

### Granular Component Handlers
Unlike standard templates that lump all interactions into a single event, this template provides highly specific, separated handlers for every modern Discord component:
- Buttons
- Modals
- Autocomplete
- String Select Menus
- User Select Menus
- Role Select Menus
- Mentionable Select Menus
- Channel Select Menus

### Built-in Execution Guards
Command structures come with native configuration options to guard execution without writing boilerplate in your callbacks:
- `ownerOnly` and `developerOnly`
- `guildOnly` and `nsfw` channel restrictions
- Required `user` and `bot` Discord permission bitfield checks

### Dynamic Environment Resolution
The module loader intelligently detects your environment. During development, it dynamically imports raw `.ts` files using `tsx` for rapid hot-reloading. In production, it cleanly loads the compiled `.js` files from the `dist/` directory.

## Quickstart

### Prerequisites
- Node.js v20 or higher
- A Discord Bot Token

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sea-deep/discord-bot-template.git
cd discord-bot-template
```

2. Install dependencies:
```bash
npm install
```

3. Configure your environment:
Copy the example environment file and insert your bot token.
```bash
cp .env.example .env
```
*(Open `.env` and set `CLIENT_TOKEN`)*

## Running the Bot

**Development Mode (Hot-reloading):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```
*(This will automatically compile the project to `dist/` and start the node process).*

## Documentation

> [!IMPORTANT]  
> Detailed technical documentation on how to create Hybrid Commands, setup Events, and build interactive UI Components can be found in the **[GitHub Wiki](https://github.com/sea-deep/discord-bot-template/wiki)**. 

Please refer to the Wiki for comprehensive guides and API references before building your modules.

## License

This project is licensed under the GPL-3.0 License.
