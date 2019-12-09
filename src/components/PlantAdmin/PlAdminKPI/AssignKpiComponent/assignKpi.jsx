import React, { Component } from 'react';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import Checkbox from '@material-ui/core/Checkbox';
import CreateIcon from '@material-ui/icons/Create';
import Fab from '@material-ui/core/Fab';

import RolesServices from '../../../../_services/roles'
import PlantServices from '../../../../_services/plant'
import CatergoryServices from '../../../../_services/category'

import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

import { ToastContainer} from 'react-toastify';
import notify from '../../../Toast/notification'

class AssignKpiPlantContainer extends Component {
  constructor(props){
    super(props); 
    this.state={
      plantNotAssignedKpis:[],
      plantAssignedKPis:[],
      date:new Date(),
      submintButtonDisable:true,
      categoryData:[],
      categoryNameSelected:'',
      plantRoles:[],
      editDisable:true
    }
    this.selectedKpiData=[]
  }  
  
  componentDidMount(){
    if(this.props.plantId){
      this.getCategories()
      this.getPlantKpiStatus()
      this.getRoles()
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.plantId !== prevProps.plantId) {
      this.getCategories()
      this.getPlantKpiStatus()
      this.getRoles()
    }
  }

  getCategories=async()=>{
    const categories=await CatergoryServices.getCategories()
    this.setState({categoryData:categories})
  }
  getRoles=async()=>{
    const plantRoles=await RolesServices.getPlantRoles(this.props.plantId)
    this.setState({plantRoles:plantRoles})
  }
 
  getPlantKpiStatus=async()=>{
    const planKpiResponse=await fetch(
        this.props.baseUrl+'plantKpis/plantKpi/status/'+
        this.props.plantId+'?clusterId='+this.props.clusterId);
    const plantKpiStatusData=await planKpiResponse.json();
    let notAssignedKpis= plantKpiStatusData.notAssignedKpis;
    let assignedKpis= plantKpiStatusData.assignedKpis;
    notAssignedKpis.forEach(kpi => {
        kpi.selected=false;
        kpi.roleId='';
        kpi.priorityLevel=''
    });
    assignedKpis.forEach(kpi=>{
      kpi.editDisable=true
    })
    this.selectedKpiData=[];
    this.setState({plantNotAssignedKpis:notAssignedKpis,
        plantAssignedKPis:assignedKpis})  
  }

  handleKpiSelectedChange=async(event)=>{
    const {value} =event.target;
    const triggeredKpiIndex=this.state.plantNotAssignedKpis.findIndex(kpi=>kpi.id==value)
   
    this.state.plantNotAssignedKpis[triggeredKpiIndex].selected=!this.state.plantNotAssignedKpis[triggeredKpiIndex].selected;

    if(this.state.plantNotAssignedKpis[triggeredKpiIndex].selected){
        const kpiToPush={
            kpiId: this.state.plantNotAssignedKpis[triggeredKpiIndex].id,
            plantId:this.props.plantId,
            roleId:'',
            priorityLevel:''
        }
        this.selectedKpiData.push(kpiToPush);
    }
    else{
        this.state.plantNotAssignedKpis[triggeredKpiIndex].roleId='';
        const index=this.selectedKpiData.findIndex(kpi=> kpi.kpiId == this.state.plantNotAssignedKpis[triggeredKpiIndex].id);
        if (index > -1){
            this.selectedKpiData.splice(index, 1);  
        }
    }
    this.setState({plantNotAssignedKpis:this.state.plantNotAssignedKpis})
    this.validatePlantKpis()
  }
  
  onSubmit=async(event)=>{
    event.preventDefault();
    const response=await PlantServices.addPlantKpis(this.selectedKpiData);
    if (response.status==200){
      notify("Successfully changed","success")
      this.getPlantKpiStatus()
    }
    else{
      notify("Could not change","error")
    }
  }

  handleCatergoryChange=async(event)=>{
    const { value, name } = event.target;
    this.setState({[name]: value});
  }

  handleRoleChange=(event)=>{
    const { value, name } = event.target;
    const triggeredKpiIndex=this.state.plantNotAssignedKpis.findIndex(kpi=>kpi.kpiName==name)
    this.state.plantNotAssignedKpis[triggeredKpiIndex].roleId=value;
    const index=this.selectedKpiData.findIndex(kpi=> kpi.kpiId == this.state.plantNotAssignedKpis[triggeredKpiIndex].id);
    if (index > -1){
            this.selectedKpiData[index].roleId=value
    }
    this.setState({plantNotAssignedKpis:this.state.plantNotAssignedKpis})
    this.validatePlantKpis();
  }

  handlePriorityChange=(event)=>{
    const { value, name } = event.target;
    const triggeredKpiIndex=this.state.plantNotAssignedKpis.findIndex(kpi=>kpi.kpiName==name)
    this.state.plantNotAssignedKpis[triggeredKpiIndex].priorityLevel=value;

    const index=this.selectedKpiData.findIndex(kpi=> kpi.kpiId == this.state.plantNotAssignedKpis[triggeredKpiIndex].id);
    if (index > -1){
            this.selectedKpiData[index].priorityLevel=value
    }
    this.setState({plantNotAssignedKpis:this.state.plantNotAssignedKpis})
    this.validatePlantKpis();
  }

  validatePlantKpis=()=>{
    let valid=true;
    this.selectedKpiData.forEach(kpi=>{
      if(kpi.roleId==''){
        valid=false;
        return
      }
      if(kpi.priorityLevel==''){
        valid=false;
        return
      }
    })
    this.state.submintButtonDisable=(valid&&this.selectedKpiData.length>0)? false:true
    this.setState({submintButtonDisable:this.state.submintButtonDisable})
  }

  handleAssingKpiEditClick=(id)=>{
    const triggeredKpiIndex=this.state.plantAssignedKPis.findIndex(kpi=>kpi.id==id)
    this.state.plantAssignedKPis[triggeredKpiIndex].editDisable=!this.state.plantAssignedKPis[triggeredKpiIndex].editDisable;
    this.setState({plantAssignedKPis:this.state.plantAssignedKPis})
  }
  handleAssingedKpiRoleChange=(event)=>{
    const { value,name } = event.target;
    const triggeredKpiIndex=this.state.plantAssignedKPis.findIndex(kpi=>kpi.kpiName==name)
    this.state.plantAssignedKPis[triggeredKpiIndex].role.id=value
    this.setState({plantAssignedKPis:this.state.plantAssignedKPis})
  }
  handleAssingedKpiPriorityLevelChange=(event)=>{
    const { value,name } = event.target;
    const triggeredKpiIndex=this.state.plantAssignedKPis.findIndex(kpi=>kpi.kpiName==name)
    this.state.plantAssignedKPis[triggeredKpiIndex].priorityLevel=value
    this.setState({plantAssignedKPis:this.state.plantAssignedKPis})
  }
  
  onSubmitAssignedKpi=async(event)=>{
    event.preventDefault();
    const { value } = event.target;
    const triggeredKpiIndex=this.state.plantAssignedKPis.findIndex(kpi=>kpi.id==value)
    let updatedKpi={
      kpiId:this.state.plantAssignedKPis[triggeredKpiIndex].id,
      plantId:this.props.plantId,
      roleId:this.state.plantAssignedKPis[triggeredKpiIndex].role.id,
      priorityLevel: this.state.plantAssignedKPis[triggeredKpiIndex].priorityLevel,
    }

    const response=await PlantServices.updatePlantKpi(updatedKpi);
    if (response.status==200){
      notify("Successfully changed","success")
      this.getPlantKpiStatus()
    }
    else{
      notify("Could not change","error")
    }
  }
  render() {
    if(this.props.accessLevel==3){

      const {plantNotAssignedKpis,plantAssignedKPis,categoryNameSelected}=this.state;
      const filteredplantNotAssignedKpis=plantNotAssignedKpis.filter(kpi=>kpi.category.includes(categoryNameSelected));
      const filteredplantAssignedKpis=plantAssignedKPis.filter(kpi=>kpi.category.includes(categoryNameSelected));
      
      return (
            <div >
              <ToastContainer />
              <Card>
                  <CardHeader>
                    <h5 style={{fontSize:'2vw'}}>Plant KPI</h5>  
                  </CardHeader>
                  <CardBody>
                    <div>
                      <div style={{width:'30%',float:'right',marginBottom:'20px'}}>
                          <FormControl  className="formControl" style={{width:'90%'}}>
                                  <InputLabel >SQDCM</InputLabel>
                                  <Select
                                  name='categoryNameSelected'
                                  value={this.state.categoryNameSelected}
                                  onChange={this.handleCatergoryChange}
                                  >
                                          <MenuItem value={''}></MenuItem>
                                  { 
                                        this.state.categoryData.map(
                                            ({id,categoryName}) =>
                                            <MenuItem key={id} value={categoryName}>{categoryName[0]}</MenuItem>
                                        )  
                                    }
                                  </Select>
                            </FormControl>
                        </div>

                      <table className="table table-hover table-outline">
                            <thead className="thead-light">
                                <tr>
                                <th scope="col">KPI Name</th>
                                <th scope="col">SQDCM</th>
                                <th scope="col">Type</th>
                                <th scope="col">Measuring Unit</th>
                                <th scope="col">Select</th>
                                <th scope="col">Role</th>
                                <th scope="col">Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                { 
                                    filteredplantNotAssignedKpis.map(
                                        ({id,kpiName,type,category,measuringUnit,selected,priorityLevel,roleId},index) =>
                                        <tr key={id}>
                                        <th>{kpiName}</th>
                                        <td>{category[0]}</td>
                                        <td>{type}</td>
                                        <td>{measuringUnit}</td>
                                        <td><Checkbox
                                              defaultChecked={selected}
                                              value={id}
                                              onChange={this.handleKpiSelectedChange}
                                              color="primary"
                                          /></td>
                                        <td style={{width:'200px'}}> 
                                          <FormControl  className="formControl" style={{width:'200px'}}>
                                              <InputLabel >Select role</InputLabel>
                                              <Select
                                              disabled={!selected}
                                              name={kpiName}
                                              value={roleId}
                                              onChange={this.handleRoleChange}
                                              >
                                                      <MenuItem value={''}></MenuItem>
                                              { 
                                                    this.state.plantRoles.map(
                                                        ({id,roleName}) =>
                                                        <MenuItem key={id} value={id}>{roleName}</MenuItem>
                                                    )  
                                                }
                                              </Select>
                                           </FormControl>
                                        </td>
                                        <td>
                                           <FormControl  className="formControl" style={{width:'200px'}}>
                                                <InputLabel >Select priority</InputLabel>
                                                <Select
                                                disabled={!selected}
                                                name={kpiName}
                                                value={priorityLevel}
                                                onChange={this.handlePriorityChange}
                                                >
                                                    <MenuItem value={''}></MenuItem>
                                                    <MenuItem value={'5'}>Critical</MenuItem>
                                                    <MenuItem value={'4'}>High</MenuItem>
                                                    <MenuItem value={'3'}>Moderate</MenuItem>
                                                    <MenuItem value={'2'}>Low</MenuItem>
                                                    <MenuItem value={'1'}>Minor</MenuItem>  
                                                </Select>
                                            </FormControl>
                                        </td>
                                        </tr>
                                    )  
                                }
                            </tbody>
                        </table>
                    </div>
                      
                    <button className='btn btn-primary' disabled={this.state.submintButtonDisable} 
                    onClick={this.onSubmit} style={{float:"right"}}>Submit</button>
          
                      <div >  
                      <h3 style={{marginTop:'50px'}}>Allocated KPIs</h3>
                        <table className="table table-hover table-outline" >
                            <thead className="thead-light">
                                <tr>
                                <th scope="col">Name</th>
                                <th scope="col">SQDCM</th>
                                <th scope="col">Recorder</th>
                                <th scope="col">Priority</th>
                                <th scope="col">Submit</th>
                                <th scope="col">Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                { 
                                    filteredplantAssignedKpis.map(
                                        ({id,kpiName,category,role,priorityLevel ,editDisable}) =>
                                        <tr key={id}>
                                        <th style={{width:'280px'}}>{kpiName}</th>
                                        <td style={{paddingLeft:'30px'}}>{category[0]}</td>
                                        <td style={{width:'200px'}}> 
                                          <FormControl  className="formControl" style={{width:'200px'}}>
                                              <InputLabel >Role</InputLabel>
                                              <Select
                                              disabled={editDisable}
                                              name={kpiName}
                                              value={role.id}
                                              onChange={this.handleAssingedKpiRoleChange}
                                              >
                                              { 
                                                    this.state.plantRoles.map(
                                                        ({id,roleName}) =>
                                                        <MenuItem key={id} value={id}>{roleName}</MenuItem>
                                                    )  
                                              }
                                              </Select>
                                           </FormControl>
                                        </td>
                                        <td>
                                           <FormControl  className="formControl" style={{width:'200px'}}>
                                                <InputLabel >Priority</InputLabel>
                                                <Select
                                                disabled={editDisable}
                                                name={kpiName}
                                                value={priorityLevel}
                                                onChange={this.handleAssingedKpiPriorityLevelChange}
                                                >
                                                    <MenuItem value={'5'}>Critical</MenuItem>
                                                    <MenuItem value={'4'}>High</MenuItem>
                                                    <MenuItem value={'3'}>Moderate</MenuItem>
                                                    <MenuItem value={'2'}>Low</MenuItem>
                                                    <MenuItem value={'1'}>Minor</MenuItem>                                               </Select>
                                            </FormControl>
                                        </td>
                                        <td >
                                          <button disabled={editDisable}
                                           value={id}
                                           onClick={this.onSubmitAssignedKpi}
                                           className='btn btn-primary'>Submit</button>
                                        </td>
                                        <td>
                                        <Fab name={id} 
                                         onClick={()=>{this.handleAssingKpiEditClick(id)}}
                                         style={{width:'35px',height:'35px'}} aria-label="add" >
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
      )
    }  else{
      return (
        <h2>Unautharized</h2>
      ) 
    } 
  }
}
export default AssignKpiPlantContainer;
