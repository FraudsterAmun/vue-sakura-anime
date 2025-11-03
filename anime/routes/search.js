import express from 'express';
import { fuzzySearchAnime } from '../controller/search.js';

const router = express.Router();

// 模糊搜索路由
router.get('/fuzzy', fuzzySearchAnime);

export default router;


