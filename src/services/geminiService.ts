import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Get API key from localStorage or use empty string
const getApiKey = () => localStorage.getItem('geminiApiKey') || '';

// Function to set API key
export const setApiKey = (key: string) => {
  localStorage.setItem('geminiApiKey', key);
};

// Get selected model from localStorage or use default
export const getSelectedModel = () => localStorage.getItem('selectedGeminiModel') || 'gemini-1.5-pro';

// Function to set selected model
export const setSelectedModel = (model: string) => {
  localStorage.setItem('selectedGeminiModel', model);
};

// Function to fetch available models directly from the Gemini API
export async function fetchAvailableModels() {
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      throw new Error('Please enter your Gemini API key to fetch available models');
    }
    
    // Initialize the Gemini API with user's key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    try {
      // Use the API to list available models
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter for Gemini models only and format them
      const geminiModels = data.models
        .filter(model => model.name.includes('gemini'))
        .map(model => {
          // Extract the model ID from the full name (e.g., "models/gemini-1.5-pro" -> "gemini-1.5-pro")
          const id = model.name.split('/').pop();
          
          // Create a user-friendly name and description
          let name = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
          let description = model.displayName || model.description || '';
          
          if (!description) {
            // Generate descriptions based on model name if not provided by API
            if (id.includes('pro')) {
              description = 'Advanced model for complex tasks';
            } else if (id.includes('flash')) {
              description = 'Optimized for speed and efficiency';
            } else if (id.includes('vision')) {
              description = 'Specialized for vision and multimodal tasks';
            } else {
              description = 'General purpose AI model';
            }
          }
          
          return { id, name, description };
        });
      
      return geminiModels;
    } catch (apiError) {
      console.error('Error fetching models from API:', apiError);
      
      // Fallback to static list if API call fails
      return [
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Most capable model for highly complex tasks' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Faster responses with slightly lower quality' },
        { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', description: 'Previous generation pro model' },
        { id: 'gemini-1.0-pro-vision', name: 'Gemini 1.0 Pro Vision', description: 'Specialized for vision tasks' }
      ];
    }
  } catch (error) {
    console.error('Error fetching models:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch available models');
  }
}

export async function analyzeVideo(videoInfo: string) {
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      throw new Error('Please enter your Gemini API key to analyze videos');
    }
    
    // Initialize the Gemini API with user's key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use the selected model or default to Gemini 1.5 Pro
    const selectedModel = getSelectedModel();
    
    // Use Gemini model
    const model = genAI.getGenerativeModel({ 
      model: selectedModel,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
    
    const prompt = `
      Analyze this video: "${videoInfo}"
      
      Please provide:
      1. A concise summary (3-4 sentences)
      2. 5 key points from the video
      3. The overall sentiment (positive, negative, or neutral with explanation)
      4. Main topics discussed (as a list of keywords)
      
      Format your response as JSON with the following structure:
      {
        "summary": "...",
        "keyPoints": ["point1", "point2", "point3", "point4", "point5"],
        "sentiment": "...",
        "topics": ["topic1", "topic2", "..."]
      }
    `;
    
    // Make the actual API call
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Parse the JSON response
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      
      // Fallback: If response isn't valid JSON, create a structured response
      return {
        summary: "The API response couldn't be parsed as JSON. Here's the raw text: " + text.substring(0, 100) + "...",
        keyPoints: ["API returned non-JSON response", "Check your prompt formatting", "Try a different video", "Ensure API key is valid", "Contact support if issue persists"],
        sentiment: "Unable to determine sentiment from non-JSON response",
        topics: ["API Error", "Parsing Issue"]
      };
    }
  } catch (error) {
    console.error('Error analyzing video:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze video. Please try again later.');
  }
}
