import express from 'express';
import mime from 'mime-types';

import { getS3SignedUrl } from '../helpers/getS3SignedUrl.js';

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Backend is working, Express is ready to upload files!' });
});

router.post('/aws/s3/get-signed-url', async (req, res) => {
  const { fileName, fileType, fileSize } = req.body;

  const uniqueKeyName = `${Date.now().toString()}-${encodeURIComponent(fileName)}`;

  const mimeType = mime.lookup(fileName);

  const signedLink = await getS3SignedUrl(uniqueKeyName, mimeType);

  res.json({
    signedLink,
    mimeType,
    uniqueKeyName,
  });
});

export default router;
