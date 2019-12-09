import React, { Component } from 'react';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

import DepartmentServices from '../../../../_services/departments'
import CatergoryServices from '../../../../_services/category'

import { ToastContainer} from 'react-toastify';
import notify from '../../../Toast/notification'

class CreateDepartmentComponent extends Component {
  constructor(props){
    super(props); 
    this.state={
        departmentName:'',
        plantKpis:[],
        categoryData:[],
        categoryNameSelected:'',
        submintButtonDisable:true
    }
    this.selectedKpiData=[]
  }  
  
  async componentDidMount(){
    const categories=await CatergoryServices.getCategories()
    this.setState({categoryData:categories})
    if(this.props.plantId){
    this.getPlantKpis()
    }
  }
  async componentDidUpdate(prevProps) {
    if (this.props.plantId !== prevProps.plantId) {
      this.getPlantKpis()
    }
  }
  getPlantKpis=async()=>{
    const planKpiResponse=await fetch(this.props.baseUrl+'plantKpis/plantKpilist/'+this.props.plantId)
    const plantKpisData=await planKpiResponse.json();
   
    plantKpisData.forEach(kpi => {
      kpi.standardScoreEnterDisable=true;
      kpi.standardScore='0';
    }); 
    this.setState({plantKpis:plantKpisData})  
  }
  handleCatergoryChange=async(event)=>{
    const { value, name } = event.target;
     this.setState({[name]: value});
  }

  handleKpiSelectedChange=async(event)=>{
    const {value} =event.target;
    
    const triggeredKpiIndex=this.state.plantKpis.findIndex(kpi=>kpi.id==value)
    this.state.plantKpis[triggeredKpiIndex].standardScoreEnterDisable=!this.state.plantKpis[triggeredKpiIndex].standardScoreEnterDisable

    if(this.state.plantKpis[triggeredKpiIndex].standardScoreEnterDisable){
        const index=this.selectedKpiData.findIndex(kpi=> kpi.kpiId == this.state.plantKpis[triggeredKpiIndex].id);
        if (index > -1){
            this.state.plantKpis[triggeredKpiIndex].standardScore='0';
            this.selectedKpiData.splice(index, 1);  
        }
    }
    else{
        const kpiToPush={
            kpiId: this.state.plantKpis[triggeredKpiIndex].id,
            standardScore:'0'
        }
        this.selectedKpiData.push(kpiToPush);
    }
    
    await this.setState({plantKpis:this.state.plantKpis})
    this.validateForm()
  }

  standardScoreChange=(event)=>{
    const { value, name } = event.target;
    if(value<0||value.includes('e')){
      return;
    }
    const triggeredKpiIndex=this.state.plantKpis.findIndex(kpi=>kpi.id==name)
    this.state.plantKpis[triggeredKpiIndex].standardScore=value;
    
    const index=this.selectedKpiData.findIndex(kpi=> kpi.kpiId == this.state.plantKpis[triggeredKpiIndex].id);
    if (index > -1){
            this.selectedKpiData[index].standardScore=value
    }
    this.setState({plantKpis:this.state.plantKpis})
  }

  standardScoreOnLeave=(event)=>{
    const { value, name } = event.target;
    if(value==''){
        const triggeredKpiIndex=this.state.plantKpis.findIndex(kpi=>kpi.id==name)
        this.state.plantKpis[triggeredKpiIndex].standardScore='0';
        const index=this.selectedKpiData.findIndex(kpi=> kpi.kpiId == this.state.plantKpis[triggeredKpiIndex].id);
        if (index > -1){
                this.selectedKpiData[index].standardScore=0
        }
        this.setState({plantKpis:this.state.plantKpis})
    }
  }

  onSubmit=async(event)=>{
    event.preventDefault();
    const year=(new Date()).getFullYear();
    const month=(new Date()).getMonth()+1;
    let departmentKpiDataToCreate=[]
    this.selectedKpiData.forEach(kpi=>{  
        for(let i=9;i<=12;i++){
          const dataToPush={
              month:i,
              year:year,
              standardScore:kpi.standardScore,
              kpiId:kpi.kpiId,
              active:true
          }
          departmentKpiDataToCreate.push(dataToPush)
        }
    })
    const departmentDataToSend={
      data:departmentKpiDataToCreate,
      departmentName:this.state.departmentName
    }
    const response=await DepartmentServices.createDepartmentWithKpis(this.props.plantId,departmentDataToSend)
    if (response.status==200){
      notify("Successfully created","success")
      this.props.history.push('/nervecenter/home/plantadmin/departments');
    }
    else if(response.status==401){
      notify("Department Name Taken","error")
    }
    else if(response.status==404){
      notify("Failed","error")
    }
  }

  handleDepartmentNameChange =async(event)=>{
    const { value, name } = event.target;
    await this.setState({[name]: value});
    this.validateForm()
  }

  validateForm=()=>{
    if(this.selectedKpiData.length<1){
        this.setState({submintButtonDisable: true});
    }
    else if(this.state.departmentName==''){
       this.setState({submintButtonDisable: true});
    }
    else{
        this.setState({submintButtonDisable: false});
    }                             
  }
  render() {
    if(this.props.accessLevel==3){
      const {plantKpis,categoryNameSelected}=this.state;
      const filteredplantKpis=plantKpis.filter(kpi=>kpi.category.categoryName.includes(categoryNameSelected));
      
      return (
            <div >
              <ToastContainer />
              <Card>
                  <CardHeader>
                    <h5 style={{fontSize:'2vw'}}>Create Department</h5>  
                  </CardHeader>
                  <CardBody>
                    <div>
                    <TextField
                      label='Department Name' 
                      name='departmentName' 
                      type='text' 
                      onChange={this.handleDepartmentNameChange}
                      value={this.state.departmentName}
                      style={{width:'40%'}}
                     
                    /> 
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

                        <div style={{marginTop:"60px"}}>
                        <table  className="table table-hover table-outline">
                            <thead className="thead-light">
                                <tr>
                                <th scope="col">KPI Name</th>
                                <th scope="col">Category</th>
                                <th scope="col">Type</th>
                                <th scope="col">Select</th>
                                <th scope="col">Target</th>
                                </tr>
                            </thead>
                            <tbody>
                                { 
                                    filteredplantKpis.map(
                                        ({id,kpiName,type,category,standardScoreEnterDisable ,standardScore}) =>
                                        <tr key={id}>
                                        <th>{kpiName}</th>
                                        <td>{category.categoryName[0]}</td>
                                        <td>{type}</td>
                                        <td><Checkbox
                                              defaultChecked={!standardScoreEnterDisable}
                                              value={id}
                                              onChange={this.handleKpiSelectedChange}
                                              color="primary"
                                          /></td>
                                          <td><input type='number'
                                            name={id}
                                            value={standardScore}
                                            onBlur={this.standardScoreOnLeave}
                                            disabled={standardScoreEnterDisable}
                                            onChange={this.standardScoreChange}
                                            id={id} className="form-control"/></td>
                                        </tr>
                                    )  
                                }
                            </tbody>
                        </table>
                        </div>
                    </div>
                      
                    <button className='btn btn-primary' 
                            onClick={this.onSubmit} 
                            disabled={this.state.submintButtonDisable}
                            style={{float:"right"}}>Submit</button>                           
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
export default CreateDepartmentComponent;
