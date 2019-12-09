import baseUrl from './service'
class KpiServices{
    
    async createKpi(kpiData){
      const response=await fetch(baseUrl+"kpis", {
          method: "POST",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body:JSON.stringify(kpiData)
        })
      return response
    }
    async updateKpi(kpiData){
        const response=await fetch(baseUrl+"kpis/update", {
            method: "POST",
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(kpiData)
          })
        return response
      }
    
}

export default new KpiServices()