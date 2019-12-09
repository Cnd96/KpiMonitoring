import React, { Component } from 'react';
import {Card,CardBody,CardHeader,} from 'reactstrap';

import PlantRoleExpansion from '../PlantRolesExpansion.component'
import PlantDepartmentExpansion from '../PlantDeparmentsExpansion.component'
import RolesServices from '../../../../_services/roles'
import PlantServices from '../../../../_services/plant'
import UsersServices from '../../../../_services/users'

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

class PlantAdminEditUserComponent extends Component {
  constructor(props){
    super(props); 
    this.state={
      userId:'',
      plantId:'',
      userId:props.match.params.userId,
      username:'',
      plantRoles:[],
      plantDeparments:[],
      selectedRoles:[],
      selectedDepartments:[],
      selectedAccessLevel:'1',
      submintButtonDisable:true
    }
  }  
  
  async componentDidMount(){
    if (this.props.plantId) {
      await this.setState({plantId:this.props.plantId})
      await this.getUserData()
      await this.getRoles()
      await this.getPlantDepartments()
    }
  }
  async componentDidUpdate(prevProps) {
    if (this.props.plantId !== prevProps.plantId) {
      await this.setState({plantId:this.props.plantId})
      await this.getUserData()
      await this.getRoles()
      await this.getPlantDepartments()
    }
  }
  getUserData=async()=>{
    console.log(this.state.userId)
    const userData=await UsersServices.getUserData(this.state.userId)
    const {userName,accessLevel,departments,roles,id}=userData;
    await this.setState({username:userName,selectedAccessLevel:accessLevel
      ,selectedDepartments:departments,selectedRoles:roles,userId:id})
      
  }

  getRoles=async()=>{
    const plantRoles=await RolesServices.getPlantRoles(this.state.plantId)
    plantRoles.forEach(role => {
      role.isSelected=false
      this.state.selectedRoles.forEach(selectedRole=>{
        if(selectedRole.id==role.id){
          role.isSelected=true;
          return;
        }
      })
    });

    await this.setState({plantRoles:plantRoles})
  }
  getPlantDepartments=async()=>{
    const plantData=await PlantServices.getDepartmentsInPlant(this.state.plantId)
    plantData.departments.forEach(department => {
      department.isSelected=false
      this.state.selectedDepartments.forEach(selectedDepartment=>{
        if(selectedDepartment.id==department.id){
          department.isSelected=true;
          return;
        }
      })
    });
    await this.setState({plantDeparments:plantData.departments})
  }

  handleChangeDepartmentSelect=async(event)=>{
    const { value } = event.target;
    const index=this.state.plantDeparments.findIndex(department=> department.id == value);
    if (index > -1){
      this.state.plantDeparments[index].isSelected=!this.state.plantDeparments[index].isSelected
    }
    if(this.state.plantDeparments[index].isSelected){
      this.state.selectedDepartments.push(this.state.plantDeparments[index])
    }
    else if(!this.state.plantDeparments[index].isSelected){
      const selectedDepartmentIndex=this.state.selectedDepartments.findIndex(role=> role.id == value);
      if (selectedDepartmentIndex>-1){
        this.state.selectedDepartments.splice(selectedDepartmentIndex, 1); 
      }
    }
    await this.setState({plantDeparments:this.state.plantDeparments,selectedDepartments:this.state.selectedDepartments})
    this.validateUserForm()
  }

  handleUserNameChange=async(event)=>{
    const { value, name } = event.target;
    await this.setState({[name]: value});
    this.validateUserForm()
  }

  handleChangeRoleSelect=(event)=>{
    const { value } = event.target;
    const index=this.state.plantRoles.findIndex(role=> role.id == value);
    if (index > -1){
      this.state.plantRoles[index].isSelected=!this.state.plantRoles[index].isSelected
    }

    if(this.state.plantRoles[index].isSelected){
      this.state.selectedRoles.push(this.state.plantRoles[index])
    }
    else if(!this.state.plantRoles[index].isSelected){
      const selectedRoleIndex=this.state.selectedRoles.findIndex(role=> role.id == value);
      if (selectedRoleIndex > -1){
        this.state.selectedRoles.splice(selectedRoleIndex, 1); 
      }
    }
    this.setState({plantRoles:this.state.plantRoles,selectedRoles:this.state.selectedRoles})
    this.validateUserForm(); 
  }

  handleAccessLevelChange=async(event)=>{
    const { value,name } = event.target;
    await this.setState({[name]: value});
    if(value=='1'){
      this.state.selectedRoles=[];
      this.state.plantRoles.forEach(role=>{
        role.isSelected=false
      })
      await this.setState({selectedRoles:this.state.selectedRoles})
    } 
    this.validateUserForm();   
  }

  onSubmit=async()=>{
    let roleIds=[];
    let departmentIds=[];
    this.state.selectedRoles.forEach(role=>{
      roleIds.push(role.id)
    })
    this.state.selectedDepartments.forEach(department=>{
      departmentIds.push(department.id)
    })
    const userToCreate={
      userId:this.state.userId,
      plantId:this.state.plantId,
      userName:this.state.username,
      accessLevel:this.state.selectedAccessLevel,
      roleIds:roleIds,
      departmentIds:departmentIds
    }
    
    console.log(userToCreate)
    const response=await UsersServices.updateUser(userToCreate);
    if (response.status==200){
      alert("Successfully saved"); 
      this.props.history.push('/nervecenter/home/plantadmin/users');
    }
    else{
      console.log(response.status)
      alert("Failed"); 
    }
  }

  validateUserForm=()=>{
    let valid=true;
    if(this.state.username==''){
      valid=false
    }
    else if(this.state.selectedAccessLevel=='2'){
      if(this.state.selectedRoles.length<=0){
        valid=false
      }
    }
    this.state.submintButtonDisable=(valid)? false:true
    this.setState({submintButtonDisable:this.state.submintButtonDisable})
   }
  render() {
    if(this.props.accessLevel==3){
      
      return (
            <div >
              <Card>
                  <CardHeader>
                    <h5 style={{fontSize:'2vw'}}>Edit User</h5>  
                  </CardHeader>
                  <CardBody>
                  <Grid item xs={12}   sm={6}>
                     <div>
                          <TextField
                          label='Username' 
                          name='username' 
                          type='text' 
                          onChange={this.handleUserNameChange}
                          value={this.state.username}
                          style={{width:'35%'}}
                           /> 

                         <FormControl style={{ marginLeft:'20px', width:'35%'}}>
                            <InputLabel >Level</InputLabel>
                            <Select
                              name="selectedAccessLevel"
                              value={this.state.selectedAccessLevel}
                              onChange={this.handleAccessLevelChange}
                            >
                              <MenuItem value={1}>Viewer</MenuItem>
                              <MenuItem value={2}>Recorder</MenuItem>
                              <MenuItem value={3}>Plant Admin</MenuItem>
                            </Select>
                          </FormControl>
                          <button className='btn btn-primary' 
                            disabled={this.state.submintButtonDisable} 
                            onClick={this.onSubmit} 
                            style={{marginTop:'13px',marginLeft:'43px'}}>Submit</button>
                      </div>          
                  </Grid>
                      
                  <Grid container spacing={3}>
                        <Grid item container xs={12}  sm={6}>
                          <Grid item xs={12}   sm={6}>
                              <table style={{marginTop:'30px'}} className="table table-borderless ">
                                <thead className="thead-light">
                                    <tr>
                                    <th scope="col">Assigning Roles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { 
                                        this.state.selectedRoles.map(
                                            ({id,roleName }) =>
                                            <tr key={id}>
                                            <th>{roleName}</th>
                                            </tr>
                                        )  
                                    }
                                </tbody>
                            </table>
                          </Grid>
                          <Grid item xs={12}   sm={6}>
                           <table style={{marginTop:'30px'}} className="table table-borderless ">
                                <thead className="thead-light">
                                    <tr>
                                    <th scope="col">Assigning Departments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { 
                                        this.state.selectedDepartments.map(
                                            ({id,departmentName }) =>
                                            <tr key={id}>
                                            <th>{departmentName}</th>
                                            </tr>
                                        )  
                                    }
                                </tbody>
                            </table>
                          </Grid>                      
                        </Grid>
                        <Grid item xs={12}    sm={6}>                 
                          <PlantDepartmentExpansion
                            plantDeparments={this.state.plantDeparments}
                            handleChangeDepartmentSelect={this.handleChangeDepartmentSelect}
                          />
                          <PlantRoleExpansion plantRoles={this.state.plantRoles} 
                            selectedAccessLevel={this.state.selectedAccessLevel}
                            handleChangeRoleSelect={this.handleChangeRoleSelect}
                          />
                        </Grid>
                       
                    </Grid>
                                      
                  </CardBody>
              </Card>          
        </div>
      )
    }  else{
      return (
        <h2>Unautharized</h2>
      ) 
    } 
  }
}
export default PlantAdminEditUserComponent;
