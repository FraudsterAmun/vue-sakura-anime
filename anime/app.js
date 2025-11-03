// app.js
import express from 'express';
import mysql from 'mysql2';
import homeRouter from './routes/home.js';
import detailRouter from './routes/detail.js';
import typeRouter from './routes/type.js';
import searchRouter from './routes/search.js';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3000;

// 创建 MySQL 连接
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // 替换为您的 MySQL 用户名
    password: 'root',  // 替换为您的 MySQL 密码
    database: 'anime'    // 替换为您的数据库名称
});

// 连接到 MySQL 数据库
connection.connect(err => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('数据库连接成功');
});

// 中间件
app.use(express.json());
app.use(cors());
app.use('/home',homeRouter);
app.use('/detail',detailRouter);
app.use('/country',typeRouter);
app.use('/search',searchRouter);


// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器正在运行在 http://localhost:${PORT}`);
});