import Ioredis from "ioredis";

const redis = new Ioredis();

export const get = async (key:string) => {
  const result = await redis.get(key);
  return result ? JSON.parse(result): null;
};

export const set = async (key:string, value:any, exp?:string) => {
  const result = await redis.setex(key, exp || 86400, JSON.stringify(value));
  return result;
};