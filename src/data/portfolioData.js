export const portfolioData = {
  personal_info: {
    name: "Hamza Bouras",
    title: "Software Engineer",
    phone: "+212 7 66 71 26 23",
    email: "hamzabrse333@gmail.com",
    linkedin: "Hamza Bouras",
    username: "Hamzabourass",
    summary: "Software engineer with a background in computer engineering and networks, specialized in MIAGE. Passionate about software development and eager to leverage my skills to drive innovative projects forward."
  },

  experience: [
    {
      position: "Fullstack Engineer",
      company: "Géomatic",
      duration: "July 2024 - Present",
      type: "fulltime",
      responsibilities: [
        "Maintenance and evolution of a Real Estate Application in ASP.NET for the OCP group",
        "Developing new modules, fixing bugs, Creating SQL scripts for optimizing the SQL Server database",
        "Correcting data types, managing relationships and constraints",
        "Developing mapping interfaces with the ArcGIS API for JavaScript",
        "Deployment and migration to the production environment",
        "Configuring the IIS server, setting up SSL/TLS certificates",
        "Developing PowerShell scripts for backup automation",
        "Publishing mapping services with ArcGIS Server",
        "Development of reusable React components using TypeScript with the ArcGIS API",
        "Reducing development time by 15% and enhancing the user experience in Experience Builder",
        "Designed and deployed geoprocessing APIs using Python and ArcPy",
        "Enabling users to perform spatial analysis"
      ]
    },
    {
      position: "Backend Engineer",
      company: "FeverTokens",
      duration: "Mars-July, 2024",
      type: "intern",
      responsibilities: [
        "Designed an OpenAPI SDK and a secure blockchain transaction system using TypeScript",
        "Used AWS Lambda, Serverless Framework, and KMS for digital asset management",
        "Developed serverless microservices for a Wallet-as-a-Service platform",
        "Integrating crypto wallet operations and blockchain integration features"
      ]
    }
  ],

  projects: [
    {
      name: "AI Tool Suite",
      description: "Created an advanced AI tool suite for automated CV analysis, conversation summarization, and insights extraction, harnessing the power of LangChain and OpenAI with a cutting-edge cloud-native architecture.",
      technologies: ["LangChain", "OpenAI", "Next.js", "Puppeteer", "AWS S3", "Prisma/Neon", "Tailwind", "shadcn", "Google Auth"],
      category: "AI/ML"
    },
    {
      name: "Student Payment Management Platform",
      description: "Developed a comprehensive student payment management platform with a cloud-native architecture, integrating a secure Spring Boot backend and a responsive Angular Material interface. Fully automated the deployment pipeline and AWS cloud infrastructure.",
      technologies: ["Spring Boot", "Angular", "AWS (EC2, ECR)", "Docker", "GitHub Actions", "Terraform", "SonarQube", "Trivy"],
      category: "Full Stack"
    },
    {
      name: "Conversational Database Assistant",
      description: "Developed a Conversational assistant that answers database/SQL queries using RAG architecture that combines vector search and LLM technology with audio/video transcription capabilities and optimized vector search.",
      technologies: ["Python", "FastAPI", "Streamlit", "FAISS", "HuggingFace Embeddings", "Whisper", "Groq API", "SQLite", "Langchain", "Docker"],
      category: "AI/ML"
    },
    {
      name: "Geospatial Mapping Application",
      description: "Developed an interactive web-based geospatial mapping application for analyzing and visualizing stations, with Python scripts for processing spatial data and transforming it into GeoJSON.",
      technologies: ["Spring Boot", "Angular", "ArcGIS API", "PostGIS", "ETL", "Python", "GeoPandas", "SQL Alchemy", "Shapely"],
      category: "GIS/Mapping"
    }
  ],

  skills: {
    programming: ["Java", "TypeScript", "JavaScript", "Python", "SQL", "C#"],
    backend: ["Spring Boot", "ASP.NET", "Node.js"],
    frontend: ["Next.js", "React", "Angular", "Angular Material", "Shadcn", "Tailwind", "Bootstrap"],
    databases: ["SQL Server", "PostgreSQL", "MongoDB", "Vector Databases"],
    cloud: ["AWS (S3, EC2, Lambda, IAM, DynamoDB, ECR)"],
    devops: ["Git", "GitHub Actions", "Terraform", "Ansible", "SonarQube", "CI/CD", "Docker"],
    project_management: ["Problem Solving", "Client Communication", "Agile", "Scrum", "Kanban"],
    gis: ["ArcGIS API", "PostGIS", "GeoPandas", "Shapely", "ArcPy"],
    ai_ml: ["LangChain", "OpenAI", "FAISS", "HuggingFace", "Groq API", "RAG", "Vector Search"]
  },

  education: [
    {
      institution: "Moroccan School of Engineering Sciences (EMSI)",
      degree: "Computer and Network Engineer, specializing in MIAGE",
      duration: "2019-2024"
    },
    {
      institution: "El Farabi",
      degree: "Bachelor's degree in Physics and Chemistry",
      duration: "2018-2019"
    }
  ],

  certifications: [
    "Java Programming: Solving Problems with Software, from Duke University",
    "AWS Cloud Technical Essentials, from Amazon Web Service",
    "Data Collection and Processing with Python, from University of Michigan",
    "Mastering Ansible Automation, from Codio",
    "Introduction to Containers w/ Docker, Kubernetes & OpenShift, from IBM",
    "Advanced React, from Meta"
  ],

  languages: [
    { language: "English", level: "Professional" },
    { language: "French", level: "Professional" },
    { language: "Arabic", level: "Native" }
  ],

  specializations: [
    "Full Stack Development",
    "Cloud Architecture",
    "AI/ML Integration",
    "Geospatial Applications",
    "Blockchain Technology",
    "DevOps and Automation"
  ]
};