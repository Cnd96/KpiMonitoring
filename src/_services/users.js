import baseUrl from './service'
class UsersServices{ 
    async createUser(userData){
        const response=await fetch(baseUrl+"users", {
            method: "POST",
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(userData)
          })
        return response
    } 
    async updateUser(userData){
      const response=await fetch(baseUrl+"users/updateUser", {
          method: "POST",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body:JSON.stringify(userData)
        })
      return response
  } 
    async getUserRoleKpis(plantId,roles){
      const response=await fetch(baseUrl+'users/userRoles/plantKpis?plantId='+plantId, {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(roles)
      })
    const userRoleKpis=await response.json();
    return userRoleKpis
    } 
    async getPlantUsers(plantId){
      const plantUsersResponse=await fetch(
          baseUrl+'users?plantId='+plantId)
      const plantUsrsData=await plantUsersResponse.json();
      return plantUsrsData
    } 
    async getUserData(userId){
      const userDataResponse=await fetch(
          baseUrl+'users/userData/'+userId)
      const userData=await userDataResponse.json();
      return userData
    } 
    async getLoggedUserData(){
      const userId=await localStorage.getItem('userId');
      const userDataResponse=await fetch(
          baseUrl+'users/userData/'+userId)
      const userData=await userDataResponse.json();
      return userData
    } 

}
export default new UsersServices()