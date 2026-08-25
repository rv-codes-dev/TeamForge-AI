export interface SkillOption {
  name: string;
  category: string;
  defaultProficiency?: number;
  popular?: boolean;
}

export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'AI / ML',
  'Cloud / DevOps',
  'Design',
  'Cybersecurity',
  'Data',
  'Mobile',
  'Systems & IoT',
  'Web3',
  'Product / Business',
] as const;

export const CATEGORIZED_SKILLS: Record<string, string[]> = {
  'Frontend': [
    'HTML5 / CSS3', 'JavaScript (ES6+)', 'TypeScript', 'React 19', 'Next.js', 'Vue 3', 'Nuxt.js', 
    'Angular', 'Svelte / SvelteKit', 'SolidJS', 'Astro', 'Remix', 'Tailwind CSS', 'Shadcn UI', 
    'Three.js / WebGL', 'Framer Motion', 'Redux Toolkit', 'Zustand', 'TanStack Query', 'Vite', 'Webpack'
  ],
  'Backend': [
    'Node.js', 'Express.js', 'NestJS', 'Fastify', 'Python', 'FastAPI', 'Django', 'Flask', 
    'Go / Golang', 'Rust', 'Java', 'Spring Boot', 'C++', 'C# / .NET', 'Elixir / Phoenix', 
    'Ruby on Rails', 'GraphQL', 'RESTful APIs', 'gRPC', 'WebSockets / Socket.io', 'Celery', 'Apache Kafka', 'RabbitMQ'
  ],
  'Database': [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase Firestore', 'Pinecone (Vector DB)', 
    'Weaviate', 'ChromaDB', 'Qdrant', 'Milvus', 'Neo4j (Graph DB)', 'DynamoDB', 'Cassandra', 
    'ClickHouse', 'DuckDB', 'Prisma ORM', 'Drizzle ORM', 'SQL / Query Optimization'
  ],
  'AI / ML': [
    'PyTorch', 'TensorFlow', 'Scikit-learn', 'Computer Vision (OpenCV)', 'Natural Language Processing (NLP)', 
    'Hugging Face Transformers', 'Generative AI / LLMs', 'LangChain', 'LlamaIndex', 'RAG Pipelines', 
    'Gemini API', 'OpenAI API', 'Agentic AI (CrewAI / AutoGen)', 'Prompt Engineering', 'Vector Embeddings', 
    'Whisper / Speech AI', 'Stable Diffusion / ComfyUI', 'Ollama / vLLM', 'TensorRT / ONNX Runtime', 'CUDA Programming'
  ],
  'Cloud / DevOps': [
    'AWS (Lambda, S3, ECS, EKS)', 'Google Cloud Platform (GCP)', 'Microsoft Azure', 'Docker', 
    'Kubernetes (K8s)', 'Helm', 'Terraform', 'Pulumi', 'CI/CD (GitHub Actions, GitLab CI)', 
    'Linux / Shell Scripting', 'Nginx', 'Prometheus', 'Grafana', 'Cloudflare Workers / Edge', 'ArgoCD'
  ],
  'Design': [
    'UI/UX Design', 'Figma', 'Design Systems', 'Interactive Prototyping', 'Wireframing', 
    'User Research & Usability Testing', 'Adobe Creative Suite', 'Blender / 3D Asset Design', 'Micro-interactions', 'Accessibility (WCAG AA)'
  ],
  'Cybersecurity': [
    'Zero Trust Architecture', 'Penetration Testing & Ethical Hacking', 'OWASP Top 10 Security', 
    'Network Security & Wireshark', 'Cryptography', 'Cloud Security (IAM, VPC)', 'OAuth 2.0 / OpenID Connect', 
    'JWT & Auth0 / Clerk', 'SIEM & Threat Hunting', 'Smart Contract Auditing'
  ],
  'Data': [
    'Data Science & Modeling', 'Pandas & NumPy', 'Polars', 'Data Visualization (D3.js / Recharts)', 
    'Apache Spark', 'Databricks', 'Snowflake', 'dbt (data build tool)', 'Apache Airflow', 
    'Power BI', 'Tableau', 'Statistical Hypothesis Testing'
  ],
  'Mobile': [
    'Flutter', 'React Native', 'Expo', 'Kotlin Multiplatform (KMP)', 'Android (Jetpack Compose)', 
    'iOS (Swift & SwiftUI)', 'Tauri', 'Capacitor', 'Mobile UX Optimization'
  ],
  'Systems & IoT': [
    'ROS2 / Robotics', 'Arduino', 'ESP32 Microcontrollers', 'Raspberry Pi / Edge Computing', 
    'Embedded C / C++', 'MQTT / IoT Protocols', 'Sensor Fusion & Hardware Interfacing', 'FPGA / Verilog'
  ],
  'Web3': [
    'Solidity', 'EVM Smart Contracts', 'Ethers.js / Viem', 'Hardhat / Foundry', 
    'IPFS / Decentralized Storage', 'Zero Knowledge Proofs (ZK-SNARKs)'
  ],
  'Product / Business': [
    'Technical Product Management', 'Agile / Scrum Sprint Leadership', 'System Architecture & Roadmapping', 
    'Pitch Deck & Storytelling', 'Competitive Analysis', 'Growth & Developer Marketing', 'Public Speaking'
  ]
};

export const ALL_SKILLS_FLAT: { name: string; category: string }[] = Object.entries(CATEGORIZED_SKILLS).flatMap(
  ([category, skills]) => skills.map(name => ({ name, category }))
);

export const DOMAIN_INTERESTS = [
  'AI & Generative LLMs',
  'Agentic Systems & Automation',
  'Computer Vision & Robotics',
  'Agriculture & ClimateTech',
  'Healthcare & BioTech',
  'FinTech & Fraud Detection',
  'Cybersecurity & Zero Trust',
  'Developer Tools & Infrastructure',
  'EdTech & Learning Systems',
  'Web3 & Privacy Protocols',
  'IoT & Edge Hardware',
  'Autonomous Vehicles & Drones',
  'Gaming & Interactive 3D',
  'Social & Community Platforms',
  'High-Performance Distributed Systems'
];

export const PREFERRED_ROLES = [
  'AI/ML Engineer',
  'GenAI & LLM Architect',
  'Full Stack Developer',
  'Frontend Specialist',
  'Backend & Distributed Systems Engineer',
  'Cloud & DevOps Engineer',
  'UI/UX & Product Designer',
  'Data Scientist & Analytics Lead',
  'Cybersecurity & Systems Architect',
  'Mobile App Developer (iOS/Android/Flutter)',
  'Robotics & Embedded Systems Engineer',
  'Technical Product Lead / PM',
  'Pitch Lead & Demo Presenter'
];

export const DEMO_USER_PROFILE = {
  id: 'user-alex-rivera',
  fullName: 'Alex Rivera',
  email: 'alex.rivera@berkeley.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  age: 21,
  university: 'UC Berkeley',
  department: 'EECS / Artificial Intelligence',
  year: 'Senior',
  bio: 'Building resilient AI systems for real-world edge devices. 3x hackathon winner focused on Computer Vision and full-stack ML deployments.',
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com',
  portfolioUrl: 'https://alexrivera.dev',
  skills: [
    { name: 'Computer Vision', level: 94, interest: 95, yearsOfExperience: 3, category: 'AI / ML', highlight: true },
    { name: 'Machine Learning', level: 91, interest: 90, yearsOfExperience: 3, category: 'AI / ML', highlight: true },
    { name: 'Python', level: 95, interest: 85, yearsOfExperience: 4, category: 'Backend' },
    { name: 'PyTorch', level: 88, interest: 95, yearsOfExperience: 2, category: 'AI / ML' },
    { name: 'React', level: 82, interest: 75, yearsOfExperience: 2, category: 'Frontend' },
    { name: 'Docker', level: 75, interest: 80, yearsOfExperience: 1, category: 'Cloud / DevOps' },
  ],
  interests: ['AI / ML', 'Agriculture', 'Robotics', 'Sustainability', 'Startups'],
  preferredRoles: ['AI/ML Engineer', 'Full Stack Developer', 'Project Lead'],
  projects: [
    {
      id: 'p1',
      name: 'AgriVision Lite',
      description: 'Edge computer vision pipeline detecting crop rust on low-power sensor cameras at 30fps.',
      technologies: ['Python', 'OpenCV', 'PyTorch', 'FastAPI'],
      role: 'ML Lead'
    },
    {
      id: 'p2',
      name: 'NeuralPathfinder',
      description: 'Autonomous indoor navigation robot mapping obstacles using stereo camera depth estimation.',
      technologies: ['ROS2', 'C++', 'Python', 'YOLOv8'],
      role: 'Core Engineer'
    }
  ],
  hackathonsWon: 3,
  certifications: ['AWS Certified Machine Learning Specialty', 'DeepLearning.AI TensorFlow Developer'],
  achievements: ['1st Place CalHacks 2024 (AgTech Track)', 'Best Technical Execution TreeHacks 2023'],
  yearsOfExperience: 3,
  availability: {
    days: {
      Monday: { morning: true, afternoon: true, evening: true, night: false },
      Tuesday: { morning: false, afternoon: true, evening: true, night: true },
      Wednesday: { morning: true, afternoon: true, evening: true, night: false },
      Thursday: { morning: false, afternoon: true, evening: true, night: true },
      Friday: { morning: true, afternoon: true, evening: true, night: true },
      Saturday: { morning: true, afternoon: true, evening: true, night: true },
      Sunday: { morning: false, afternoon: true, evening: true, night: false },
    },
    customHoursPerWeek: 30
  },
  completionPercentage: 94,
  teamDNA: {
    technicalStrength: 92,
    design: 68,
    research: 86,
    leadership: 84,
    collaboration: 90
  },
  isRealUser: true
};
