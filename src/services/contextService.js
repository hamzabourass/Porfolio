import { portfolioData } from '../data/portfolioData';

export class ContextService {
  constructor(groqClient) {
    this.groq = groqClient;
  }

  async classifyAndSelectContext(userQuery) {
    if (!this.groq) {
      return { context: "", categories: ["general"] };
    }

    try {
      const classification = await this.groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a context classifier for a software engineer's portfolio. Analyze the user's question and determine what information they need. 

            Available categories:
            - "personal" - for questions about personal info, contact, background, summary
            - "experience" - for questions about work experience, current job, past jobs, responsibilities
            - "projects" - for questions about specific projects, portfolio work, achievements
            - "skills" - for questions about technical skills, programming languages, tools, technologies
            - "education" - for questions about education, degrees, certifications, learning
            - "languages" - for questions about spoken languages, language proficiency
            - "contact" - for questions about how to reach out, contact information
            - "general" - for general questions, greetings, or unclear intent

            **IMPORTANT INSTRUCTIONS:**
            - If the question relates to MULTIPLE categories, list them separated by commas
            - If the user asks broadly about "you", "yourself", "background", include: personal,experience,skills
            - If the user asks about "work" or "career", include: experience,projects,skills
            - If the question is not related to any categories, respond with "unknown"
            - Order categories by relevance (most relevant first)

            **Examples:**
            - "Tell me about yourself" → personal,experience,skills
            - "What's your background and experience?" → personal,experience,education
            - "Tell me about your work and projects" → experience,projects,skills
            - "What technologies do you use at work?" → skills,experience
            - "How can I contact you and what's your background?" → contact,personal
            - "What's your education and skills?" → education,skills

            Respond with ONLY the category names separated by commas, nothing else.`
          },
          {
            role: "user",
            content: userQuery
          }
        ],
        max_tokens: 50,
        temperature: 0.1
      });

      const response = classification.choices[0]?.message?.content?.trim().toLowerCase() || "general";
      const categories = response.split(',').map(cat => cat.trim()).filter(cat => cat);
      
      const validCategories = ["personal", "experience", "projects", "skills", "education", "languages", "contact", "general"];
      const filteredCategories = categories.filter(cat => validCategories.includes(cat));
      
      const finalCategories = filteredCategories.length > 0 ? filteredCategories : ["general"];
      
      const context = this.selectContextByCategories(finalCategories);
      
      return { context, categories: finalCategories };
    } catch (error) {
      console.error('Error classifying query:', error);
      return { 
        context: this.selectContextByCategories(["general"]), 
        categories: ["general"] 
      };
    }
  }

  selectContextByCategories(categories) {
    let combinedContext = "";
    const processedCategories = [];

    categories.forEach(category => {
      if (!processedCategories.includes(category)) {
        const categoryContext = this.selectSingleCategoryContext(category);
        if (categoryContext) {
          combinedContext += categoryContext + "\n\n";
          processedCategories.push(category);
        }
      }
    });

    return combinedContext.trim();
  }

  selectSingleCategoryContext(category) {
    switch (category) {
      case "personal":
        return `=== PERSONAL INFORMATION ===
Name: ${portfolioData.personal_info.name}
Title: ${portfolioData.personal_info.title}
Summary: ${portfolioData.personal_info.summary}
Specializations: ${portfolioData.specializations.join(", ")}`;
      
      case "experience":
        return `=== WORK EXPERIENCE ===
${portfolioData.experience.map(exp => 
          `Position: ${exp.position} at ${exp.company} (${exp.duration})
Type: ${exp.type}
Key Responsibilities:
${exp.responsibilities.map(resp => `- ${resp}`).join('\n')}`
        ).join('\n\n')}`;
      
      case "projects":
        return `=== PROJECTS ===
${portfolioData.projects.map(project => 
          `Project: ${project.name}
Category: ${project.category}
Description: ${project.description}
Technologies: ${project.technologies.join(', ')}`
        ).join('\n\n')}`;
      
      case "skills":
        return `=== TECHNICAL SKILLS ===
Programming Languages: ${portfolioData.skills.programming.join(', ')}
Backend Technologies: ${portfolioData.skills.backend.join(', ')}
Frontend Technologies: ${portfolioData.skills.frontend.join(', ')}
Databases: ${portfolioData.skills.databases.join(', ')}
Cloud Platforms: ${portfolioData.skills.cloud.join(', ')}
DevOps & Tools: ${portfolioData.skills.devops.join(', ')}
Project Management: ${portfolioData.skills.project_management.join(', ')}
GIS Technologies: ${portfolioData.skills.gis.join(', ')}
AI/ML Technologies: ${portfolioData.skills.ai_ml.join(', ')}`;
      
      case "education":
        return `=== EDUCATION & CERTIFICATIONS ===
Education:
${portfolioData.education.map(edu => 
          `- ${edu.degree} from ${edu.institution} (${edu.duration})`
        ).join('\n')}

Certifications:
${portfolioData.certifications.map(cert => `- ${cert}`).join('\n')}`;
      
      case "languages":
        return `=== LANGUAGES ===
${portfolioData.languages.map(lang => 
          `${lang.language}: ${lang.level}`
        ).join('\n')}`;
      
      case "contact":
        return `=== CONTACT INFORMATION ===
Name: ${portfolioData.personal_info.name}
Email: ${portfolioData.personal_info.email}
Phone: ${portfolioData.personal_info.phone}
LinkedIn: ${portfolioData.personal_info.linkedin}
Username: ${portfolioData.personal_info.username}`;
      
      case "general":
        return `=== PROFESSIONAL OVERVIEW ===
Name: ${portfolioData.personal_info.name}
Title: ${portfolioData.personal_info.title}
Summary: ${portfolioData.personal_info.summary}
Current Role: ${portfolioData.experience[0].position} at ${portfolioData.experience[0].company}
Specializations: ${portfolioData.specializations.join(", ")}
Key Programming Languages: ${portfolioData.skills.programming.slice(0, 5).join(", ")}
Recent Projects: ${portfolioData.projects.slice(0, 2).map(p => p.name).join(", ")}`;
      
      default:
        return null;
    }
  }

  getQuickPrompts() {
    return [
      "Tell me about yourself and your background",
      "What's your experience and key projects?",
      "What are your technical skills and expertise?",
      "How can I contact you?"
    ];
  }

  getDetailedPrompts() {
    return [
      "Tell me about yourself", 
      "What's your professional background?",
      "Tell me about your work and projects",
      "What technologies do you use?", 
      "How can I reach you?", 
      "What's your education and experience?", 
      "Tell me about your career and achievements", 
      "What programming languages and tools do you know?", 
    ];
  }
}