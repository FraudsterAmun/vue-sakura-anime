import express from 'express';
import { 
  getAnimeBanners, 
  getAnimeTopics, 
  getAnimeNews, 
  getAnimeJpUpdate, 
  getAnimeChinaUpdate, 
  getTopLikesByType, 
  getJapanAnimeRanking, 
  getChinaAnimeRanking, 
  getJapanAnimeTopTitles, 
  getChinaAnimeTopTitles
} from '../controller/home.js';

const router = express.Router();

router.get('/getAnimeTopics', getAnimeTopics);
router.get('/getAnimeNews', getAnimeNews);
router.get('/getAnimeBanners', getAnimeBanners);
router.get('/getAnimeJpUpdate', getAnimeJpUpdate);
router.get('/getAnimeChinaUpdate', getAnimeChinaUpdate);
router.get('/getTopLikesByType', getTopLikesByType);
router.get('/getJapanAnimeRanking', getJapanAnimeRanking);
router.get('/getChinaAnimeRanking', getChinaAnimeRanking);
router.get('/getJapanAnimeTopTitles', getJapanAnimeTopTitles);
router.get('/getChinaAnimeTopTitles', getChinaAnimeTopTitles);

export default router;