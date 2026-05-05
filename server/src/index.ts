import express from 'express';
import cors from 'cors';
import router from './routes/auth';
import syncRouter from './routes/sync';
import 'dotenv/config';
import dashboardRouter from './routes/dashboard';
import profileRouter from './routes/profile';

const app = express()
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/auth', router)
app.use('/sync', syncRouter)
app.use('/dashboard', dashboardRouter)
app.use('/profile', profileRouter)

app.get('/health', (req, res) => res.json({ status: 'ok' }));


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
