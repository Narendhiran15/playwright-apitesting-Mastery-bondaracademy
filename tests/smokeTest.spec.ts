import { test } from '../utils/fixtures'
import { RequestHandler } from '../utils/request-handler'
import { expect } from '@playwright/test'
import { validateSchema } from '../utils/schema-validator'
import { APIlogger } from '../utils/logger'


let authToken: string

test.beforeAll('Get Authorization token', async ({ api }) => {
    const tokenResponse = await api
        .path('users/login')
        .body({
            "user": {
                "email": "narensimba@gmail.com",
                "password": "Conduit@123"
            }
        })
        .postRequest(200)

    authToken = 'Token ' + tokenResponse.user.token

})

test('First test API Articles', async ({ api }) => {

    const response = await api

        .path('articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200)

    console.log(response)

    expect(response.articles.length).toBeLessThanOrEqual(10)
    expect(response.articlesCount).toEqual(10)

})

test('logger',()=>{
    const logger = new APIlogger()
    logger.logRequest('POST','https://sampleurl.com',{Authorization:'authtoken'},{foo:'bar'})
    logger.logResponse(200,{foo:'bar'})
    const logs = logger.getRecentlogs()
    console.log(logs)
})

test('test case 2 : Get test tags', async ({ api }) => {
    const response = await api
        .path('tags')
        .getRequest(200)
    await validateSchema('tags', 'GET_tags',response)

    expect(response.tags[8]).toEqual('GitHub')
    expect(response.tags.length).toBeLessThanOrEqual(10)

})

test('Create and delete Article', async ({ api }) => {
    const createArticleResponse = await api
        .path('articles')
        .body({ "article": { "title": "create new article_June02", "description": "Desinged Framework", "body": "sddfsf", "tagList": ["sdfdfs"] } })
        .header({ Authorization: authToken })
        .postRequest(201)
    expect(createArticleResponse.article.title).toEqual('create new article_June02')
    const slugID = createArticleResponse.article.slug

    const getArticleResponse = await api

        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .header({ Authorization: authToken })
        .getRequest(200)

    expect(getArticleResponse.articles[0].title).toEqual('create new article_June02')


    const deleteArticleResponse = await api

        .path(`articles/${slugID}`)
        .header({ Authorization: authToken })
        .deleteRequest(204)

    const getArticleResponseTwo = await api

        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .header({ Authorization: authToken })
        .getRequest(200)

    expect(getArticleResponseTwo.articles[0].title).not.toEqual('create new article_June02')

})

test('create update and delete request', async ({ api }) => {

    const createArticleResponse = await api
        .path('articles')
        .body({ "article": { "title": "create new article_June02", "description": "Desinged Framework", "body": "sddfsf", "tagList": ["sdfdfs"] } })
        .header({ Authorization: authToken })
        .postRequest(201)
    expect(createArticleResponse.article.title).toEqual('create new article_June02')
    const slugID = createArticleResponse.article.slug

    const getArticleResponse = await api

        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .header({ Authorization: authToken })
        .getRequest(200)

    expect(getArticleResponse.articles[0].title).toEqual('create new article_June02')

    const updateArticleResponse = await api
        .path(`articles/${slugID}`)
        .header({ Authorization: authToken })
        .body({ "article": { "title": "update new article_June02", "description": "Desinged Framework", "body": "sddfsf", "tagList": ["sdfdfs"] } })
        .putRequest(200)
    expect(updateArticleResponse.article.title).toEqual('update new article_June02')
    const update_slugID = updateArticleResponse.article.slug


    const getUpdateArticleResponse = await api

        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .header({ Authorization: authToken })
        .getRequest(200)

    expect(getUpdateArticleResponse.articles[0].title).toEqual('update new article_June02')

    const deleteArticleResponse = await api

        .path(`articles/${update_slugID}`)
        .header({ Authorization: authToken })
        .deleteRequest(204)

    const getArticleResponseTwo = await api

        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .header({ Authorization: authToken })
        .getRequest(200)

    expect(getArticleResponseTwo.articles[0].title).not.toEqual('update new article_June02')
})


