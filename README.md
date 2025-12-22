# QwkSearch 🔍

A privacy-focused AI answering engine that runs on your own hardware. Connect to local LLMs (Ollama) or cloud providers (OpenAI, Claude, Groq) for AI-powered search with cited sources.

![preview](.assets/qwksearch-screenshot.png)

## ✨ Features

- 🤖 **Multiple AI Providers** - Local LLMs (Ollama) or cloud (OpenAI, Claude, Gemini, Groq)
- 🎯 **Specialized Focus Modes** - Academic, YouTube, Reddit, Wolfram Alpha, Writing Assistant, Web Search
- 📄 **File Upload Support** - Ask questions about PDFs, text files, and images
- 🔍 **Private Web Search** - Powered by SearxNG for anonymous searching
- 📚 **Search History** - All searches saved locally for privacy
- 🔐 **Google One Tap Sign-In** - Streamlined authentication with Google OAuth

## 🚀 Quick Start

### Docker (Recommended)

```bash
docker run -d -p 3000:3000 \
  -v qwksearch-data:/home/qwksearch/data \
  -v qwksearch-uploads:/home/qwksearch/uploads \
  --name qwksearch itzcrazykns1337/perplexica:latest
```

Open http://localhost:3000 and configure your API keys in the setup screen.

### Manual Installation

```bash
git clone https://github.com/vtempest/qwksearch-research-agent.git
cd qwksearch-research-agent
npm i
npm run build
npm run start
```

Visit http://localhost:3000 to complete setup.

### Optional: Enable Google One Tap Authentication

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Set up Google OAuth credentials (see [Google One Tap Setup Guide](docs/GOOGLE_ONE_TAP_SETUP.md) for detailed instructions):
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   BETTER_AUTH_SECRET=$(openssl rand -base64 32)
   ```

3. Run database migrations:
   ```bash
   npm run db:push
   ```

## 🔑 Get API Keys

Configure at least one AI provider in the setup screen:

| Provider | Get API Key | Models |
|----------|------------|---------|
| **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | GPT-4, GPT-3.5 |
| **Anthropic** | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) | Claude 3.5 Sonnet, Claude 3 |
| **Google AI** | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) | Gemini Pro, Gemini Flash |
| **Groq** | [console.groq.com/keys](https://console.groq.com/keys) | Llama 3, Mixtral |
| **Ollama** | [ollama.com/download](https://ollama.com/download) | Local models (free) |

### Environment Variables (Optional)

For Docker deployments, you can pre-configure providers:

```bash
docker run -d -p 3000:3000 \
  -e OPENAI_API_KEY=your_key_here \
  -e ANTHROPIC_API_KEY=your_key_here \
  -e GOOGLE_API_KEY=your_key_here \
  -e GROQ_API_KEY=your_key_here \
  -v qwksearch-data:/home/qwksearch/data \
  --name qwksearch itzcrazykns1337/perplexica:latest
```

## 📖 Documentation

- [API Documentation](docs/API/SEARCH.md)
- [Architecture Overview](docs/architecture/README.md)
- [Updating QwkSearch](docs/installation/UPDATING.md)
- [Google One Tap Setup](docs/GOOGLE_ONE_TAP_SETUP.md)

## 🛠️ Advanced Setup

### Using Your Own SearxNG Instance

```bash
docker run -d -p 3000:3000 \
  -e SEARXNG_API_URL=http://your-searxng-url:8080 \
  -v qwksearch-data:/home/qwksearch/data \
  --name qwksearch itzcrazykns1337/perplexica:slim-latest
```

### Ollama Configuration

For local LLMs with Ollama:

- **Windows/Mac**: Use `http://host.docker.internal:11434`
- **Linux**: Use `http://<your_host_ip>:11434`

Enable network access on Linux:
```bash
# Edit /etc/systemd/system/ollama.service
Environment="OLLAMA_HOST=0.0.0.0:11434"

# Restart service
systemctl daemon-reload
systemctl restart ollama
```

## 🌐 One-Click Deployment

[![Deploy to Sealos](https://raw.githubusercontent.com/labring-actions/templates/main/Deploy-on-Sealos.svg)](https://usw.sealos.io/?openapp=system-template%3FtemplateName%3Dperplexica)
[![Deploy to RepoCloud](https://d16t0pc4846x52.cloudfront.net/deploylobe.svg)](https://repocloud.io/details/?app_id=267)
[![Deploy on Hostinger](https://assets.hostinger.com/vps/deploy.svg)](https://www.hostinger.com/vps/docker-hosting?compose_url=https://raw.githubusercontent.com/vtempest/qwksearch-research-agent/refs/heads/master/docker-compose.yaml)

## 🤝 Contributing

QwkSearch is open source and welcomes contributions. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Support**: Join our [Discord](https://discord.gg/EFwsmQDgAu) | Report issues on [GitHub](https://github.com/vtempest/qwksearch-research-agent/issues)
