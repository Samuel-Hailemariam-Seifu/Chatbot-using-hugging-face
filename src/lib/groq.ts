import Groq from 'groq-sdk'

const groqApiKey = process.env.GROQ_API_KEY

if (!groqApiKey) {
  console.warn('GROQ_API_KEY not found. Groq features will be disabled.')
}

const groq = groqApiKey ? new Groq({
  apiKey: groqApiKey,
}) : null

export default groq

