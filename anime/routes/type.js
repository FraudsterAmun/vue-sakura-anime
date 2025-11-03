import express from 'express';
import { getAnimeByType } from '../controller/type.js';

const router = express.Router();

// 根据国家参数获取动漫信息 - /type/:country
router.get('/:country', getAnimeByType);


export default router;

