import baseUrl from './service'
class CatergoryServices{ 
    async getCategories(){
        const categoriesStatusResponse=await fetch(
            baseUrl+'category')
        const catergoryData=await categoriesStatusResponse.json();
        return catergoryData
    } 
}

export default new CatergoryServices()