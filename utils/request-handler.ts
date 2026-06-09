import { APIRequestContext, expect } from "@playwright/test"
import { APIlogger } from "./logger"

export class RequestHandler {

    private request: APIRequestContext
    private logger: APIlogger
    private baseUrl: undefined | string = undefined
    private apiPath: string = ''
    private defaultBaseUrl: undefined | string
    private queryParams: object = {}
    private apiHeaders: Record<string, string> = {}
    private apibody: object = {}

    constructor(request: APIRequestContext, apiBaseurl: string, logger: APIlogger) {
        this.request = request
        this.defaultBaseUrl = apiBaseurl
        this.logger = logger
    }


    url(url: undefined | string) {
        this.baseUrl = url
        return this
    }

    path(path: string) {
        this.apiPath = path
        return this
    }

    params(params: object) {
        this.queryParams = params
        return this
    }

    header(header: Record<string, string>) {
        this.apiHeaders = header
        return this
    }

    body(body: object) {
        this.apibody = body
        return this
    }

    private getUrl() {
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`)
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value)
        }
        return url.toString()
    }

    async getRequest(statusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('GET', url, this.apiHeaders, this.apibody)
        const response = await this.request.get(url, {
            headers: this.apiHeaders
        })

        const actualStatus = response.status()
        const responseJson = await response.json()
        this.logger.logResponse(statusCode, responseJson)
        this.statusCodeValidator(actualStatus,statusCode,this.getRequest)

        return responseJson

    }

    async postRequest(statusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('POST', url, this.apiHeaders, this.apibody)
        const response = await this.request.post(url, {
            data: this.apibody,
            headers: this.apiHeaders
        })

        const actualStatus = response.status()
        const responseJson = await response.json()
        this.logger.logResponse(statusCode, responseJson)
        this.statusCodeValidator(actualStatus,statusCode,this.postRequest)
        return responseJson
    }

    async putRequest(statusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('PUT', url, this.apiHeaders, this.apibody)
        const response = await this.request.put(url, {
            data: this.apibody,
            headers: this.apiHeaders
        })

        const actualStatus = response.status()
        const responseJson = await response.json()
        this.logger.logResponse(statusCode, responseJson)
        this.statusCodeValidator(actualStatus,statusCode,this.putRequest)
        return responseJson
    }

    async deleteRequest(statusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('DELETE', url, this.apiHeaders)
        const response = await this.request.delete(url, {
            headers: this.apiHeaders
        })
        const actualStatus = response.status()
        this.logger.logResponse(statusCode)
        this.statusCodeValidator(actualStatus,statusCode,this.deleteRequest)

    }

    private statusCodeValidator(actualStatus: number, expectStatus: number,callingFunction:Function) {
        if (actualStatus !== expectStatus) {
            const logs = this.logger.getRecentlogs()
            const error = new Error(`Expected status is ${expectStatus} but we got ${actualStatus}\n\n
                RecentAPI Activity: \n${logs}`)
            Error.captureStackTrace(error,callingFunction)
            throw error    
        }
    }





}