# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

- Initial release of Free AI Chatbot
- Next.js 14+ with App Router and TypeScript
- TailwindCSS for responsive styling
- Hugging Face Inference API integration
- Chat UI with message bubbles and loading states
- Environment configuration for model selection
- One-click Vercel deployment support
- Comprehensive documentation and setup guides
- Error handling for missing tokens and API failures
- Mobile-first responsive design
- Enter-to-send functionality
- Auto-scroll to latest messages
- Model swapping via environment variables

### Features

- **Zero Cost**: Uses Hugging Face's free inference API
- **Modern Stack**: Next.js 14+, TypeScript, TailwindCSS
- **Responsive UI**: Clean chat interface that works on all devices
- **Easy Deployment**: Ready for Vercel deployment
- **Model Flexibility**: Easy model swapping via `HF_MODEL` env var
- **Error Handling**: Graceful error handling and user feedback
- **Type Safety**: Full TypeScript support with proper typing

### Technical Details

- API route at `/api/chat` for Hugging Face integration
- Support for multiple Hugging Face models
- Configurable model parameters (temperature, max tokens, etc.)
- Proper error handling and status codes
- Environment variable validation
- Production-ready build configuration

### Documentation

- Comprehensive README with setup instructions
- Deployment guide for Vercel
- Model configuration examples
- Troubleshooting and limitations section
- MIT License included
