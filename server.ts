import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client lazily/safely with required User-Agent
  let aiClient: GoogleGenAI | null = null;
  function getAIClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      try {
        aiClient = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      } catch (err) {
        console.warn('Failed to initialize Gemini client:', err);
      }
    }
    return aiClient;
  }

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // AI Project DNA Analyzer endpoint
  app.post('/api/analyze-project', async (req, res) => {
    try {
      const { description, name, category, teamSize = 4, customSkills = [] } = req.body;

      if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: 'Description is required' });
      }

      const client = getAIClient();

      if (client) {
        try {
          const prompt = `Analyze this hackathon / startup / competition project idea and produce a structured "Project DNA" breakdown for complementary team matching:
Project Title: ${name || 'Untitled Project'}
Category / Domain: ${category || 'General AI / Tech'}
Target Team Size: ${teamSize}
User's Idea: "${description}"
${customSkills.length > 0 ? `User-specified initial skills: ${customSkills.join(', ')}` : ''}

Break down the required skills, assigning an exact percentage importance (0 to 100) based on architectural criticality.
Ensure realistic distribution of AI/ML, Frontend/UI, Backend/Cloud, and Domain/Research skills where applicable.`;

          const response = await client.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: {
              systemInstruction: 'You are ProjectMatch AI, a world-class team intelligence system that deconstructs software projects into exact technical and domain skill requirements with importance ratings (0-100%). Output strict JSON according to the schema.',
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'Polished name for the project' },
                  category: { type: Type.STRING, description: 'Primary sector, e.g. Agriculture & Computer Vision, Fintech & Security, etc.' },
                  complexity: { type: Type.STRING, description: 'One of: Beginner, Intermediate, Advanced, Moonshot' },
                  summary: { type: Type.STRING, description: 'Concise 2-sentence executive summary of the system architecture' },
                  requiredSkills: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING, description: 'Skill name, e.g. Computer Vision, React, Python, Agriculture, Backend, UI/UX, SQL' },
                        importance: { type: Type.INTEGER, description: 'Importance percentage from 40 to 98' },
                        category: { type: Type.STRING, description: 'One of: AI & ML, Frontend & UX, Backend & Cloud, Domain & Research, Security & Systems, Product & Management' },
                        description: { type: Type.STRING, description: 'Why this skill is critical for this project' },
                      },
                      required: ['name', 'importance', 'category', 'description'],
                    },
                  },
                  domainTags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '3-5 key technical or domain tags',
                  },
                  keyChallenges: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '2-3 key architectural risks or challenges',
                  },
                },
                required: ['title', 'category', 'complexity', 'summary', 'requiredSkills', 'domainTags', 'keyChallenges'],
              },
            },
          });

          if (response.text) {
            const parsed = JSON.parse(response.text);
            return res.json({
              success: true,
              data: {
                id: `proj-${Date.now()}`,
                ...parsed,
                targetTeamSize: Number(teamSize) || 4,
                description,
              },
              source: 'gemini-3.7-flash',
            });
          }
        } catch (apiError) {
          console.warn('Gemini API call error, falling back to local analyzer:', apiError);
        }
      }

      // High-precision local heuristic fallback
      const descLower = description.toLowerCase();
      const isCropAgri = descLower.includes('crop') || descLower.includes('farm') || descLower.includes('disease') || descLower.includes('plant');
      const isFintech = descLower.includes('fraud') || descLower.includes('fintech') || descLower.includes('payment') || descLower.includes('bank');
      const isCyber = descLower.includes('cyber') || descLower.includes('security') || descLower.includes('threat') || descLower.includes('auth');
      const isHealth = descLower.includes('health') || descLower.includes('medical') || descLower.includes('patient') || descLower.includes('triage') || descLower.includes('doctor');

      let fallbackDNA;

      if (isCropAgri) {
        fallbackDNA = {
          title: name || 'AgriVision AI — Crop Pathogen Detector',
          category: 'Agriculture & Computer Vision',
          complexity: 'Advanced',
          summary: 'A computer vision and agronomy pipeline identifying crop leaf pathologies from camera photos with offline field inference.',
          requiredSkills: [
            { name: 'Computer Vision', importance: 94, category: 'AI & ML', description: 'Deep learning image classification & pathogen segmentation models.' },
            { name: 'Machine Learning', importance: 91, category: 'AI & ML', description: 'Model quantization, confidence thresholds, and dataset augmentation.' },
            { name: 'Python', importance: 88, category: 'AI & ML', description: 'PyTorch/OpenCV pipeline and serverless inference scripts.' },
            { name: 'Agriculture', importance: 84, category: 'Domain & Research', description: 'Pathogen diagnostic validation, farmer field workflows.' },
            { name: 'Backend', importance: 76, category: 'Backend & Cloud', description: 'High-throughput image ingest API and geospatial storage.' },
            { name: 'UI/UX', importance: 61, category: 'Frontend & UX', description: 'Accessible mobile-first UI for farm conditions.' },
          ],
          domainTags: ['Computer Vision', 'AgTech', 'Plant Pathology', 'Offline-First'],
          keyChallenges: [
            'Variable outdoor sunlight and blurry camera uploads in rural areas',
            'Model compression for low-power edge mobile devices',
          ],
        };
      } else if (isFintech) {
        fallbackDNA = {
          title: name || 'FinLens — Real-Time Transaction Sentinel',
          category: 'Fintech & Risk Systems',
          complexity: 'Advanced',
          summary: 'A sub-10ms transaction fraud prevention and anomaly detection engine with explainable risk scoring.',
          requiredSkills: [
            { name: 'Python', importance: 92, category: 'AI & ML', description: 'Behavioral fraud detection algorithms and real-time feature extraction.' },
            { name: 'SQL', importance: 91, category: 'Backend & Cloud', description: 'High-velocity relational ledger queries and PostgreSQL indexing.' },
            { name: 'Backend', importance: 89, category: 'Backend & Cloud', description: 'Low-latency idempotent payment webhook handlers.' },
            { name: 'Data Science', importance: 86, category: 'AI & ML', description: 'Statistical risk scoring and anomaly thresholds.' },
            { name: 'UI/UX', importance: 65, category: 'Frontend & UX', description: 'Fraud investigator workflow workbench and dispute resolution.' },
          ],
          domainTags: ['Fintech', 'Fraud Detection', 'Risk Analytics', 'Sub-10ms Latency'],
          keyChallenges: ['Maintaining sub-10ms response budgets without blocking legitimate transactions'],
        };
      } else if (isCyber) {
        fallbackDNA = {
          title: name || 'CyberShield — Zero-Trust Threat Monitor',
          category: 'Cybersecurity & Systems',
          complexity: 'Advanced',
          summary: 'An automated zero-trust network packet anomaly inspector with behavioral intrusion detection.',
          requiredSkills: [
            { name: 'Cybersecurity', importance: 96, category: 'Security & Systems', description: 'Zero trust packet inspection, threat modeling, and encryption.' },
            { name: 'Cloud', importance: 89, category: 'Backend & Cloud', description: 'AWS/GCP infrastructure, VPC quarantine groups.' },
            { name: 'Backend', importance: 85, category: 'Backend & Cloud', description: 'High-throughput event queues and Go/Node microservices.' },
            { name: 'Python', importance: 82, category: 'AI & ML', description: 'Anomaly detection scripting and log baselining.' },
            { name: 'UI/UX', importance: 68, category: 'Frontend & UX', description: 'Security Operations Center (SOC) visual incident graph.' },
          ],
          domainTags: ['Cybersecurity', 'Zero Trust', 'Threat Detection', 'Cloud'],
          keyChallenges: ['Minimizing false positives during heavy campus network bursts'],
        };
      } else if (isHealth) {
        fallbackDNA = {
          title: name || 'MedTriage — AI Emergency Clinical Companion',
          category: 'Healthcare & Clinical NLP',
          complexity: 'Moonshot',
          summary: 'A HIPAA-conscious emergency triage assistant accelerating patient acuity scoring and ER workflow triage.',
          requiredSkills: [
            { name: 'Machine Learning', importance: 92, category: 'AI & ML', description: 'Clinical NLP, risk stratification scoring.' },
            { name: 'Biology', importance: 88, category: 'Domain & Research', description: 'Clinical terminology, vital sign dynamics.' },
            { name: 'Research', importance: 86, category: 'Domain & Research', description: 'Medical literature safety validation.' },
            { name: 'React', importance: 82, category: 'Frontend & UX', description: 'Ultra-fast emergency intake forms and visual acuity badges.' },
            { name: 'Backend', importance: 80, category: 'Backend & Cloud', description: 'Encrypted patient database and real-time updates.' },
          ],
          domainTags: ['HealthTech', 'Clinical Triage', 'NLP', 'Emergency Medicine'],
          keyChallenges: ['Zero hallucination safety guardrails for medical decision support'],
        };
      } else {
        // Generic smart breakdown
        fallbackDNA = {
          title: name || 'Intelligent Multi-Modal Platform',
          category: category || 'Full-Stack & Applied AI',
          complexity: 'Advanced',
          summary: `An end-to-end intelligent platform executing on: "${description.slice(0, 100)}..."`,
          requiredSkills: [
            { name: 'Machine Learning', importance: 90, category: 'AI & ML', description: 'Core algorithmic intelligence and predictive models.' },
            { name: 'Python', importance: 88, category: 'AI & ML', description: 'Pipeline scripting, data transformations, and model wrappers.' },
            { name: 'Backend', importance: 82, category: 'Backend & Cloud', description: 'Robust API endpoints, auth, and database persistence.' },
            { name: 'React', importance: 78, category: 'Frontend & UX', description: 'Modern reactive frontend with state management.' },
            { name: 'UI/UX', importance: 70, category: 'Frontend & UX', description: 'Polished design system and responsive user experience.' },
          ],
          domainTags: ['Applied AI', 'Full Stack', 'Cloud Architecture'],
          keyChallenges: ['Seamless coordination between ML inference and reactive frontend state'],
        };
      }

      res.json({
        success: true,
        data: {
          id: `proj-${Date.now()}`,
          ...fallbackDNA,
          targetTeamSize: Number(teamSize) || 4,
          description,
        },
        source: 'local-engine',
      });
    } catch (error) {
      console.error('Error analyzing project:', error);
      res.status(500).json({ error: 'Internal server error analyzing project' });
    }
  });

  // Setup Vite middleware for development or serve dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ProjectMatch server running at http://localhost:${PORT}`);
  });
}

startServer();
