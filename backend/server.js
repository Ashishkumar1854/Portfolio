import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import hireRoutes from './routes/hireRoutes.js';
import journeyRoutes from './routes/journeyRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import caseStudyRoutes from './routes/caseStudyRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import trustBadgeRoutes from './routes/trustBadgeRoutes.js';
import processRoutes from './routes/processRoutes.js';
import homeConfigRoutes from './routes/homeConfigRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import broadcastRoutes from './routes/broadcastRoutes.js';
import benefitRoutes from './routes/benefitRoutes.js';
import { seedDatabase } from './utils/seeder.js';
import { startEmailWorker } from './utils/emailQueueProcessor.js';

dotenv.config();

connectDB().then(() => {
  seedDatabase();
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://ashishportfolio.aigateway.in'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const isLocalhost = origin.startsWith('http://localhost') || 
                        origin.startsWith('https://localhost') || 
                        origin.startsWith('http://127.0.0.1') || 
                        origin.startsWith('https://127.0.0.1') ||
                        origin.startsWith('http://192.168.') ||
                        origin.startsWith('https://192.168.') ||
                        origin.startsWith('http://10.') ||
                        origin.startsWith('https://10.') ||
                        origin.startsWith('http://172.') ||
                        origin.startsWith('https://172.') ||
                        origin.startsWith('http://168.') ||
                        origin.startsWith('https://168.');
                        
    if (allowedOrigins.includes(origin) || isLocalhost) {
      return callback(null, true);
    } else {
      console.log('CORS rejected origin:', origin);
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true
}));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/hire', hireRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/case-studies', caseStudyRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/trust-badges', trustBadgeRoutes);
app.use('/api/process-steps', processRoutes);
app.use('/api/home-config', homeConfigRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/broadcasts', broadcastRoutes);
app.use('/api/benefits', benefitRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Start the background email dispatcher & scheduler
  startEmailWorker();
});
