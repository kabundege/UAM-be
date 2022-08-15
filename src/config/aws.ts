import AWS from "aws-sdk";
import { v4 as V4 } from "uuid";
// import { get, set } from "./redis";

const { AWS_ID, AWS_SECRET, AWS_REGION } = process.env;

AWS.config.update({
  region: AWS_REGION,
  signatureVersion: "v4",
  credentials: {
    accessKeyId: AWS_ID,
    secretAccessKey: AWS_SECRET,
  }
});

const S3 = new AWS.S3({ apiVersion: "2006-03-01" });

const getObject = async (Bucket:string, Key:string, Expires:number, Region?:string) => {
  // const cachedUri = await get(Key);

  // if (cachedUri) {
  //   return cachedUri;
  // }

  const uri = S3.getSignedUrl("getObject", { Bucket, Key, Expires });
  // await set(Key, uri);
  return uri;
};


const getSignedUrl = async (Bucket:string, ContentType:string, extension:string) => {
  const Key = `${V4()}.${extension}`;
  const params = {
    Key,
    Bucket,
    ContentType,
    Expires: 21600,
  };
  const signedUrl = await S3.getSignedUrlPromise("putObject", params);
  return {
    url: signedUrl,
    Key,
  };
};

export { getObject, getSignedUrl };