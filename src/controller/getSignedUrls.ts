import { getSignedUrl, getObject } from "../config/aws";
import { Request,Response } from 'express'
import { ErrorResponse, SuccessResponse } from "../helpers/Responder";

class signedUrls {
  static async getSignedUrl(req:Request, res:Response) {
    try {

        const { key } = req.body;
        const bucket = 'uam-bucket-signed-urls';

        const signed = await getObject(bucket, key, 6000);

        return SuccessResponse(res,200,"Signed url created",signed)
    } catch (error) {
        return ErrorResponse(res,500,error.name,error.message)
    }
  }
  static async createSignedUrl(req:Request, res:Response) {
    try {

        const { type } = req.body;

        const ext = String(type).split("/")[String(type).split("/").length - 1]
        const bucket = 'uam-bucket-signed-urls';

        const signed = await getSignedUrl(bucket, type, ext);

        return SuccessResponse(res,200,"Signed url created",signed)
    } catch (error) {
        return ErrorResponse(res,500,error.name,error.message)
    }
  }
}

export default signedUrls;