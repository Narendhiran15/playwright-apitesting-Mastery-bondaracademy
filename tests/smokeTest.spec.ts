import {test} from '../utils/fixtures'
import { RequestHandler } from '../utils/request-handler'
import { expect } from '@playwright/test'

test('First test API Articles', async({api})=>{

    const response = await api
        
        .path('articles')
        .params({limit:10,offset:0})
        .getRequest(200)

        console.log(response)    
        
       expect(response.articles.length).toBeLessThanOrEqual(10)
       expect(response.articlesCount).toEqual(10)             
    
})

test('test case 2 : Get test tags',async({api})=>{
    const response = await api
            .path('tags')
            .getRequest(200)            
      console.log(response)  
      
      expect(response.tags[8]).toEqual('GitHub')
      expect(response.tags.length).toBeLessThanOrEqual(10)

})


