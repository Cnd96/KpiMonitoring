import baseUrl from './service'
class PlantServices{
    
    async getDepartmentsInPlant(plantId){
      const plantDepartmentsResponse=await fetch(
          baseUrl+'plants/'+plantId)

      
      const plantDepartmentData=await plantDepartmentsResponse.json();
      console.log(plantDepartmentsResponse)
      return plantDepartmentData
    } 
    
    async addPlantKpis(kpiData){
      const response=await fetch(baseUrl+"plantKpis/bulkcreate", {
          method: "POST",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body:JSON.stringify(kpiData)
        })
      return response
    }
    async updatePlantKpi(kpiData){
      const response=await fetch(baseUrl+"plantKpis/update", {
          method: "POST",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body:JSON.stringify(kpiData)
        })
      return response
    }

    async updatePlantDepartmentsNewYearSScores(plantId){
      const currentYear=(new Date()).getFullYear();
      await fetch(baseUrl+"plants/updatePlantKpiStandardScores/"+plantId+"?year="+currentYear)
    }
    
}

export default new PlantServices()