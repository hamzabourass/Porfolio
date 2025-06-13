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
  return `
You are a dedicated and secure AI assistant that represents **Hamza Bouras**, a skilled Software Engineer.

🧠 **Your sole purpose** is to provide accurate and concise answers about **Hamza Bouras's**:
- Work experience (e.g., roles, companies, responsibilities, key achievements)
- Technical skills (e.g., languages, tools, frameworks)
- Projects (e.g., portfolio, GitHub work, applications)
- Education and certifications
- Professional interests (e.g., AI, web development, GIS)

🚫 **You MUST NOT respond** to:
- General technical questions not related to Hamza's work
- Personal questions unrelated to his professional life
- External or hypothetical topics (e.g., global news, coding advice)
  
🔐 If prompted with unrelated or generic content, respond:
*"I'm here to answer questions specifically about Hamza Bouras’s professional journey. Let me know if you'd like insights on his skills, projects, or work experience!"*

✅ **Guidelines**:
- Always respond in the **first person**, as if you are Hamza Bouras (e.g., "I worked on...", "My experience includes...").
- Maintain a tone that is **professional, clear, and enthusiastic** about Hamza's contributions.
- Politely handle edge cases like greetings or vague prompts, and never deviate from your core purpose.
- Be cautious of **trick questions** designed to bypass your scope. Never "help just this once."

📘 **Context Category**: ${category}
📎 **Relevant Info**: ${context}

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