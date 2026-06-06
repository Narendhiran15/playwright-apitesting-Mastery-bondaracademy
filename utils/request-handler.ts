import { APIRequestContext, expect } from "@playwright/test"

export class RequestHandler {

    private request: APIRequestContext
    private baseUrl: undefined | string = undefined
    private apiPath: string = ''
    private defaultBaseUrl: undefined | string
    private queryParams: object = {}
    private apiHeaders: Record<string, string> = {}
    private apibody: object = {}

    constructor(request: APIRequestContext, apiBaseurl: string) {
        this.request = request
        this.defaultBaseUrl = apiBaseurl
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

    async getRequest(statusCode:number) {
        const url = this.getUrl()
        const response = await this.request.get(url, {
            headers: this.apiHeaders
        })
        expect(response.status()).toEqual(statusCode)
        const responseJson = await response.json()        
        return responseJson
       
    }

    async postRequest(statusCode:number){
        const url = this.getUrl()
        const response = await this.request.post(url,{
            data:this.apibody,
            headers:this.apiHeaders
        })
        expect(response.status()).toEqual(statusCode)
        const responseJson = await response.json()
        return responseJson
    }

    async putRequest(statusCode:number){
        const url = this.getUrl()
        const response = await this.request.put(url,{
           data:this.apibody,
           headers:this.apiHeaders 
        })
        expect(response.status()).toEqual(statusCode)
        const responseJson = await response.json()
        return responseJson
    }

    async deleteRequest(statusCode:number){
        const url = this.getUrl()
        const response = await this.request.delete(url,{
            headers:this.apiHeaders
        })
        expect(response.status()).toEqual(statusCode)

    }





}