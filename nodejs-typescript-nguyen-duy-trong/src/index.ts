import express, {Express, Request, Response} from 'express';
import appRouter from './routes/app.routes.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDB } from './configs/database.js';
import cors from 'cors'

// config biến môi trường
dotenv.config();
const app: Express = express();

// config body json 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config file tĩnh trong typescript
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);
app.use(express.static(join(__dirname, 'public')));

app.use(cors({
  origin: 'http://localhost:3000', // URL frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức được phép
  credentials: true // Cho phép gửi cookie nếu cần
}));


// prefix api
app.use('/api/v1', appRouter);

app.use((req: Request, res: Response) => {
  const url = req.url
  res.status(404).json({
    message: url + " not found"
  })
})

connectDB();

// config server port
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
