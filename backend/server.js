import 'dotenv/config';

import express from 'express';
import cors from 'cors';
// import dotenv from 'dotenv';

// routers
import router from './router/index.js';

// dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
