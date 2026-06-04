import axios from "./axios";

const getS3PutUrl = async (data: unknown) => {
  const response = await axios.post("/api/aws/s3/get-put-url", data);
  return response.data;
};

export default getS3PutUrl;
