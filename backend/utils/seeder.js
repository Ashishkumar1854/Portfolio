import FAQ from '../models/FAQ.js';
import TrustBadge from '../models/TrustBadge.js';
import ProcessStep from '../models/ProcessStep.js';
import HomeConfig from '../models/HomeConfig.js';
import Resource from '../models/Resource.js';
import User from '../models/User.js';
import Blog from '../models/Blog.js';

export const seedDatabase = async () => {
  try {
    // 1. Seed FAQs
    const faqCount = await FAQ.countDocuments();
    if (faqCount === 0) {
      console.log('Seeding default FAQs...');
      await FAQ.insertMany([
        {
          question: 'How much does a project cost?',
          answer: 'Pricing depends on complexity and scope. AI automation projects typically start at ₹25,000. Full SaaS platforms range from ₹80,000–₹3,00,000+. Let\'s discuss your requirements for a precise quote.',
          order: 0,
        },
        {
          question: 'How long does development take?',
          answer: 'Simple automation scripts: 1–2 weeks. Full-stack web apps: 4–8 weeks. SaaS platforms: 8–16 weeks. Timeline depends on feature complexity and feedback cycles.',
          order: 1,
        },
        {
          question: 'Do you provide post-launch support?',
          answer: 'Yes — all projects include 30 days of free bug-fix support. Extended maintenance packages are available monthly or quarterly.',
          order: 2,
        },
        {
          question: 'Can you work with existing systems?',
          answer: 'Absolutely. I specialize in integrating AI and automation into existing infrastructure — whether it\'s a legacy system, existing CRM, or third-party APIs.',
          order: 3,
        }
      ]);
    }

    // 2. Seed Trust Badges
    const badgeCount = await TrustBadge.countDocuments();
    if (badgeCount === 0) {
      console.log('Seeding default Trust Badges...');
      await TrustBadge.insertMany([
        { icon: '🚀', text: 'Founder of Phoneo', order: 0 },
        { icon: '🏆', text: 'NCIIPC–AICTE Pentathon Finalist', order: 1 },
        { icon: '🥇', text: 'CIH 2.0 National Hackathon Finalist', order: 2 },
        { icon: '🎓', text: 'B.Tech IT Graduate', order: 3 }
      ]);
    }

    // 3. Seed Process Steps
    const processCount = await ProcessStep.countDocuments();
    if (processCount === 0) {
      console.log('Seeding default Process Steps...');
      await ProcessStep.insertMany([
        { title: 'Discovery', desc: 'Understanding your goals, constraints, and ideal outcomes.', order: 0 },
        { title: 'Architecture', desc: 'Designing the system, data flow, and technology stack.', order: 1 },
        { title: 'Development', desc: 'Building iteratively with regular progress updates.', order: 2 },
        { title: 'Testing', desc: 'Thorough QA, edge-case testing, and performance checks.', order: 3 },
        { title: 'Deployment', desc: 'Production-ready launch with CI/CD and monitoring.', order: 4 },
        { title: 'Support', desc: 'Post-launch maintenance, updates, and scaling support.', order: 5 }
      ]);
    }

    // 4. Seed Home Config
    const configCount = await HomeConfig.countDocuments();
    if (configCount === 0) {
      console.log('Seeding default Home Configuration singleton...');
      await HomeConfig.create({}); // Creates with default values defined in model schema
    }

    // 5. Seed Resources
    const resourceCount = await Resource.countDocuments();
    if (resourceCount === 0) {
      console.log('Seeding default Resources...');
      await Resource.insertMany([
        {
          title: 'AI Agent Customer Support Template',
          slug: 'ai-agent-customer-support-template',
          description: 'A production-grade OpenAI assistant template for handling CRM support queries.',
          category: 'AI Agent Templates',
          thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
          downloadUrl: 'https://github.com',
          isPremium: true
        },
        {
          title: 'n8n Lead Enrichment Workflow',
          slug: 'n8n-lead-enrichment-workflow',
          description: 'Connect Google Sheets, OpenAI API, and email alerts automatically.',
          category: 'n8n Workflows',
          thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
          downloadUrl: 'https://n8n.io',
          isPremium: false
        },
        {
          title: 'Ultimate Prompt Engineering Library',
          slug: 'ultimate-prompt-engineering-library',
          description: 'A structured prompt toolkit for code generation, copywriting, and classification.',
          category: 'Prompt Libraries',
          thumbnail: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=400&q=80',
          downloadUrl: 'https://openai.com',
          isPremium: false
        },
        {
          title: 'Docker Deployment Checklist',
          slug: 'docker-deployment-checklist',
          description: 'Step-by-step container deployment configuration for Node.js backends and databases.',
          category: 'Docker Guides',
          thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=400&q=80',
          downloadUrl: 'https://docker.com',
          isPremium: true
        }
      ]);
    }

    // 6. Seed Blogs
    const react19Blog = await Blog.findOne({ title: 'Mastering React 19 Action Hooks & Concurrent Features' });
    if (!react19Blog) {
      console.log('Seeding default Blogs...');
      
      // Let's seed a default Admin User first if not exists
      let adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        console.log('Seeding default Admin User...');
        adminUser = await User.create({
          name: 'Ashish Yadav',
          email: 'ashishkyadav.dev@gmail.com',
          password: 'password123',
          role: 'admin',
          bio: 'AI Agent & n8n Workflow Automation Engineer',
          github: 'https://github.com',
          linkedin: 'https://linkedin.com'
        });
      }

      await Blog.insertMany([
        {
          title: 'Mastering React 19 Action Hooks & Concurrent Features',
          subtitle: 'A comprehensive guide to how React 19 is reshaping frontend state, forms, and compiler-level optimizations.',
          category: 'Development',
          imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
          author: adminUser._id,
          content: `
            <p>React 19 introduces major features that simplify form handling, async state transitions, and server-side interactions. The centerpiece is the concept of <strong>Actions</strong>, which handle pending states, error states, and optimistic UI updates automatically.</p>
            
            <h2>1. The useActionState Hook</h2>
            <p>In previous versions of React, managing async operations in forms required manually handling state variables like <code>pending</code>, <code>error</code>, and <code>data</code>. React 19 simplifies this with <code>useActionState</code>:</p>
            <pre><code>const [state, formAction, isPending] = useActionState(
  async (previousState, formData) => {
    try {
      const result = await saveProfile(formData);
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
  { success: false }
);</code></pre>

            <h2>2. Optimistic Updates with useOptimistic</h2>
            <p>To keep user interfaces feeling instantaneous, React 19 provides <code>useOptimistic</code>. This hook lets you render temporary state changes immediately while the background asynchronous request completes, then smoothly transitions to the final server state.</p>
            
            <h2>3. The React Compiler</h2>
            <p>The upcoming React Compiler automatically memoizes component rendering, reducing the need for manual <code>useMemo</code> and <code>useCallback</code> declarations, leading to cleaner codebases and fewer memory leaks.</p>
          `
        },
        {
          title: 'Architecting Scalable React Frontends for Enterprise SaaS',
          subtitle: 'Proven structural patterns, state management strategies, and modular folder architectures for scaling React.',
          category: 'System Design',
          imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
          author: adminUser._id,
          content: `
            <p>Enterprise SaaS platforms require frontends designed for maintainability, easy onboarding, and independent feature scaling. A solid folder structure and decoupled data layering are the keys to long-term success.</p>

            <h2>1. Feature-First Folder Structure</h2>
            <p>Instead of grouping files by technical type (e.g., placing all hooks in one folder, all styles in another), structure components by cohesive business domains:</p>
            <pre><code>src/
  features/
    authentication/
      components/
      hooks/
      services/
    billing/
      components/
      hooks/
      index.js</code></pre>

            <h2>2. Decoupling Logic from UI</h2>
            <p>Components should focus primarily on layout and presentation. Abstract business calculations, API requests, and event handlers into custom hooks. This patterns makes testing simple and keeps files readable.</p>
            
            <h2>3. Multi-Tiered State Architecture</h2>
            <p>Avoid global state fatigue. Classify state into one of four categories:</p>
            <ul>
              <li><strong>Local state:</strong> Form inputs, toggle animations (useState).</li>
              <li><strong>Server cache:</strong> Query results, cache invalidation (React Query / RTK Query).</li>
              <li><strong>Global context:</strong> Theme settings, user authentication sessions.</li>
              <li><strong>URL state:</strong> Search parameters, pagination, filtering.</li>
            </ul>
          `
        },
        {
          title: 'React Core Web Vitals: Achieving 100% Performance Score',
          subtitle: 'Eliminate duplicate renders, optimize bundle splitting, and leverage rendering checkpoints to speed up React page load.',
          category: 'Development',
          imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
          author: adminUser._id,
          content: `
            <p>Performance directly influences user retention and SEO conversions. Standard React applications often suffer from large bundle sizes and redundant renders. Here is how to audit and optimize your site.</p>

            <h2>1. Audit Render Cycles</h2>
            <p>Use the React Developer Tools Profiler tab to record render cycles. Identify components that re-render when their parent updates even if their props remain unchanged. Wrap expensive leaf components in <code>React.memo</code>.</p>

            <h2>2. Route-Based Code Splitting</h2>
            <p>Never bundle your entire app into a single JavaScript file. Use <code>React.lazy</code> and <code>Suspense</code> to divide code based on URL routes:</p>
            <pre><code>const Dashboard = React.lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    &lt;Suspense fallback={&lt;LoadingSpinner /&gt;}&gt;
      &lt;Dashboard /&gt;
    &lt;/Suspense&gt;
  );
}</code></pre>

            <h2>3. Optimizing Largest Contentful Paint (LCP)</h2>
            <p>Ensure that hero images are preloaded and that critical CSS is loaded inline. Avoid client-side rendering empty pages while waiting for API calls; render skeleton loaders to maintain Layout Cumulative Shift (CLS) stability.</p>
          `
        },
        {
          title: 'Streaming LLM Outputs in React UI Components',
          subtitle: 'A step-by-step implementation guide to parsing fetch stream readers and updating React states with typewriter effects.',
          category: 'AI Agents',
          imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
          author: adminUser._id,
          content: `
            <p>AI agent user interfaces require real-time content updates. Waiting for complete LLM answers ruins user engagement. Streaming responses chunk by chunk provides an instant, interactive chat experience.</p>

            <h2>1. The Fetch ReadableStream Reader</h2>
            <p>Instead of waiting for a complete JSON response, parse the response body as a readable stream reader. Loop through incoming binary chunks, decode them to text, and update state iteratively:</p>
            <pre><code>const response = await fetch('/api/chat', { method: 'POST' });
const reader = response.body.getReader();
const decoder = new TextDecoder();
let done = false;

while (!done) {
  const { value, done: readerDone } = await reader.read();
  done = readerDone;
  const chunk = decoder.decode(value, { stream: true });
  setChatContent(prev => prev + chunk);
}</code></pre>

            <h2>2. Designing Typewriter Animations</h2>
            <p>Smooth the arrival of new words using CSS transitions or Framer Motion to prevent jarring page content jumps. Maintain container autoscroll so the latest typed text remains in user view.</p>
          `
        }
      ]);
    }

  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
  }
};
