import baseUrl from './service'
class RolesServices{ 
    async getClusterRoles(clusterId){
        const clusterRolesResponse=await fetch(
            baseUrl+'roles?clusterId='+clusterId)
        const rolesData=await clusterRolesResponse.json();
        return rolesData
    }
    async getPlantRolesStatus(plantId,clusterId){
        const plantRolesStatusResponse=await fetch(
            baseUrl+'plantRoles/status/'+plantId+'?clusterId='+clusterId)
        const plantRolesStatus=await plantRolesStatusResponse.json();
        return plantRolesStatus
    } 
    
    async getPlantRoles(plantId){
        const plantRolesResponse=await fetch(
            baseUrl+'plants/plantRoles/'+plantId)
        const plantRoles=await plantRolesResponse.json();
        return plantRoles
    } 

    async createRole(roleData){
        const response=await fetch(baseUrl+"roles", {
            method: "POST",
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(roleData)
          })
        return response
    } 

    async updatePlantRole(plantUpdatedRoleData){
        const response=await fetch(baseUrl+"plantRoles/update", {
            method: "POST",
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(plantUpdatedRoleData)
          })
        return response
    } 

    async addRolesToPlant(plantRolesData){
        const response=await fetch(baseUrl+"plantRoles/bulkcreate", {
            method: "POST",
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(plantRolesData)
          })
        return response
    } 
}

export default new RolesServices()