import express from 'express';
import { getAnimeById, getAnimeByQueryId } from '../controller/detail.js';

const router = express.Router();

// 通过路径参数获取动漫详情 - /detail/:id
router.get('/:id', getAnimeById);

// 通过查询参数获取动漫详情 - /detail/info?id=1
router.get('/info', getAnimeByQueryId);

export default router;

