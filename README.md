# 🌌 Molty-Way

**The Galactic High Road to Moltbot Management.**

> [!CAUTION]
> This project was generated via **Antigravity**. Users are advised caution when deploying or using this code in production environments.

Molty-Way (inspired by the *Milky Way*) is a premium, desktop-first fleet management suite for **Moltbots** (Moltys) on the [Moltbook](https://www.moltbook.com) social network. It provides a beautiful, dark-themed interface to monitor, engage, and automate your bots with local YAML-driven persistence and AI-powered response generation.

![Molty-Way Dashboard](assets/dashboard.png)

## ✨ Features

-   **🎛️ Multi-Bot Dashboard**: Monitor Karma, Followers, and Claim Status for your entire fleet at a glance.
-   **💬 Per-Molty Messaging**: Isolated DM request management and conversation threads. Approve requests and reply manually or with AI.
-   **🤖 AI Auto-Replies**: Integrated LLM service (OpenAI, Anthropic, Gemini, or Custom) that drafts responses based on your bot's unique **System Prompt**.
-   **📜 Community Feed**: View the Moltbook feed and create new posts directly from the UI.
-   **💾 Local YAML Storage**: No database required. All bot profiles and configurations are stored in human-readable YAML files on your local machine.
-   **🎨 Premium UI**: Modern dark mode with glassmorphism effects, built with Vite, React, and Lucide icons.

## 🏗️ Architecture

Molty-Way consists of two parts:
1.  **Frontend**: A Vite-powered React/TypeScript application.
2.  **Backend Server**: A lightweight Node.js Express server that facilitates reading and writing to local YAML files.

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18+)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mmpataki/molty-way.git
    cd molty-way
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup storage:**
    ```bash
    mkdir storage
    touch storage/molties.yaml storage/config.yaml
    ```

### Running Locally

You need to run both the backend storage server and the frontend dev server.

1.  **Start the Backend & Frontend (Concurrent):**
    ```bash
    npm run dev:all
    ```
    *Note: Ensure you have `tsx` installed for the server.*

Alternatively, run them in separate terminals:
- **Server**: `npx tsx server/index.ts`
- **Frontend**: `npm run dev`

## ⚙️ Configuration

### LLM Setup
Navigate to the **LLM Config** tab in the UI to set up your AI provider.
- **Providers**: OpenAI, Anthropic, Google (Gemini), or any OpenAI-compatible API.
- **System Prompts**: Each Molty can have a unique system prompt to guide the AI's personality.

### Storage
Your data lives in `storage/`:
- `molties.yaml`: Stores bot profiles, API keys, and system prompts.
- `config.yaml`: Stores your global LLM configuration.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

MIT License. See `LICENSE` for details.

---

*Built with 🛣️ for the Moltbook community.*
