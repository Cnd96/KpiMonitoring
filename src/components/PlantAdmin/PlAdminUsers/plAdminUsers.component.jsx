import React, { Component } from 'react';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';

import RolesServices from '../../../_services/roles'
import UsersServices from '../../../_services/users'

import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

class PlantAdminUserComponent extends Component {
  constructor(props){
    super(props);
    this.state={
        clusterId:'',
        plantId:'',
        plantRoles:[],
        selectedRole:'',
        plantUsers:[]
    }
    this.selectedRoles=[]
  }
  async componentDidMount(){
    if (this.props.plantId) {
     await this.setState({plantId:this.props.plantId,clusterId:this.props.clusterId})
     this.getRoles();
     this.getUsers()
    }
  }
  async componentDidUpdate(prevProps) {
    if (this.props.plantId !== prevProps.plantId) {
      await this.setState({plantId:this.props.plantId,clusterId:this.props.clusterId})
      this.getRoles();
      this.getUsers()
    }
  }
  getRoles=async()=>{
    const plantRoles=await RolesServices.getPlantRoles(this.state.plantId)
    this.setState({plantRoles:plantRoles})
  }
  getUsers=async()=>{
    let plantUsers=await UsersServices.getPlantUsers(this.state.plantId)

    plantUsers.forEach(user => {
      if(user.accessLevel==1){
        user.access='Viewer'
      }
      else if(user.accessLevel==2){
        user.access='Recorder'
      }
      else if(user.accessLevel==3){
        user.access='Plant Admin'
      }
    });
    this.setState({plantUsers:plantUsers})
  }

  handleAddUserClick=()=>{
    this.props.history.push('/nervecenter/home/plantadmin/createUser');
  }
  handleUserEditClick=(userId)=>{
   
    this.props.history.push('/nervecenter/home/plantadmin/users/'+userId);
  }

  render() {
    if(this.props.accessLevel==3){
    return (
      <div >
            <Card>
                <CardHeader>
                  <h5 style={{fontSize:'2vw'}}>Plant Users
                    <Fab onClick={()=>{this.handleAddUserClick()}}
                        style={{float:'right',width:'45px',height:'45px'}} color="primary" aria-label="add" >
                       <AddIcon />
                    </Fab>
                  </h5>      
                </CardHeader>
                <CardBody>
                <div>
                      <div style={{width:'30%',float:'right',marginBottom:'20px'}}>
                          {/* <FormControl  className="formControl" style={{width:'90%'}}>
                                  <InputLabel >Role</InputLabel>
                                  <Select
                                  name='selectedRole'
                                  value={this.state.selectedRole}
                                  >
                                    <MenuItem value={''}></MenuItem>
                                   { 
                                        this.state.plantRoles.map(
                                            ({id,roleName}) =>
                                            <MenuItem key={id} value={roleName}>{roleName}</MenuItem>
                                        )  
                                    }
                                  </Select>
                            </FormControl> */}
                      </div>
                    <table style={{}} className="table table-hover table-outline">
                          <thead className="thead-light">
                              <tr>
                              <th scope="col">User Name</th>
                              <th scope="col">Departments</th>
                              <th scope="col">Roles</th>
                              <th scope="col">Access Level</th>
                              <th scope="col">Edit</th>
                              </tr>
                          </thead>
                          <tbody>
                              { 
                                  this.state.plantUsers.map(
                                      ({id,userName,access,departments,roles }) =>
                                      <tr key={id}>
                                      <td style={{fontWeight:'bold'}}>{userName}</td>
                                      <td>
                                        {
                                            departments.map(({id,departmentName})=>
                                            <Typography key={id}>
                                            • {departmentName}
                                            </Typography>
                                            )
                                        }
                                      </td>
                                      <td>
                                        {
                                            roles.map(({id,roleName})=>
                                            <Typography key={id}>
                                            • {roleName}
                                            </Typography>
                                            )
                                        }
                                      </td>
                                      <td>{access}</td>
                                      <td>
                                      <Fab name={id} onClick={()=>{this.handleUserEditClick(id)}} style={{width:'35px',height:'35px'}} aria-label="add" >
                                            <CreateIcon />
                                      </Fab>
                                      </td>
                                      </tr>
                                  )  
                              }
                          </tbody>
                      </table>
                  </div> 
                </CardBody>
            </Card>          
      </div>
    );
   }  else{
    return (
      <h2>Unautharized</h2>
    ) 
  } 
  }
}

export default PlantAdminUserComponent;
