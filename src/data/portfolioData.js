export const portfolioData = {
  personal_info: {
    name: "Hamza Bouras",
    title: "Software Engineer",
    phone: "+212 7 66 71 26 23",
    email: "hamzabrse333@gmail.com",
    linkedin: "Hamza Bouras - Link: https://www.linkedin.com/in/hamza-1-bouras/",
    Github: "Hamzabourass - Link: https://github.com/hamzabourass",
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
    "Developing new modules, fixing bugs, creating SQL scripts for optimizing the SQL Server database (OCP Group - Regis)",
    "Correcting data types, managing relationships and constraints (OCP Group - Regis)",
    "Developing mapping interfaces with the ArcGIS API for JavaScript (OCP Group - Regis)",
    "Deployment and migration to the production environment (OCP Group - Regis)",
    "Configuring the IIS server, setting up SSL/TLS certificates (OCP Group - Regis)",
    "Developing PowerShell scripts for backup automation (OCP Group - Regis)",
    "Publishing mapping services with ArcGIS Server (OCP Group - Regis)",

    "Development of reusable React components using TypeScript with the ArcGIS API (AURS (Agence Urbaine de Rabat et Salé) - Urban Analysis Applications)",
    "Reducing development time by 15% and enhancing the user experience in Experience Builder (AURS (Agence Urbaine de Rabat et Salé) - Urban Analysis Applications)",
    "Creating applications using Experience Builder Developer Edition for urban analysis and reporting (AURS (Agence Urbaine de Rabat et Salé) - Urban Analysis Applications)",
    "Designing widgets tailored to specific users such as investors to access relevant urban information (AURS (Agence Urbaine de Rabat et Salé) - Urban Analysis Applications)",
    "Deploying Experience Builder applications to the IIS server environment (AURS (Agence Urbaine de Rabat et Salé) - Urban Analysis Applications)",

    "Designed and deployed geoprocessing APIs using Python and ArcPy (ANEEF (Agence Nationale des Eaux et des Forêts) – Geoprocessing Services)",
    "Enabling users to perform spatial analysis by integrating RESTful APIs into internal CRM systems (ANEEF (Agence Nationale des Eaux et des Forêts) – Geoprocessing Services)",
    "Publishing geoprocessing tools on ArcGIS Server for enterprise-wide access (ANEEF (Agence Nationale des Eaux et des Forêts) – Geoprocessing Services)",

    "Designing and managing the conceptual data model (MCD) for an irrigation GIS platform for ORMVAL (Office Régional de Mise en Valeur Agricole du Loukkos)",
    "Cleaning and structuring spatial and tabular data, mapping source files to database tables (ORMVAL (Office Régional de Mise en Valeur Agricole du Loukkos) - Irrigation GIS Project Arcgis Enterprise)",
    "Integrating and validating irrigation network data into ArcGIS Pro (ORMVAL (Office Régional de Mise en Valeur Agricole du Loukkos) - Irrigation GIS Project Arcgis Enterprise)",
    "Coordinating with interns to normalize and prepare real-world data for system integration (ORMVAL (Office Régional de Mise en Valeur Agricole du Loukkos) - Irrigation GIS Project Arcgis Enterprise)",
    "Documenting data lineage, resolving schema mismatches, and supporting client deployment preparation (ORMVAL (Office Régional de Mise en Valeur Agricole du Loukkos) - Irrigation GIS Project Arcgis Enterprise)"
  ]
},

    {
      position: "Backend Engineer",
      company: "FeverTokens",
      duration: "Mars-July, 2024",
      type: "intern",
      responsibilities: [
        "Contributing in the development of Fevetokens No-Code Web3 Solution Platform",
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
      description: "Developed a Conversational assistant that answers database/SQL queries using RAG architecture that combines vector search and LLM technology with audio/video transcription capabilities and optimized vector search with OCR Capabilities to extract text from images and an agent that Requests data from Apex api to get latest database schema.",
      technologies: ["Python", "FastAPI", "Streamlit", "FAISS", "HuggingFace Embeddings", "Whisper", "Groq API", "SQLite", "Langchain", "Docker","OCR","Oracle Apex Rest API"],
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
    "Java Programming: Solving Problems with Software, from Duke University, Link to Certificate: https://coursera.org/share/b0223bb536223fb920653d1e13d8e366 ",
    "AWS Cloud Technical Essentials, from Amazon Web Service, Link to Certificate: https://coursera.org/share/d31c234ca615dbe9c8e1cee700acbf7e ",
    "Data Collection and Processing with Python, from University of Michigan, Link to Certificate: https://coursera.org/share/9aac7cf2564448d12ae5e6bee45cc6c3",
    "Mastering Ansible Automation, from Codio, Link to Certificate: https://coursera.org/share/d8a2619e168fa152f5561ec73ab83ea1",
    "Introduction to Containers w/ Docker, Kubernetes & OpenShift, from IBM, Link to Certificate: https://coursera.org/share/97aca2b01b95dd993cf8989dc5549cd1",
    "Advanced React, from Meta, Link to Certificate: https://coursera.org/share/3efc7c5b6c17988bb887268b4fc304b5",
    "DevOps, Cloud, and Agile Foundations, from IBM, Link to Certificate: https://coursera.org/share/71a15da010123d20461f0eee67d0ab63",
    "Hands-on Introduction to Linux Commands and Shell Scripting, from IBM, Link to Certificate: https://coursera.org/share/b219cb8582a9d51d038436c70cdc1ea1",
    "Building Scalable Java Microservices with Spring Boot and Spring Cloud, From Google Cloud, Link to Certificate: https://coursera.org/share/cb5f16f2d0e21beaf023877330774586",
    "Machine Learning with Python, From IBM, Link to Certificate: https://coursera.org/share/b219cb8582a9d51d038436c70cdc1ea1",
    "Interactivity with JavaScript, From University of Michigan, Link to Certificate: https://coursera.org/share/0b28eb77d68c48ac0d7c1d34ccd5e5c0",
    "Front-End Web UI Frameworks and Tools: Bootstrap 4, From The Hong Kong University of Science and Technology, Link to Certificate: https://coursera.org/share/67e1bfd987a342f0a97f7ec55aa12def",
    "Linear Algebra for Machine Learning and Data Science, From DeepLearning.ai, Link to Certificate: https://coursera.org/share/05b2c09079f1f08f00025b50f5106a45",
    "Developing Back-End Apps with Node.js and Express, From IBM, Link to Certificate: https://coursera.org/share/edb1147e5fe3ab50234f9b25557bb588",
    "Python Project: Software Engineering and Image Manipulation, From University of Michigan, Link to Certificate: https://coursera.org/share/5ec39a6059113ba38ea764b8344f253d",
    "React Native, From Meta, Link to Certificate: https://coursera.org/share/dc4934fda40924ca4d2145c980c8d08a",
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