# Free AI Chatbot

A production-ready, free AI chatbot built with Next.js 14+ and powered by Hugging Face's free inference API. No paid services required!

## 🚀 Features

- **Zero Cost**: Uses Hugging Face's free inference API
- **Modern Stack**: Next.js 14+ with App Router, TypeScript, and TailwindCSS
- **Responsive UI**: Clean, mobile-first chat interface
- **Easy Deployment**: One-click deploy to Vercel
- **Model Flexibility**: Easy model swapping via environment variables

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js UI    │───▶│   API Route      │───▶│  Hugging Face   │
│   (React)       │    │   /api/chat      │    │  Inference API  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📸 Screenshots

![Hero Screenshot](./public/hero.png)
_Clean, modern chat interface_

![Chat Screenshot](./public/chat.png)
_Responsive message bubbles with loading states_

## 🛠️ Setup

### Prerequisites

- Node.js 20.11.0+ (see `.nvmrc`)
- npm or yarn
- Hugging Face account (free)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd free-chatbot
npm install
```

### 2. Get Hugging Face Token

1. Go to [Hugging Face](https://huggingface.co/settings/tokens)
2. Create a new token (write access - required for Inference API)
3. Copy the token

### 3. Environment Setup

```bash
cp env.example .env.local
```

Edit `.env.local`:

```env
HF_TOKEN=your_huggingface_token_here
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `HF_TOKEN`: Your Hugging Face token
   - `HF_MODEL`: `mistralai/Mistral-7B-Instruct-v0.2` (optional)
4. Deploy!

## 🔧 Model Configuration

### Available Models

You can swap models by changing the `HF_MODEL` environment variable:

```env
# Default (recommended)
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2

# Alternative models
HF_MODEL=microsoft/DialoGPT-medium
HF_MODEL=facebook/blenderbot-400M-distill
HF_MODEL=EleutherAI/gpt-neo-2.7B
```

### Model Tips

- **Mistral-7B**: Best balance of quality and speed
- **DialoGPT**: Good for conversational AI
- **Blenderbot**: Facebook's conversational model
- **GPT-Neo**: Larger, slower but more capable

## 🧪 Testing

### Manual Testing Steps

1. Start the development server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Send a test message: "Hello, how are you?"
4. Verify the AI responds appropriately
5. Test error handling by removing `HF_TOKEN` from `.env.local`
6. Verify error message appears in chat

### Build Test

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
free-chatbot/
├── src/
│   └── app/
│       ├── api/
│       │   └── chat/
│       │       └── route.ts          # Hugging Face API integration
│       ├── globals.css               # TailwindCSS styles
│       ├── layout.tsx                # Root layout
│       └── page.tsx                  # Chat UI component
├── public/
│   ├── hero.png                      # Screenshot placeholder
│   ├── chat.png                      # Screenshot placeholder
│   └── favicon.ico                   # Site icon
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
├── .nvmrc                           # Node version
├── .editorconfig                     # Editor configuration
├── package.json                      # Dependencies
├── tailwind.config.ts               # TailwindCSS config
├── tsconfig.json                    # TypeScript config
├── next.config.mjs                  # Next.js config
└── README.md                        # This file
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## ⚠️ Limitations & Tips

### Hugging Face Free Tier Limitations

- **Rate Limits**: ~1000 requests/month
- **Cold Starts**: First request may take 10-30 seconds
- **Model Loading**: Models load on-demand, causing initial delays
- **Concurrent Requests**: Limited concurrent processing

### Performance Tips

1. **Keep Conversations Short**: Limit message history to reduce token usage
2. **Use Smaller Models**: Faster response times with smaller models
3. **Implement Caching**: Cache responses for repeated questions
4. **Monitor Usage**: Track API usage to avoid hitting limits

### Error Handling

The app handles common errors gracefully:

- Missing `HF_TOKEN` → Clear error message
- API timeouts → Retry mechanism
- Invalid responses → Fallback messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co) for providing free AI models
- [Next.js](https://nextjs.org) for the amazing React framework
- [Vercel](https://vercel.com) for seamless deployment
- [TailwindCSS](https://tailwindcss.com) for beautiful styling

