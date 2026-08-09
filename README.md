<div align="center">
  <h1>🤖 Discord Bot Template</h1>
  <p><i>A structured, modular template for building robust Discord.js v14 bots.</i></p>
  
  <p>
    <a href="https://discord.js.org/"><img src="https://img.shields.io/badge/Discord.js-v14-blue?style=for-the-badge&logo=discord" alt="Discord.js v14" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-v20+-green?style=for-the-badge&logo=node.js" alt="Node.js" /></a>
  </p>
</div>

---

## ✨ Features

- ⚔️ **Hybrid Commands**: Write your logic once. The framework natively routes both `/slash` commands and `!prefix` commands to the exact same callback seamlessly.
- 🧩 **Granular Handlers**: Dedicated, separated handlers for every modern UI component (Buttons, Modals, Autocomplete, and all 5 types of Select Menus).
- 🛡️ **Execution Guards**: Native built-in flags for `ownerOnly`, `guildOnly`, `nsfw`, and permission checks directly on your command objects.
- ⚡ **Dynamic Resolution**: Hot-reloading in development (`tsx`) and lightning-fast compiled execution in production (`node dist/`).

---

## 🚀 Quickstart

### Prerequisites
- Node.js v20+
- Discord Bot Token

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sea-deep/discord-bot-template.git
   cd discord-bot-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   > 🔑 *Open `.env` and insert your `CLIENT_TOKEN`.*

---

## 💻 Running the Bot

| Mode | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Runs the bot with hot-reloading via `tsx`. |
| **Production** | `npm start` | Compiles the TypeScript to `dist/` and starts the Node process. |

---

## 📚 Documentation

> [!IMPORTANT]  
> Detailed technical guides on how to create Hybrid Commands, setup Events, and build interactive UI Components can be found in the **[GitHub Wiki](https://github.com/sea-deep/discord-bot-template/wiki)**. 

Please refer to the Wiki for comprehensive guides and API references before building your modules.

---

## 📄 License

This project is licensed under the GPL-3.0 License.
