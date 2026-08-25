import { ProjectDNA } from '../types';

export const FLAGSHIP_PROJECT: ProjectDNA = {
  id: 'agrivision-ai',
  title: 'AgriVision AI — Early Crop Disease Detector',
  description: 'Build an AI-powered crop disease detection platform where farmers upload crop images and the system identifies diseases early.',
  category: 'Agriculture & Computer Vision',
  complexity: 'Advanced',
  targetTeamSize: 4,
  summary: 'A multimodal diagnostic tool combining high-accuracy computer vision with botanical research to identify leaf pathogens, recommend organic/chemical treatments, and run offline on rural farm devices.',
  requiredSkills: [
    {
      name: 'Computer Vision',
      importance: 94,
      category: 'AI & ML',
      description: 'Image preprocessing, transfer learning, leaf disease classification, bounding-box pathology segmentation.',
    },
    {
      name: 'Machine Learning',
      importance: 91,
      category: 'AI & ML',
      description: 'Model optimization, confidence calibration, few-shot multi-pathogen dataset tuning.',
    },
    {
      name: 'Python',
      importance: 88,
      category: 'AI & ML',
      description: 'PyTorch/TensorFlow pipeline, data augmentation, serverless inference scripting.',
    },
    {
      name: 'Agriculture',
      importance: 84,
      category: 'Domain & Research',
      description: 'Agronomic validation, plant disease phenotypes, farmer field workflows, treatment protocol synthesis.',
    },
    {
      name: 'Backend',
      importance: 76,
      category: 'Backend & Cloud',
      description: 'Scalable image upload API, async queue worker, geo-tagged crop health database.',
    },
    {
      name: 'UI/UX',
      importance: 61,
      category: 'Frontend & UX',
      description: 'High-contrast mobile-friendly UI, low-bandwidth image upload flow, intuitive severity diagnostics.',
    },
  ],
  domainTags: ['Computer Vision', 'AgTech', 'Plant Pathology', 'Offline-First', 'Image Diagnostics'],
  keyChallenges: [
    'Handling variable outdoor lighting and camera resolutions in farm conditions',
    'Ensuring low latency inference with minimal bandwidth requirements',
    'Bridging scientific plant pathology with non-technical farmer interfaces',
  ],
};

export const PRESET_PROJECTS: ProjectDNA[] = [
  FLAGSHIP_PROJECT,
  {
    id: 'cybershield-campus',
    title: 'CyberShield — Zero-Trust Campus Defense',
    description: 'Build an automated zero-trust network monitoring and anomaly detection platform for university labs to prevent credential harvesting and data breaches.',
    category: 'Cybersecurity & Systems',
    complexity: 'Advanced',
    targetTeamSize: 4,
    summary: 'A real-time telemetry analyzer inspecting encrypted network traffic anomalies using behavioral AI, role-based quarantine triggers, and secure administrative dashboards.',
    requiredSkills: [
      { name: 'Cybersecurity', importance: 96, category: 'Security & Systems', description: 'Zero trust architecture, packet anomaly inspection, threat modeling.' },
      { name: 'Cloud', importance: 89, category: 'Backend & Cloud', description: 'AWS/GCP infrastructure, VPC security groups, serverless event ingestion.' },
      { name: 'Backend', importance: 85, category: 'Backend & Cloud', description: 'High-throughput event stream pipelines, Redis caching, Go/Node services.' },
      { name: 'Python', importance: 82, category: 'AI & ML', description: 'Anomaly detection algorithms, statistical traffic baselining.' },
      { name: 'UI/UX', importance: 68, category: 'Frontend & UX', description: 'SOC incident visualizer, interactive network topology graph.' },
    ],
    domainTags: ['Cybersecurity', 'Zero Trust', 'Threat Detection', 'Cloud Security'],
    keyChallenges: [
      'Minimizing false positives during heavy campus network spikes',
      'Maintaining privacy compliance while inspecting traffic metadata',
    ],
  },
  {
    id: 'medtriage-assistant',
    title: 'MedTriage — AI Emergency Triage Assistant',
    description: 'Build a rapid clinical triage platform that processes patient symptoms, vital sensors, and medical history to prioritize urgent emergency care workflows.',
    category: 'Healthcare & NLP',
    complexity: 'Moonshot',
    targetTeamSize: 4,
    summary: 'A HIPAA-conscious clinical companion for triage nurses that scores emergency acuity index (ESI), surfaces drug interaction flags, and reduces ER wait times.',
    requiredSkills: [
      { name: 'Machine Learning', importance: 92, category: 'AI & ML', description: 'Clinical NLP, risk stratification scoring, decision support calibration.' },
      { name: 'Biology', importance: 88, category: 'Domain & Research', description: 'Clinical terminology, vital sign dynamics, triage protocol verification.' },
      { name: 'Research', importance: 86, category: 'Domain & Research', description: 'Medical literature validation, safety guardrails, clinical validation.' },
      { name: 'React', importance: 82, category: 'Frontend & UX', description: 'Ultra-fast emergency nurse UI, rapid input forms, visual acuity badges.' },
      { name: 'Backend', importance: 80, category: 'Backend & Cloud', description: 'Encrypted patient database, real-time WebSocket bed state updates.' },
    ],
    domainTags: ['HealthTech', 'Clinical Triage', 'NLP', 'Emergency Medicine'],
    keyChallenges: [
      'Zero room for hallucinations in clinical recommendations',
      'Extremely fast 2-second triage intake workflow for busy nurses',
    ],
  },
  {
    id: 'finlens-fraud',
    title: 'FinLens — Real-Time Fraud Sentinel',
    description: 'Build a sub-10ms transaction fraud prevention and AML graph analysis engine for emerging fintech platforms and peer-to-peer payments.',
    category: 'Fintech & Graph AI',
    complexity: 'Advanced',
    targetTeamSize: 4,
    summary: 'High-frequency transaction surveillance engine that detects synthetic identity rings, money mule networks, and abnormal velocity spikes with explainable reasoning.',
    requiredSkills: [
      { name: 'Python', importance: 92, category: 'AI & ML', description: 'Graph neural networks, behavioral anomaly models, real-time feature stores.' },
      { name: 'SQL', importance: 91, category: 'Backend & Cloud', description: 'Complex relational joins, time-series partitioning, PostgreSQL optimization.' },
      { name: 'Backend', importance: 89, category: 'Backend & Cloud', description: 'Sub-10ms response latency, distributed locking, idempotent APIs.' },
      { name: 'Data Science', importance: 86, category: 'AI & ML', description: 'Statistical risk scoring, precision-recall optimization for 0.01% fraud rate.' },
      { name: 'UI/UX', importance: 65, category: 'Frontend & UX', description: 'Fraud investigator graph workbench, rapid dispute action flows.' },
    ],
    domainTags: ['Fintech', 'Fraud Detection', 'Graph Analysis', 'Sub-10ms Latency'],
    keyChallenges: [
      'Balancing high fraud recall with near-zero false decline friction for legitimate users',
      'Maintaining sub-10ms latency budgets during peak flash sales',
    ],
  },
];
