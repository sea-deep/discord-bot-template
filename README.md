<div align="center">
  <h1>🤖 Discord Bot Template</h1>
  <p><i>A structured, modular, and professional template for building robust <a href="https://discord.js.org/">Discord.js v14</a> bots in TypeScript.</i></p>
  
  <p>
    <a href="https://discord.js.org/"><img src="https://img.shields.io/badge/Discord.js-v14-blue?style=for-the-badge&logo=discord" alt="Discord.js v14" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-v20+-green?style=for-the-badge&logo=node.js" alt="Node.js" /></a>
  </p>
</div>

---

## 🧩 Where to Place Your Code

The template relies on file-based routing to keep your logic strictly organized:

- `Configs/config.ts`: Define your bot's default prefix, developer IDs, and global error messages here.
- `src/events/`: Place your Discord event listeners (like when a member joins) here.
- `src/HybridCommands/`: Place commands that should work as both Slash and Prefix commands here.
- `src/PrefixCommands/`: Place strict Prefix-only commands here.
- `src/Interactions/`: Place handlers for buttons, modals, and select menus in their respective subfolders here.

---

## ✨ Features

This template abstracts away the boilerplate of registering commands and interacting with the Discord API. 

- **Hybrid Commands**: Write your execution logic once. Commands natively route both `/slash` and `!prefix` triggers to the exact same callback.
- **Component Routing**: Supports granular, file-based routing for **Buttons**, **Modals**, **Select Menus** (String, User, Role, Mentionable, Channel), **Context Menus** (User, Message), and **Autocomplete**.

> 📖 **[Read the Wiki](https://github.com/sea-deep/discord-bot-template/wiki)** to learn how to create these commands and map your components.

---

## 🚀 Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or higher
- A Discord Bot Token (from the [Discord Developer Portal](https://discord.com/developers/applications))

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

3. **Configure Environment**
   Copy the example environment file and update it with your credentials:
   ```bash
   cp .env.example .env
   ```
   > 🔑 *Open `.env` and insert your `CLIENT_TOKEN`.*

---

## 💻 Running the Bot

| Mode | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Runs the bot with hot-reloading via `tsx`. |
| **Production** | `npm run build && npm start` | Compiles the TypeScript to `dist/` and starts the Node process. |

---

## 📁 Detailed Project Structure

```text
discord-bot-template/
├── Configs/               # Centralized configuration (config.ts)
├── src/
│   ├── structures/        # TypeScript interfaces and abstract classes
│   ├── utilities/         # Dynamic component loaders and handlers
│   ├── helpers/           # Helper classes (Logger, CommandContext)
│   ├── HybridCommands/    # ➔ Your Dual Slash/Prefix Commands
│   ├── PrefixCommands/    # ➔ Your Prefix-Only Commands
│   ├── Interactions/      # ➔ Your Interactive Components (Buttons, Modals, Menus)
│   ├── events/            # ➔ Your Event Listeners
│   └── index.ts           # Main entry point (binds loaded components to Discord.js)
├── .env.example           # Environment template
└── package.json           # Dependencies and scripts
```

---

## 🤝 Contributing, Issues, & Discussions

We welcome all contributions! If you have a question, want to suggest a feature, or found a bug:
- **Discussions**: Have an idea or need help? Start a thread in our [Discussions](#) tab.
- **Issues**: Found a bug? Open an [Issue](#) with reproducible steps.
- **Contributing**: Check out our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on submitting Pull Requests.

---

## 📚 Documentation

> [!IMPORTANT]  
> Detailed technical guides, including a comprehensive **Beginner's Getting Started Guide**, can be found in the **[GitHub Wiki](https://github.com/sea-deep/discord-bot-template/wiki)**.

---

## 📄 License

This project is licensed under the [GPL-3.0 License](./LICENSE).
