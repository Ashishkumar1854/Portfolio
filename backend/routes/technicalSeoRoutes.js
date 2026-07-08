import express from 'express';
import {
  getRobots,
  getRssFeed,
  getSitemap,
} from '../controllers/technicalSeoController.js';

const router = express.Router();

router.get('/sitemap.xml', getSitemap);
router.get('/robots.txt', getRobots);
router.get('/rss.xml', getRssFeed);

export default router;
