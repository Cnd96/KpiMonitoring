import baseUrl from './service'
class DepartmentServices{
    
    async getDepartmentsInPlant(plantId){
      const plantDepartmentsResponse=await fetch(
          baseUrl+'plants/'+plantId)
      const departmentData=await plantDepartmentsResponse.json();
      return departmentData
    } 
    
    async getDepartmentStatus(plantId,departmentId){

        const currentYear=(new Date()).getFullYear();
        const currentMonth=(new Date()).getMonth();

        const lastmonthLastDay=new Date(currentYear,currentMonth,0);
        const lastMonth=lastmonthLastDay.getMonth()+1;
        const lastMonthYear=lastmonthLastDay.getFullYear();

        const departmentStatusResponse=await fetch(
            baseUrl+'departments/departmentKpis/status/'+departmentId+'?plantId='+plantId+
            '&month='+lastMonth+'&year='+lastMonthYear)
        const departmentData=await departmentStatusResponse.json();
        return departmentData
    } 
    async createDepartmentWithKpis(plantId,departmentDataToSend){
        const response=await fetch(baseUrl+"departmentKpis/createDepartment/"+plantId, {
            method: "POST",
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(departmentDataToSend)
          })
        return response
    } 
    async addDepartmentKpis(plantId,departmentKpisToSend){
        const response=await fetch(baseUrl+"departmentKpis/updateDepartmentKpis/"+plantId, {
            method: "POST",
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(departmentKpisToSend)
          })
        return response
    } 

    async getDepartmentKpiHistory(kpiId,departmentId,dateRange){
      const departmentKpiResponse=await fetch(baseUrl+'departments/kpi/history/'+departmentId+'?kpiId='+kpiId, {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(dateRange)
      })
      
      const departmentKpiData=await departmentKpiResponse.json();
      return departmentKpiData
    } 
    async getDepartmentKpiRecordAudit(kpiId,departmentId,month,year){
      const departmentKpiRecordResponse=await fetch(
        baseUrl+'kpirecordAudits/'+departmentId+'/'+kpiId+'?month='+month+'&year='+year)
      const departmentKpiRecordAudit=await departmentKpiRecordResponse.json();
      return departmentKpiRecordAudit
    } 
    async getDepartmentMonthlyRecordsStatus(departmentId,year,month){
      const departmentMonthlyRecordsResponse=await fetch(
        baseUrl+'departments/departmentMonthlyRecords/status/'+departmentId+'/?month='+month+'&year='+year)
      const departmentMonthlyRecordsStatus=await departmentMonthlyRecordsResponse.json();
      return departmentMonthlyRecordsStatus
    } 
}

export default new DepartmentServices()