import express from 'express';
import db from '../db/index.js';

const router = express.Router();

// 根据id获取动漫详细信息
export const getAnimeById = (req, res) => {
  const { id } = req.params;
  
  // 验证id参数
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ 
      error: 'id参数必须是有效的数字' 
    });
  }

  const animeId = parseInt(id, 10);
  
  // SQL查询：根据id获取动漫信息
  const query = `
    SELECT * FROM anime_info 
    WHERE id = ?
  `;

  // 执行查询
  db.query(query, [animeId], (err, results) => {
    if (err) {
      console.error('查询错误:', err);
      return res.status(500).json({ error: '数据库查询失败' });
    }

    // 检查是否找到数据
    if (results.length === 0) {
      return res.status(404).json({ 
        error: '未找到对应的动漫信息',
        id: animeId 
      });
    }

    // 返回找到的动漫信息
    res.json({
      success: true,
      data: results[0], // 因为id是唯一的，只返回第一条记录
      message: '获取动漫详情成功'
    });
  });
};

// 根据query参数中的id获取动漫详细信息（备选方案）
export const getAnimeByQueryId = (req, res) => {
  const { id } = req.query;
  
  // 验证id参数
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ 
      error: 'id参数必须是有效的数字' 
    });
  }

  const animeId = parseInt(id, 10);
  
  // SQL查询：根据id获取动漫信息
  const query = `
    SELECT * FROM anime_info 
    WHERE id = ?
  `;

  // 执行查询
  db.query(query, [animeId], (err, results) => {
    if (err) {
      console.error('查询错误:', err);
      return res.status(500).json({ error: '数据库查询失败' });
    }

    // 检查是否找到数据
    if (results.length === 0) {
      return res.status(404).json({ 
        error: '未找到对应的动漫信息',
        id: animeId 
      });
    }

    // 返回找到的动漫信息
    res.json({
      success: true,
      data: results[0],
      message: '获取动漫详情成功'
    });
  });
};

export default router;

