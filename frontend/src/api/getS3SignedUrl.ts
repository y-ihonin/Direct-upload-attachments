import axios from "./axios";

const getS3SignedUrl = async (data: unknown) => {
  const response = await axios.post("/api/aws/s3/get-signed-url", data);
  return response.data;
};

export default getS3SignedUrl;
