import baseUrl from './service'
class AuthServices{ 
    async login(userData){
        const response=await fetch(baseUrl+"auth/login", {
            method: "POST",
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(userData)
          })
        return response.json()
    } 
    async adAuthenticate(userData){
      const response=await fetch(baseUrl+"auth/adAuthenticate", {
          method: "POST",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body:JSON.stringify(userData)
        })
      return response
  } 
    async getUserData(){
      const userId=await localStorage.getItem('userId');
      const userDataResponse=await fetch(
        baseUrl+'auth/getLoggedUserData/'+userId)
      const userData=await userDataResponse.json();
      return userData  
    } 
}

export default new AuthServices()