import baseUrl from './service'
class DepartmentKpisServices{
    
    async getYearKpiStandardScores(departmentId,kpiId){
        const currentYear=(new Date()).getFullYear();
        const departmentStatusResponse=await fetch(
            baseUrl+'departmentKpis/getYearKpiStandardScores/'+departmentId+'?year='+currentYear+
            '&kpiId='+kpiId)
        const departmentData=await departmentStatusResponse.json();
        return departmentData
    } 
    async updateMonthlyStandardScore(data){
        const response=await fetch(baseUrl+"departmentKpis/updateMonthlyStandardScore", {
        method: "POST",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body:JSON.stringify(data)
        })
        return response
    } 

    async updateMonthlyStandardScoreAllDepartments(data,plantId){
        const response=await fetch(baseUrl+"departmentKpis/updateMonthlyStandardScore/allDepartments/"+plantId, {
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

export default new DepartmentKpisServices()