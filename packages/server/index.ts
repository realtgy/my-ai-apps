import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// 必须在导入 Prisma 相关模块之前设置引擎类型
// 在 dotenv.config() 之后设置，确保不会被 .env 文件覆盖
if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
   process.env.PRISMA_CLIENT_ENGINE_TYPE = 'library';
}

import router from './routes';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(router);

app.listen(port, () => {
   console.log(`http://localhost:${port}`);
});
