import { json } from 'body-parser';
import { Response } from 'express';

type data<T> = T[] | T | null | undefined;
export interface ResponseData { 
   success: boolean;
   error? : null| Error
   statusCode: number
   message: string
   data? : any | null,
   extra? : any | null
   // data? : data<T>
}

export function responseSuccess( res : Response ,data: any , code:number = 200, extra?  ) : void {
   const jsonData : ResponseData = {
      success: true,
      statusCode: code || 200,
      message: 'Success',
      data :data,
      extra : extra
   }
   res.status(code).json(jsonData)
}