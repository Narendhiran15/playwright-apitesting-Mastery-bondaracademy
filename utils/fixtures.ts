import {test as base} from '@playwright/test'
import { RequestHandler } from './request-handler'
import { APIlogger } from './logger'

export type Myfixtures ={
    api:RequestHandler
}

export const test = base.extend<Myfixtures>({
    api:async({request},use)=>{
        const defaultBaseUrl ='https://conduit-api.bondaracademy.com/api/'
        const logger = new APIlogger()
        const requestHandler =new RequestHandler(request,defaultBaseUrl,logger)
        await use(requestHandler)   
    }
})