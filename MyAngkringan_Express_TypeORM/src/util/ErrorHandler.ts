import { ResponseData } from './Response';
import { NextFunction, Response } from 'express';
export class ErrorHandler extends Error {
   public statusCode?: number
   public message: string
   constructor(statusCode: number, message: string = 'terjadi kesalahan') {
      super();
      this.statusCode = statusCode;
      this.message = ErrMsg[ ErrCode[statusCode] ] ?? message;
   }
}

export function responseError(res: Response, msg: string, code: number = 400): void {
   const jsonData: ResponseData = {
      success: false,
      statusCode: code,
      message: msg,
      data: null
   }
   res.status(code).json(jsonData)
}

export function handleErrorDatabase(error: ErrorHandler & Error, next: NextFunction, code: number = 400) {
   console.log(error);
   next(new ErrorHandler(error?.statusCode ?? code, error?.message ?? 'fail to get data'))
   return undefined;
}

export enum ErrCode {
   BAD_REQUEST = 400,
   UNAUTHORIZED = 401,
   FORBIDDEN = 403,
   NOT_FOUND = 404,
   METHOD_NOT_ALLOWED = 405,
   NOT_ACCEPTABLE = 406,
   PRECONDITION_FAILED = 412,
   UNSUPPORTED_MEDIA_TYPE = 415,
   INTERNAL_SERVER_ERROR = 500,
   NOT_IMPLEMENTED = 501,
}
export enum ErrMsg {
   BAD_REQUEST = 'bad_request' ,
   UNAUTHORIZED = 'unauthorized' ,
   FORBIDDEN = 'forbidden' ,
   NOT_FOUND = 'not_found' ,
   METHOD_NOT_ALLOWED = 'method_not_allowed' ,
   NOT_ACCEPTABLE = 'not_acceptable' ,
   PRECONDITION_FAILED = 'precondition_failed' ,
   UNSUPPORTED_MEDIA_TYPE = 'unsupported_media_type' ,
   INTERNAL_SERVER_ERROR = 'internal_server_error' ,
   NOT_IMPLEMENTED = 'not_implemented' ,
}
