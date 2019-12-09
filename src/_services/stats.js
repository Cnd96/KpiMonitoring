import baseUrl from './service'
class StatsServices{
    
    async getDepartmentsAcheivement(plantId){
        const currentYear=(new Date()).getFullYear();
        const currentMonth=(new Date()).getMonth();

        const lastmonthLastDay=new Date(currentYear,currentMonth,0);
        const lastMonthLastDate=lastmonthLastDay.getDate();
        const lastMonth=lastmonthLastDay.getMonth()+1;
        const lastMonthYear=lastmonthLastDay.getFullYear();
        const departmentsAchievementResponse=await fetch(
            baseUrl+'stats/plant/departments/achievement/'+plantId+
            '?month='+lastMonth+'&year='+lastMonthYear+'&toDate='+lastMonthLastDate)
        const departmentsAchievement=await departmentsAchievementResponse.json();
        return departmentsAchievement
    }
     async getDepartmentKpiAcheivement(departmentId,kpiId){
        const currentYear=(new Date()).getFullYear();
        const currentMonth=(new Date()).getMonth();

        const lastmonthLastDay=new Date(currentYear,currentMonth,0);
        const lastMonthLastDate=lastmonthLastDay.getDate();
        const lastMonth=lastmonthLastDay.getMonth()+1;
        const lastMonthYear=lastmonthLastDay.getFullYear();
        const departmentKpiAchievementResponse=await fetch(
            baseUrl+'stats/plant/departmentKpi/achievement?month='+lastMonth+
            '&year='+lastMonthYear+'&toDate='+lastMonthLastDate+'&departmentId='+departmentId+
            '&kpiId='+kpiId)
        const departmentKpiAchievement=await departmentKpiAchievementResponse.json();
        return departmentKpiAchievement
    } 
    async getDepartmentsAcheivementCategoryWise(plantId){
        const currentYear=(new Date()).getFullYear();
        const currentMonth=(new Date()).getMonth();

        const lastmonthLastDay=new Date(currentYear,currentMonth,0);
        const lastMonthLastDate=lastmonthLastDay.getDate();
        const lastMonth=lastmonthLastDay.getMonth()+1;
        const lastMonthYear=lastmonthLastDay.getFullYear();

        const departmentsAchievementResponse=await fetch(
            baseUrl+'stats/plant/departments/achievement/categoryWise/'+plantId+
            '?month='+lastMonth+'&year='+lastMonthYear+'&toDate='+lastMonthLastDate);
        const departmentsAchievementCatergoryWise=await departmentsAchievementResponse.json();
        return departmentsAchievementCatergoryWise;
    } 
    async getPlantCriticalKpiList(plantId){
        const plantPriorityKpiListResponse=await fetch(
            baseUrl+'stats/plant/priorityKpis/'+plantId);
        const plantPriorityKpiList=await plantPriorityKpiListResponse.json();
        return plantPriorityKpiList;
    } 
}

export default new StatsServices()