import Groq from 'groq-sdk'

const groqApiKey = process.env.GROQ_API_KEY
const groqModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'

if (!groqApiKey) {
  console.warn('GROQ_API_KEY not found. Groq features will be disabled.')
}

const groq = groqApiKey ? new Groq({
  apiKey: groqApiKey,
}) : null

export default groq
export { groqModel }
