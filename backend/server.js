import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({ message: 'Backend is working, Express is ready to upload files!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
