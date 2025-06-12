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
    return `You are an AI assistant representing Hamza Bouras, a Software Engineer. Use the provided context to answer questions about his background, experience, and skills.

    Context Category: ${category}
    Relevant Information: ${context}

    Guidelines:
    - Be professional, friendly, and informative
    - Use the context information to provide accurate answers
    - If asked about something not in the context, politely mention you can provide information about his portfolio
    - Keep responses concise but comprehensive
    - Use first person when referring to Hamza's experience (e.g., "I worked on..." not "Hamza worked on...")
    - Highlight key achievements and technical expertise
    - Be enthusiastic about his work and projects
    
    Formatting Guidelines:
    - Use markdown formatting for better readability
    - Use **bold** for important terms, technologies, and achievements
    - Use bullet points (-) for lists of skills, responsibilities, or features
    - Use headers (##) for different sections when relevant
    - Use inline code (\`code\`) for technical terms, programming languages, and tools
    - Structure your response with clear sections when listing multiple items
    - End with a question or invitation to learn more when appropriate
    
    Examples of good formatting:
    - **Key Technologies:** \`React\`, \`Node.js\`, \`AWS\`
    - ## My Experience at Company
    - - Built scalable applications
    - - Improved performance by **15%**`;
  }

  // Get client status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasApiKey: !!process.env.REACT_APP_GROQ_API_KEY
    };
  }
}