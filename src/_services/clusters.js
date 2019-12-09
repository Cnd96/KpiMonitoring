import baseUrl from './service'
class ClusterServices{
    
    async getPlantsInCluster(clusterId){
      const clusterPlantsResponse=await fetch(
          baseUrl+'clusters/'+clusterId)
      const clusterPlantsData=await clusterPlantsResponse.json();
      return clusterPlantsData.plants
    } 
    
  
    async createPlant(plantData){
      const response=await fetch(baseUrl+"plants", {
          method: "POST",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body:JSON.stringify(plantData)
        })
      return response
    }   
}

export default new ClusterServices()