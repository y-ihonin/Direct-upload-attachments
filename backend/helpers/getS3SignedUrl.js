import {
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

export const getS3SignedUrl = (uniqueS3Key, mimeType, bucket = process.env.AWS_BUCKET_NAME) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: uniqueS3Key,
      Expires: 60,
      ContentType: mimeType,
      ACL: 'private',
    }

    try {
      const command = new GetObjectCommand(params);

      const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });
  
      resolve(url);
    } catch (err) {
      reject(err);
    }
  });
}

// aws.config.update({
//   region: process.env.AWS_REGION,
//   signatureVersion: process.env.AWS_SIGNATURE_VERSION,
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });
// const getS3PutLink = (uniqueS3Key, mimeType, bucket = process.env.AWS_BUCKET_NAME, region = process.env.AWS_REGION) => {
//   return new Promise(async (resolve, reject) => {
//     const options = {
//       bucket,
//       region,
//       signatureVersion: process.env.AWS_SIGNATURE_VERSION,
//       signatureExpires: 60, // number of seconds the link will be valid for
//       ACL: 'private',
//       uniquePrefix: true, // if set to false, it will allow keys with the same name
//     }

//     const s3 = new aws.S3(options);
//     const params = {
//       Bucket: bucket,
//       Key: uniqueS3Key,
//       Expires: 60,
//       ContentType: mimeType,
//       ACL: 'private',
//     }

//     s3.getSignedUrl('putObject', params, (err, signedLink) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(signedLink);
//       }
//     })
    
//   });
// }

// export default getS3PutLink;

