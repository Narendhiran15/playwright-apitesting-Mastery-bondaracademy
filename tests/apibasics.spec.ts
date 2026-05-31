import { test, expect, request } from '@playwright/test';

let authToken: string

test.beforeAll('this is executed before each test',async({request})=>{
 const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user": {
        "email": "narensimba@gmail.com",
        "password": "Conduit@123"
      }
    }
  })

  //Getting Auth Token
  const tokenResponseJSON = await tokenResponse.json()
  authToken = 'Token '+ tokenResponseJSON.user.token
})

test.afterEach('this is executed aftereach tests',async()=>{

})

test('Test 1 :Get request basics', async ({ request }) => {
  const tagResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagResponseJSON = await tagResponse.json()
  // console.log(tagResponseJSON)

  expect(tagResponse.status()).toEqual(200)
  expect(tagResponseJSON.tags[0]).toEqual('Test')
  const tagRes_tagLength = tagResponseJSON.tags.length
  // console.log(tagRes_tagLength)
  expect(tagResponseJSON.tags.length).toBeLessThanOrEqual(10)


});

test('Test 2: Get request for article', async ({ request }) => {
  const responseArticle = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
  const responseArticleJSON = await responseArticle.json()
  // console.log(responseArticleJSON)

  expect(responseArticle.status()).toEqual(200)
  expect(responseArticleJSON.articles.length).toBeLessThanOrEqual(10)

});


test('Test 3: loginPage create And Delete Article', async ({ request }) => {

  //login Page
  
  // console.log(authToken)

  //CreateNewArticle

  const createNewarticle = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "Create New article",
        "description": "New article bondar academy",
        "body": "Learning Playwright is awesome dude",
        "tagList": [
          "May24@2PM@bondaracademy@udemy"
        ]
      }
    },
    headers:{
      Authorization:authToken
    }
  })

  const createNewarticleJSON = await createNewarticle.json()
  // console.log(createNewarticleJSON)
  expect(createNewarticle.status()).toEqual(201)
  expect(createNewarticleJSON.article.title).toEqual('Create New article')


  const responseArticle = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',{
    headers: {
      Authorization:authToken
    }
  })
  const responseArticleJSON = await responseArticle.json()
  expect(responseArticle.status()).toEqual(200)
  expect(responseArticleJSON.articles[0].title).toEqual('Create New article')

  //Create const Slug ID

  const slugID = createNewarticleJSON.article.slug
  // console.log(slugID)

  const deleteArticle = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`,{
    headers:{
      Authorization:authToken
    }
  })
  expect(deleteArticle.status()).toEqual(204)

})




test('Test 4 : put request practise', async({request})=>{

// console.log(authToken)

//Create new article

const createNewArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/',{
  data:{
    "article": {
        "title": "create new article4",
        "description": "dlfskf",
        "body": "sddfsf",
        "tagList": [
            "sdfdfs"
        ]
    }
},headers:{
  Authorization:authToken
}
})

expect(await createNewArticleResponse.status()).toEqual(201)
const createNewArticleResponseJSON = await createNewArticleResponse.json()
expect(createNewArticleResponseJSON.article.title).toEqual('create new article4')
expect(createNewArticleResponseJSON.article.author.username).toEqual('Narendhiran')

//Get the slug ID

const slugID = createNewArticleResponseJSON.article.slug
// console.log(slugID)

//update the article

const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`,{
  data:{
    "article": {
        "title": "create new article4 Modified",
        "description": "dlfskf",
        "body": "sddfsf",
        "tagList": [
            "sdfdfs"
        ]
    }
},headers:{
  Authorization:authToken
}
})
expect(updateArticleResponse.status()).toEqual(200)
const updateArticleResponseJSON = await updateArticleResponse.json()
expect(updateArticleResponseJSON.article.title).toEqual('create new article4 Modified')

//Get request validation

const getResponse_Articles = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',{
  headers:{
    Authorization:authToken
  }
})
const getResponse_ArticlesJSON =await getResponse_Articles.json()
expect(getResponse_ArticlesJSON.articles[0].title).toEqual('create new article4 Modified')

//Get New Slug ID
 const newSlugID = updateArticleResponseJSON.article.slug

//Delete Modified Article

const deleteModifiedResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${newSlugID}`,{
  headers:{
    Authorization:authToken
  }
})
expect(deleteModifiedResponse.status()).toEqual(204)
console.log('Last test case')

})






