
import { portfolioData } from '../data/portfolioData';

export class ContextService {
  constructor(groqClient) {
    this.groq = groqClient;
  }

  // Classify user intent and select relevant context
  async classifyAndSelectContext(userQuery) {
    if (!this.groq) {
      return { context: "", category: "general" };
    }

    try {
      const classification = await this.groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a context classifier for a software engineer's portfolio. Analyze the user's question and determine what information they need. Respond with ONLY one of these categories:

            - "personal" - for questions about personal info, contact, background, summary
            - "experience" - for questions about work experience, current job, past jobs, responsibilities
            - "projects" - for questions about specific projects, portfolio work, achievements
            - "skills" - for questions about technical skills, programming languages, tools, technologies
            - "education" - for questions about education, degrees, certifications, learning
            - "languages" - for questions about spoken languages, language proficiency
            - "contact" - for questions about how to reach out, contact information
            - "general" - for general questions, greetings, or unclear intent

            **IMPORTANT**: If the user's question is not related to the above categories, respond with "unknown".

            Respond with ONLY the category name, nothing else.`
          },
          {
            role: "user",
            content: userQuery
          }
        ],
        max_tokens: 10,
        temperature: 0.1
      });

      const category = classification.choices[0]?.message?.content?.trim().toLowerCase() || "general";
      const context = this.selectContextByCategory(category);
      
      return { context, category };
    } catch (error) {
      console.error('Error classifying query:', error);
      return { 
        context: this.selectContextByCategory("general"), 
        category: "general" 
      };
    }
  }

  // Select relevant context based on category
  selectContextByCategory(category) {
    switch (category) {
      case "personal":
        return `Personal Information: ${JSON.stringify(portfolioData.personal_info, null, 2)}`;
      
      case "experience":
        return `Work Experience: ${JSON.stringify(portfolioData.experience, null, 2)}`;
      
      case "projects":
        return `Projects: ${JSON.stringify(portfolioData.projects, null, 2)}`;
      
      case "skills":
        return `Technical Skills: ${JSON.stringify(portfolioData.skills, null, 2)}`;
      
      case "education":
        return `Education & Certifications: 
        Education: ${JSON.stringify(portfolioData.education, null, 2)}
        Certifications: ${JSON.stringify(portfolioData.certifications, null, 2)}`;
      
      case "languages":
        return `Languages: ${JSON.stringify(portfolioData.languages, null, 2)}`;
      
      case "contact":
        return `Contact Information:
        Name: ${portfolioData.personal_info.name}
        Email: ${portfolioData.personal_info.email}
        Phone: ${portfolioData.personal_info.phone}
        LinkedIn: ${portfolioData.personal_info.linkedin}`;
      
      default:
        // For general questions, provide a summary
        return `Professional Summary: ${portfolioData.personal_info.summary}
        Current Role: ${portfolioData.experience[0].position} at ${portfolioData.experience[0].company}
        Specializations: ${portfolioData.specializations.join(", ")}
        Key Skills: ${portfolioData.skills.programming.join(", ")}`;
    }
  }

  // Get quick prompt suggestions
  getQuickPrompts() {
    return [
      "Tell me about your experience",
      "What projects have you worked on?",
      "What are your technical skills?",
      "How can I contact you?"
    ];
  }
}