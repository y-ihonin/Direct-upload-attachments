import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const getS3PutUrl = (uniqueS3Key, mimeType, bucket = process.env.AWS_BUCKET_NAME) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: uniqueS3Key,
    ContentType: mimeType,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });
};
