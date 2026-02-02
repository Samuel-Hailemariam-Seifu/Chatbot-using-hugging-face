/**
 * Hugging Face Inference API Client
 * Free Llama models via Hugging Face's inference API
 */

const hfApiKey = process.env.HF_TOKEN
const hfModel = process.env.HF_MODEL || 'meta-llama/Llama-3.2-3B-Instruct'

// Check if token is placeholder or invalid
const isPlaceholderToken = !hfApiKey || 
  hfApiKey === 'your_huggingface_token_here' || 
  !hfApiKey.startsWith('hf_')

if (isPlaceholderToken) {
  console.warn('HF_TOKEN not found or is placeholder. Hugging Face features will be disabled.')
  console.warn('Please update your .env.local file with a valid token from https://huggingface.co/settings/tokens')
}

interface HuggingFaceResponse {
  generated_text?: string
  error?: string
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * Format messages for Llama chat models
 */
function formatMessagesForLlama(messages: ChatMessage[]): string {
  // Llama models use a specific chat format
  let formatted = ''
  
  for (const msg of messages) {
    if (msg.role === 'system') {
      formatted += `<|system|>\n${msg.content}\n`
    } else if (msg.role === 'user') {
      formatted += `<|user|>\n${msg.content}\n`
    } else if (msg.role === 'assistant') {
      formatted += `<|assistant|>\n${msg.content}\n`
    }
  }
  
  formatted += `<|assistant|>\n`
  return formatted
}

/**
 * Call Hugging Face Inference API
 */
export async function callHuggingFaceAPI(
  messages: ChatMessage[],
  options: {
    temperature?: number
    max_tokens?: number
  } = {}
): Promise<{ content: string; usage?: any }> {
  // Check for placeholder or invalid token
  if (!hfApiKey || hfApiKey === 'your_huggingface_token_here' || !hfApiKey.startsWith('hf_')) {
    throw new Error('HF_TOKEN is not configured. Please update .env.local with a valid token from https://huggingface.co/settings/tokens. Token should start with "hf_"')
  }

  const { temperature = 0.7, max_tokens = 1000 } = options

  // Format messages for Llama
  const prompt = formatMessagesForLlama(messages)

  try {
    // Use the new router endpoint
    const response = await fetch(
      `https://router.huggingface.co/models/${hfModel}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: max_tokens,
            temperature: temperature,
            return_full_text: false,
            top_p: 0.9,
            repetition_penalty: 1.1,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Hugging Face API error: ${response.status} ${response.statusText}`
      
      try {
        const errorData = JSON.parse(errorText)
        if (errorData.error) {
          errorMessage = errorData.error
        }
      } catch {
        errorMessage = errorText || errorMessage
      }

      // Handle model loading
      if (response.status === 503) {
        errorMessage = 'Model is loading. Please wait a moment and try again.'
      }

      throw new Error(errorMessage)
    }

    const data = await response.json()

    // Handle array response (some models return arrays)
    let generatedText = ''
    if (Array.isArray(data)) {
      generatedText = data[0]?.generated_text || data[0]?.text || ''
    } else if (typeof data === 'string') {
      generatedText = data
    } else {
      generatedText = data.generated_text || data.text || ''
    }

    // Clean up the response (remove the prompt if it's included)
    if (generatedText.includes(prompt)) {
      generatedText = generatedText.replace(prompt, '').trim()
    }

    // Remove any remaining format tags
    generatedText = generatedText
      .replace(/<\|assistant\|>\n?/g, '')
      .replace(/<\|user\|>\n?/g, '')
      .replace(/<\|system\|>\n?/g, '')
      .trim()

    return {
      content: generatedText || 'No response generated',
      usage: data.usage || null,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to call Hugging Face API')
  }
}

export { hfApiKey, hfModel }
export default { callHuggingFaceAPI, hfApiKey, hfModel }
