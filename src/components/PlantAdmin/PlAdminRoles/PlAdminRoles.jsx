import React, { Component } from 'react';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import RolesServices from '../../../_services/roles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import './PlAdminRoles.styles.scss'

import { ToastContainer} from 'react-toastify';
import notify from '../../Toast/notification'
import 'react-toastify/dist/ReactToastify.css';

class PlantAdminRoleComponent extends Component {

  constructor(props){
    super(props);
    this.state={
        roleName:'',
        plantAssignedRoles:[],
        plantNotAssignedRoles:[],
        submintButtonDisable:true,
        clusterId:'',
        plantId:''
    }
    this.selectedRoles=[]
  }
  async componentDidMount(){
    if (this.props.plantId) {
      await this.setState({plantId:this.props.plantId,clusterId:this.props.clusterId})
      const plantRolesStatus=await RolesServices.getPlantRolesStatus(this.state.plantId,this.state.clusterId)
      this.setState({plantAssignedRoles:plantRolesStatus.plantAssignedRoles,
          plantNotAssignedRoles:plantRolesStatus.plantNotAssignedRoles})
    }
  }
  async componentDidUpdate(prevProps) {
    if (this.props.plantId !== prevProps.plantId) {
      await this.setState({plantId:this.props.plantId,clusterId:this.props.clusterId})
      const plantRolesStatus=await RolesServices.getPlantRolesStatus(this.state.plantId,this.state.clusterId)
      this.setState({plantAssignedRoles:plantRolesStatus.plantAssignedRoles,
        plantNotAssignedRoles:plantRolesStatus.plantNotAssignedRoles})
    }
  }

  handleChangeRoleSelect=(event)=>{
    const { value, checked } = event.target;
    if(checked==true){
        const dataToPush={
            plantId:this.state.plantId,
            roleId:value,
            freeze:true
        }
        this.selectedRoles.push(dataToPush)
    }else if(checked==false){
        const index=this.selectedRoles.findIndex(role=> role.roleId == value);
        if (index > -1){
            this.selectedRoles.splice(index, 1);  
        }
    }
    this.state.submintButtonDisable=(this.selectedRoles.length>0)? false:true
    this.setState({submintButtonDisable:this.state.submintButtonDisable})
  }

  handleSubmit=async (event)=>{
    event.preventDefault();
    const response=await RolesServices.addRolesToPlant(this.selectedRoles);
    if (response.status==200){
      alert("Successfully saved"); 
      this.props.history.push('/nervecenter/home/departments');
    }
    else{
      alert("Failed"); 
    }
  }

  toggleFreeze=async(event)=>{
    event.preventDefault();
    const {value} = event.target;
    let triggeredRole=this.state.plantAssignedRoles.find(role=>role.id==value);
    triggeredRole.freeze=!triggeredRole.freeze;

    const response=await RolesServices.updatePlantRole(triggeredRole);
    if (response.status==200){
      await this.setState({plantAssignedRoles:this.state.plantAssignedRoles})
      notify("Successfully changed","success")
    }
    else{
      notify("Could not change","error")
    }
    
  }
  
  render() {
    if(this.props.accessLevel==3){
    return (
      <div className="admin-category-container">
        <ToastContainer />
            <Card>
                <CardHeader>
                  <h5 style={{fontSize:'2vw'}}>Plant Roles
                  </h5>  
                </CardHeader>
                <CardBody>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Paper>
                             <h4 style={{marginLeft:'15px',paddingTop:'10px'}}>Cluster Roles</h4>
                             <div>
                                <FormControl component="fieldset" style={{marginLeft:'15px',paddingTop:'10px'}}>
                                    <FormGroup>
                                    {
                                        this.state.plantNotAssignedRoles.map(({id,roleName})=>
                                        <FormControlLabel
                                        key={id}
                                        name={roleName}
                                        control={<Checkbox onChange={this.handleChangeRoleSelect} value={id} />}
                                        label={roleName}
                                        />                       
                                        )
                                    }
                                    </FormGroup>
                                </FormControl>
                             </div>
                             
                             <div style={{position:'relative',padding:'10px'}}>
                                <button onClick={this.handleSubmit} disabled={this.state.submintButtonDisable}
                                className="btn btn-primary" >Submit</button>
                             </div>
                            

                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper>
                            <h4 style={{marginLeft:'15px',paddingTop:'10px'}}>Our Roles</h4>
                            <table className="table table-hover table-outline">
                                <thead>
                                  
                                </thead>
                                <tbody>
                             {
                                this.state.plantAssignedRoles.map(({id,roleName,freeze})=>
                                // <div key={id}>
                                //     <label className="plantAdminRoleNameLabel">{roleName}</label>
                                    // <FormControlLabel
                                    //   value={id}
                                    //   control={<Switch checked={!freeze} onChange={this.toggleFreeze} color="primary" />}
                                    //   label="Unfreeze"
                                    //   labelPlacement="end"
                                    // /> 
                                // </div>    
                                
                                  <tr key={id}>
                                    <td>{roleName}</td>
                                    <td>
                                    <FormControlLabel
                                      value={id}
                                      control={<Switch checked={!freeze} onChange={this.toggleFreeze} color="primary" />}
                                      label="Unfreeze"
                                      labelPlacement="end"
                                    />
                                    </td>
                                  </tr>                   
                                )
                             }
                              </tbody>
                              </table> 
                            </Paper>
                        </Grid>
                       
                    </Grid>
                                             
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

export default PlantAdminRoleComponent;
