import baseUrl from './service'
class DailyKpiRecordsServices{
    
    async getDailyKpiRecordStatus(departmentId,year,month,date){
        const response=await fetch(baseUrl+'dailyKpiRecords/dailyStatus?departmentId='+
             departmentId+'&year='+year+'&month='+month+'&date='+date)
        const data=await response.json();
        return data
    } 
    async getDailyKpiRecordStatusRoleWise(plantId,kpiId,year,month,date){
        const response=await fetch(baseUrl+'dailyKpiRecords/dailyStatus/roleWise?plantId='+
              plantId+'&year='+year+'&month='+month+'&date='+date+'&kpiId='+kpiId)
        const data=await response.json();
        return data
    } 
    async createDailyKpiRecordsRoleWise(data,userId){
        const response=await fetch(baseUrl+"dailyKpiRecords/bulkCreate/"+userId, {
            method: "POST",
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(data)
          })
        return response
    } 
    async updateDailyKpiRecordsRoleWise(data){
        const response=await fetch(baseUrl+"dailyKpiRecords/update", {
            method: "POST",
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(data)
          })
        return response
    } 
}

export default new DailyKpiRecordsServices()