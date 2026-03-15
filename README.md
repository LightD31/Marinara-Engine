# 🍝 Marinara Engine

### Release 1.3.4

<h3 align="center"><b>Fun. Intuitive. Plug-And-Play.</b></h3>

<p align="center">
  <b>An AI-powered chat & roleplay engine</b> built around one idea: <b>you install it, you run it, it works.</b><br/>
  No setup wizards, no config files, no cloud accounts. Created with agentic use in mind, allowing multiple requests at once.<br/>
  Designed to be <b>the most fun, approachable, and feature-rich</b> local AI frontend out there.
</p>

---

**Conversation, roleplay, and visual novel modes** — a full character & sprite system, 18 built-in AI agents, turn-based combat, lorebooks, and more.

Everything runs locally. No accounts, no cloud, no telemetry. Connect to any OpenAI-compatible API (OpenAI, Anthropic, Google, OpenRouter, Mistral, Cohere, or any custom endpoint, local included).

> **⚠️ Alpha Software** — This is an early release. Expect rough edges, missing features, and breaking changes between versions. Bug reports and feedback are very welcome!

---

## Screenshots

<p align="center">
  <img src="docs/screenshots/chat-desktop.png" width="90%" alt="Roleplay Chat — Desktop" />
  <br/>
  <em>Roleplay Mode — Character sprites, custom backgrounds, weather effects, and AI agents</em>
</p>

<p align="center">
  <img src="docs/screenshots/home-desktop.png" width="45%" alt="Home" />
  &nbsp;&nbsp;
  <img src="docs/screenshots/character-editor.png" width="45%" alt="Character Editor" />
</p>
<p align="center">
  <em>Home screen &nbsp;&nbsp;·&nbsp;&nbsp; Character editor with tags, metadata, and version history</em>
</p>

<p align="center">
  <img src="docs/screenshots/presets-editor.png" width="45%" alt="Presets Editor" />
  &nbsp;&nbsp;
  <img src="docs/screenshots/persona-colors.png" width="45%" alt="Persona Colors" />
</p>
<p align="center">
  <em>Drag-and-drop prompt sections &nbsp;&nbsp;·&nbsp;&nbsp; Persona color customization with live preview</em>
</p>

<p align="center">
  <img src="docs/screenshots/tutorial.png" width="45%" alt="Onboarding Tutorial" />
</p>
<p align="center">
  <em>Guided onboarding with SillyTavern migration</em>
</p>

<p align="center">
  <img src="docs/screenshots/home-mobile.png" width="30%" alt="Home — Mobile" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="docs/screenshots/chat-mobile.png" width="30%" alt="Chat — Mobile" />
</p>
<p align="center">
  <em>Fully responsive — works on phones and tablets via PWA</em>
</p>

---

## Changelog

### v1.3.4

**Added:**

- **OpenAI Responses API** — Full support for models that require the Responses API (`gpt-5.4-pro`, Codex models). Streaming, tool use, and non-streaming paths all covered.
- **New Models** — Added GPT-5.4, GPT-5.4 Pro, 7 Codex models (`gpt-5.3-codex`, `gpt-5.2-codex`, `gpt-5.1-codex`, `gpt-5.1-codex-max`, `gpt-5.1-codex-mini`, `gpt-5-codex`, `codex-mini-latest`).
- **Gallery Recovery** — Server startup now scans `data/gallery/` for orphaned image files and re-creates missing database records, preventing gallery loss across updates.
- **GHCR Docker Workflow** — Added GitHub Container Registry CI/CD workflow for automated multi-arch Docker image builds on push/tag.
- **IP Allowlist Middleware** — Optional IP-based access control for self-hosted deployments.
- **Lorebook Token Counts** — Each lorebook entry now shows its estimated token count. Sort entries by Order, Name, Tokens, or Keys, and see total token usage at a glance.
- **World Info Button** — Floating globe icon in the chat toolbar (desktop and mobile) showing all currently activated lorebook entries, their keywords, and total token usage for the active chat — similar to Chat Summary.
- **Avatar Zoom & Repositioning** — Zoom in and drag-to-reposition character avatars from the Character Editor's Metadata tab. Crop settings are applied everywhere avatars appear: chat messages, character cards, expression panel, and group chat cycling avatars.
- **/narrator Command** — `/narrator <direction>` sends a narrative steering instruction to the AI, asking it to move the story toward what you describe (e.g., `/narrator the storm intensifies`).
- **/random Command** — `/random` (aliases: `/rand`, `/event`) asks the AI to introduce a random, unexpected event to shake up the plot.

**Changes:**

- **Thinking/Reasoning Support** — Full extended thinking support for Claude (streaming + non-streaming thinking blocks), Gemini (thought-flagged parts), and OpenAI (reasoning_content). Configurable via Reasoning Effort (Low/Medium/High/Maximum) and Show Thoughts toggle.
- **Agent Data Per-Chat Filtering** — Agent data markers in the prompt now respect the per-chat active agent list. Inactive agents no longer leak their data sections (quests, world state, etc.) into the prompt.
- **Agent Resolution Fix** — Built-in agents added to a chat's per-chat agent list now resolve correctly even without a prior DB configuration row. Previously, agents like World State would silently fail to run if never opened in the Agent Editor.
- **Gallery Cleanup** — Deleting a chat now properly removes its associated gallery images (both DB records and physical files).

**Fixes:**

- Fixed false "unsaved changes" warning when switching chats after saving in editors (Character, Connection, Preset, Lorebook, Persona, Agent, Tool, Regex Script).
- Fixed bold dialogue toggle not persisting correctly.
- Fixed iOS virtual keyboard pushing layout off-screen.
- Fixed iPhone bottom safe-area layout issues.
- Fixed theme save not applying immediately on iOS.
- Fixed `RESPONSES_ONLY` model detection for Codex suffixes (`-codex`, `-codex-max`, `-codex-mini`).
- Fixed streaming messages not using the character's default background color in single-character chats.
- Fixed world-state agent data not appearing in the `<context>` block during generation when no prior committed snapshot existed.
- Fixed HUD widget data being wiped when the model returned partial agent results (now merges instead of replacing).
- Fixed visible flash/refresh of all messages when generation ends (entry animation now only plays on initial chat load, not on query refetches).

---

### v1.3.3

**Added:**

- **Unified Chat UI** — Conversation and Roleplay modes now share the same visual layout. Background layers, toolbar, HUD sidebars, sprites, and weather effects are available in both modes.
- **Per-Chat Agents** — Toggle individual agents on or off per chat, overriding global agent settings.
- **Chat Setup Wizard** — New guided setup flow when creating a chat, letting you pick characters, presets, and connections in one step.
- **Gallery Persistence** — Gallery images are now saved to disk and persist across server restarts.
- **Reorderable Chat Settings** — Chat settings panels can be reordered via drag-and-drop.

**Changes:**

- Cancel generation now aborts **all** in-flight work — pre-generation agents, the main LLM response, and post-generation agents are all stopped immediately via abort signal propagation.
- Streaming auto-scroll no longer locks you to the bottom — scroll up during generation to read at your own pace; auto-scroll re-engages when you return to the bottom.
- Termux `.npmrc` platform fix now detects CPU architecture dynamically instead of hardcoding ARM64.

**Fixes:**

- Fixed Lorebook Keeper agent not persisting entries — the agent ran and reported results, but never wrote them to the database. Entries are now saved to the first enabled lorebook (or an auto-created one).
- Fixed conversation input box being wider than roleplay mode (padding now unconditional).
- Fixed Termux startup failing due to ABI mismatch in better-sqlite3 prebuilt binaries.
- Fixed Character Maker button not working correctly.
- Fixed connection name truncation in the settings panel.
- Fixed agents panel text alignment issues.
- Fixed the per-chat function picker not displaying correctly.
- Fixed agent toggle removal not persisting.
- Fixed tab/browser refresh causing stale UI state.

---

## Features

### Chat & Roleplay

- **Three Chat Modes** — Conversation (iMessage-style), Roleplay (immersive dark RPG), Visual Novel
- **Character Management** — Create or import characters with avatars, personalities, backstories, and system prompts
- **Avatar Zoom & Repositioning** — Crop and reposition character avatars with a zoom slider and drag-to-pan, applied everywhere avatars appear
- **Persona System** — User personas with custom names, avatars, and descriptions
- **Group Chats** — Multiple characters in a single conversation
- **Chat Branching** — Branch conversations at any message and explore different paths
- **Message Swiping** — Generate alternate responses and swipe between them
- **Slash Commands** — `/narrator`, `/random`, `/sys`, `/as`, `/continue`, `/impersonate`, and more for quick chat control
- **SillyTavern Import** — Migrate characters, chats, presets, and settings from SillyTavern

### Visual & Immersive

- **Sprite System** — Character expression sprites with automatic emotion-based switching
- **Custom Backgrounds** — Upload backgrounds with per-scene switching
- **Weather Effects** — Dynamic weather overlays (rain, snow, fog, etc.)
- **Two Visual Themes** — Y2K Marinara theme and a faithful SillyTavern classic theme
- **Light & Dark Mode**

### AI Agent System (19 Built-In)

Agents are autonomous AI assistants that run alongside your chat, each handling a specific task:

| Agent                   | What It Does                                                             |
| ----------------------- | ------------------------------------------------------------------------ |
| **World State**         | Tracks date/time, weather, location, and present characters              |
| **Quest Tracker**       | Manages quest objectives, completion, and rewards                        |
| **Character Tracker**   | Monitors character moods, relationships, and inventory                   |
| **Persona Stats**       | Tracks your protagonist's HP, MP, XP, and custom stats                   |
| **Narrative Director**  | Introduces events, NPCs, and plot beats to keep the story moving         |
| **Prose Guardian**      | Rewrites AI responses to improve prose quality                           |
| **Continuity Checker**  | Detects contradictions with established lore and facts                   |
| **Combat**              | Turn-based RPG combat with initiative, HP tracking, and actions          |
| **Expression Engine**   | Detects emotions and selects character sprites                           |
| **Background**          | Picks the best background image for the current scene                    |
| **Echo Chamber**        | Simulates a live-stream chat reacting to your roleplay                   |
| **Prompt Reviewer**     | Reviews and scores the assembled prompt before generation                |
| **Illustrator**         | Generates image prompts for key scenes                                   |
| **Lorebook Keeper**     | Automatically creates and updates lorebook entries                       |
| **Immersive HTML**      | Formats roleplay output with styled HTML                                 |
| **Consistency Editor**  | Edits responses for internal consistency                                 |
| **Spotify DJ**          | Controls Spotify playback to match the scene's mood                      |
| **Chat Summarizer**     | Generates condensed summaries of long conversations                      |
| **Knowledge Retrieval** | Scans lorebooks and uploads files for relevant context using chunked RAG |

All agents are disabled by default — enable only the ones you want. You can also create **custom agents** with your own prompts and tool configurations.

### Prompt Engineering

- **Preset System** — Save and load full prompt configurations (system prompt sections, sampling parameters, etc.)
- **Prompt Sections** — Modular prompt builder with drag-and-drop ordering, depth injection, and per-section toggles
- **Lorebooks** — World-building entries with keyword triggers that inject context automatically
- **World Info Inspector** — Live view of active lorebook entries in the current chat, with token usage and keyword details
- **Lorebook Token Counts & Sorting** — Estimated token counts per entry, sortable by order, name, tokens, or keys
- **Regex Scripts** — Custom text processing with regex find/replace on inputs and outputs
- **Macro System** — Template variables like `{{char}}`, `{{user}}`, `{{time}}`, and agent markers

### Connections & Providers

- **Multi-Provider** — OpenAI, Anthropic, Google, OpenRouter, Mistral, Cohere, and any custom OpenAI-compatible endpoint
- **Encrypted API Keys** — API keys are encrypted at rest with AES-256
- **Per-Chat Overrides** — Different presets and connections per chat

### Export & Data

- **Export Chats** — Save as JSON or Markdown
- **Fully Local** — SQLite database, all data stays on your machine
- **No Account Required** — Just install and go

---

## Installation

## Windows EASIEST METHOD

Download **[Marinara-Engine-Installer-1.3.4.exe](https://github.com/SpicyMarinara/Marinara-Engine/releases/download/v1.3.4/Marinara-Engine-Installer-1.3.4.exe)** from the [Releases](https://github.com/SpicyMarinara/Marinara-Engine/releases) page and run it. The installer checks for Node.js and Git, clones the repo, installs dependencies, builds the app, and creates a desktop shortcut.

---

## Alternatives

### Run from Source (All Platforms)

### Prerequisites

You need **Node.js** and **Git** installed before running Marinara Engine. pnpm is handled automatically by the start script.

**Install Node.js v20+:**

| Platform              | How to Install                                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| Windows               | Download the installer from [nodejs.org](https://nodejs.org/en/download) and run it             |
| macOS                 | `brew install node` or download from [nodejs.org](https://nodejs.org/en/download)               |
| Linux (Ubuntu/Debian) | `curl -fsSL https://deb.nodesource.com/setup_22.x \| sudo bash - && sudo apt install -y nodejs` |
| Linux (Fedora)        | `sudo dnf install -y nodejs`                                                                    |
| Linux (Arch)          | `sudo pacman -S nodejs npm`                                                                     |

**Install Git:**

| Platform              | How to Install                                                                      |
| --------------------- | ----------------------------------------------------------------------------------- |
| Windows               | Download from [git-scm.com](https://git-scm.com/download/win) and run the installer |
| macOS                 | `brew install git` or install Xcode Command Line Tools: `xcode-select --install`    |
| Linux (Ubuntu/Debian) | `sudo apt install -y git`                                                           |
| Linux (Fedora)        | `sudo dnf install -y git`                                                           |
| Linux (Arch)          | `sudo pacman -S git`                                                                |

Verify both are installed:

```bash
node -v   # should show v20 or higher
git -v    # should show git version 2.x+
```

### Quick Start

**Windows:**

```
git clone https://github.com/SpicyMarinara/marinara-engine.git
cd marinara-engine
start.bat
```

**macOS / Linux:**

```bash
git clone https://github.com/SpicyMarinara/marinara-engine.git
cd marinara-engine
chmod +x start.sh
./start.sh
```

**Android (Termux):**

Install [Termux](https://f-droid.org/en/packages/com.termux/) from F-Droid (the Play Store version is outdated), then run:

```bash
pkg update && pkg install -y git nodejs-lts && npm install -g pnpm && git clone https://github.com/SpicyMarinara/marinara-engine.git && cd marinara-engine && chmod +x start-termux.sh && ./start-termux.sh
```

The Termux launcher handles everything automatically — it downloads a prebuilt native module, installs dependencies, builds the app, and starts the server at `http://localhost:7860`. First run takes a few minutes on mobile. After that, just run `./start-termux.sh` to start.

> **Tip:** Install the PWA — tap the browser menu and "Add to Home Screen" for a native app feel.

The start script will:

1. **Auto-update** from Git (if a `.git` folder is detected)
2. Check that Node.js and pnpm are installed
3. Install all dependencies (first run only)
4. Build the application
5. Initialize the database
6. Start the server and open `http://localhost:7860` in your browser

### Manual Setup

```bash
git clone https://github.com/SpicyMarinara/marinara-engine.git
cd marinara-engine
pnpm install
pnpm build
pnpm db:push
pnpm start
```

Then open **http://localhost:7860**. That's it — no account, no cloud, everything runs locally.

### Updating

**Updates are automatic.** Every time you launch Marinara Engine via `start.sh`, `start.bat`, or `start-termux.sh`, the launcher:

1. Pulls the latest code from GitHub (`git pull`)
2. Detects if anything changed
3. Reinstalls dependencies and rebuilds automatically
4. Runs database migrations

**You don't need to do anything** — just launch the app as usual, and you'll always be on the latest version.

This works for all platforms: Windows (installer or manual), macOS, Linux, and Termux.

To update manually (e.g., if you don't use the start scripts):

```bash
git pull
pnpm install
pnpm build
pnpm db:push
```

Then restart the server.

---

## Development

```bash
# Start both server + client with hot reload
pnpm dev

# Server only (port 7860)
pnpm dev:server

# Client only (port 5173, proxies API to server)
pnpm dev:client
```

---

## Configuration

Copy `.env.example` to `.env` to customize:

| Variable         | Default                          | Description                                                                                                                                                   |
| ---------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`           | `7860`                           | Server port                                                                                                                                                   |
| `HOST`           | `0.0.0.0`                        | Bind address                                                                                                                                                  |
| `DATABASE_URL`   | `file:./data/marinara-engine.db` | SQLite database path                                                                                                                                          |
| `ENCRYPTION_KEY` | _(empty)_                        | AES key for API key encryption (generate with `openssl rand -hex 32`)                                                                                         |
| `LOG_LEVEL`      | `info`                           | Logging verbosity                                                                                                                                             |
| `CORS_ORIGINS`   | `http://localhost:5173`          | Allowed CORS origins                                                                                                                                          |
| `SSL_CERT`       | _(empty)_                        | Path to TLS certificate (e.g., `fullchain.pem`). Set both `SSL_CERT` and `SSL_KEY` to enable HTTPS                                                            |
| `SSL_KEY`        | _(empty)_                        | Path to TLS private key (e.g. `privkey.pem`)                                                                                                                  |
| `IP_ALLOWLIST`   | _(empty)_                        | Comma-separated IPs or CIDRs to allow (e.g. `192.168.1.100,10.0.0.0/24`). When set, all other IPs are blocked. Loopback (`127.0.0.1`/`::1`) is always allowed |

---

## Project Structure

```
marinara-engine/
├── packages/
│   ├── shared/      # TypeScript types, schemas, constants
│   ├── server/      # Fastify API + SQLite database + AI agents
│   └── client/      # React frontend (Vite + Tailwind v4)
├── start.bat        # Windows launcher
├── start.sh         # macOS/Linux launcher
└── .env.example     # Environment template
```

## Tech Stack

| Layer    | Technology                                                     |
| -------- | -------------------------------------------------------------- |
| Frontend | React 19, Tailwind CSS v4, Framer Motion, Zustand, React Query |
| Backend  | Fastify 5, Drizzle ORM, SQLite                                 |
| PWA      | vite-plugin-pwa, Web App Manifest                              |
| Shared   | TypeScript 5, Zod                                              |
| Build    | Vite 6, pnpm workspaces                                        |

---

## Troubleshooting

### Windows: `EPERM: operation not permitted` when installing pnpm

If you see an error like `EPERM: operation not permitted, open 'C:\Program Files\nodejs\yarnpkg'` or a corepack signature verification failure, this is a Windows permissions issue — corepack can't write to `C:\Program Files\nodejs\`.

**Fix (pick one):**

1. **Run as Administrator** — Right-click your terminal (CMD or PowerShell) and select "Run as administrator", then run `start.bat` again.

2. **Install pnpm manually** (recommended — avoids corepack entirely):

   ```
   npm install -g pnpm
   ```

   Then run `start.bat` again.

3. **Update corepack** (if you want to keep using it):
   ```
   npm install -g corepack
   corepack enable
   corepack prepare pnpm@latest --activate
   ```
   Run these in an Administrator terminal.

---

## License

[AGPL-3.0](LICENSE)
