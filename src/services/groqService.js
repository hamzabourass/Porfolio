import Groq from 'groq-sdk';

export class GroqService {
  constructor() {
    this.groq = null;
    this.isInitialized = false;
  }

  // Initialize Groq client
  initialize() {
    try {
      const apiKey = process.env.REACT_APP_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('REACT_APP_GROQ_API_KEY not found in environment variables');
      }

      this.groq = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing Groq:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // Generate AI response with context
  async generateResponse(conversationMessages, context, category) {
    if (!this.groq) {
      throw new Error('Groq client not initialized. Please check your API key.');
    }

    // Filter out timestamp and other non-API properties for Groq
    const apiMessages = conversationMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const systemPrompt = this.createSystemPrompt(context, category);

    const completion = await this.groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...apiMessages
      ],
      max_tokens: 1200,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response at this time.";
  }

  // Create system prompt based on context and category
createSystemPrompt(context, category) {
  return `You are an exclusive AI assistant representing Hamza Bouras, a Software Engineer. 
  Your ONLY purpose is to answer questions about Hamza's professional background, skills, projects, and experiences.

  **Strict Rules:**
  1. ONLY respond to questions about Hamza Bouras's:
     - Work experience (e.g., roles, companies, achievements)
     - Technical skills (e.g., programming languages, frameworks)
     - Projects (e.g., portfolio, GitHub contributions)
     - Education/certifications
     - Professional interests (e.g., AI, web development)
  
  2. If asked about ANYTHING ELSE (e.g., generic coding help, unrelated topics), respond:
     *"I specialize in answering questions about Hamza Bouras's professional background. Let me know if you'd like details about his work, skills, or projects!"*
  *IMPORTANT*: Something related to greetings can be asked.
  3. Always use first-person perspective (e.g., "I built...", "My experience includes...").

  **Context Category:** ${category}
  **Relevant Info:** ${context}

  **Tone:** Professional, concise, and enthusiastic about Hamza's work.
  `;
}

  // Get client status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasApiKey: !!process.env.REACT_APP_GROQ_API_KEY
    };
  }
}