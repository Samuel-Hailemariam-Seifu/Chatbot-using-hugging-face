/**
 * Hugging Face Inference API Client
 * Free Llama models via Hugging Face's inference API
 */

const hfApiKey = process.env.HF_TOKEN
// Default to a simple, widely available model that works on both endpoints
const hfModel = process.env.HF_MODEL || 'gpt2'

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
    // Try router endpoint first, fallback to inference API if router fails
    // Router endpoint: https://router.huggingface.co/models/{model-id}
    // Inference API: https://api-inference.huggingface.co/models/{model-id}
    let apiUrl = `https://router.huggingface.co/models/${hfModel}`
    let response = await fetch(apiUrl, {
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
    })

    // If router returns 404, try the original inference API as fallback
    if (response.status === 404) {
      console.warn(`Router endpoint returned 404 for ${hfModel}, trying inference API as fallback`)
      apiUrl = `https://api-inference.huggingface.co/models/${hfModel}`
      response = await fetch(apiUrl, {
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
      })
    }

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
        errorMessage = 'Model is loading. Please wait 10-30 seconds and try again.'
      }
      
      // Handle not found - might be model issue or router endpoint issue
      if (response.status === 404) {
        errorMessage = `Model "${hfModel}" not found on router endpoint. This model may not be available on the router. Try changing HF_MODEL in .env.local to: google/flan-t5-base, microsoft/DialoGPT-medium, or facebook/blenderbot-400M-distill`
      }
      
      // Check for deprecation message about router
      if (errorMessage.includes('router.huggingface.co')) {
        console.warn('Router endpoint message detected in error')
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
