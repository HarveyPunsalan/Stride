import express from 'express'
import cors from 'cors';
import router from './routes/auth'


const app = express()
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/auth', router)


app.get('/health', (req, res) => res.json({ status: 'ok' }));


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
