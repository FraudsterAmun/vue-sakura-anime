import express from 'express';
import db from '../db/index.js';

const router = express.Router();

export const getAnimeByType = (req, res) => {
  const { country } = req.params;
  



  // SQL查询：根据国家获取动漫信息
  const query = `
    SELECT * FROM anime_info 
    WHERE country = ?
  `;

  // 执行查询
  db.query(query, [country], (err, results) => {
    if (err) {
      console.error('查询错误:', err);
      return res.status(500).json({ error: '数据库查询失败' });
    }

    // 检查是否找到数据
    if (results.length === 0) {
      return res.status(404).json({ 
        error: '未找到对应的动漫信息',
        country: country 
      });
    }

    // 返回找到的动漫信息
    res.json({
      success: true,
      data: results,
      count: results.length,
      message: '获取动漫详情成功'
    });
  });
};

export default router;

