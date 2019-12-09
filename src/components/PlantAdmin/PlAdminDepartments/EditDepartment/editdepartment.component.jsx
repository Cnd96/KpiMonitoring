import React, { Component } from 'react'
import DepartmentServices from '../../../../_services/departments'
import CatergoryServices from '../../../../_services/category'

import {Card,CardBody,CardHeader,} from 'reactstrap';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import CreateIcon from '@material-ui/icons/Create';
import Fab from '@material-ui/core/Fab';

class EditDepartmentComponent extends Component {

  constructor(props){
    super(props);
    this.state={
      categoryData:[],
      departmentName:'',
      departmentAssignedKpis:[],
      departmentNotassignedKpis:[],
      categoryNameSelected:'',
      departmentId:props.match.params.id,
      submitButtonDisable:true,
    }
    this.selectedKpiData=[]
    
  }

  async componentDidMount(){
    if(this.props.plantId){
      this.getDepartmentData()
    }
  }
  async componentDidUpdate(prevProps) {
    if (this.props.plantId !== prevProps.plantId) {
      this.getDepartmentData()
    }
  }

  getDepartmentData=async()=>{
    const categories=await CatergoryServices.getCategories();
    const departmentData=await DepartmentServices.getDepartmentStatus(this.props.plantId,this.state.departmentId)
    departmentData.notAssignedKpis.forEach(kpi => {
      kpi.standardScoreEnterDisable=true;
      kpi.standardScore='0';
    }); 
   
    this.setState({departmentName:departmentData.department.departmentName,
      departmentAssignedKpis:departmentData.assignedKpis,
      departmentNotassignedKpis:departmentData.notAssignedKpis,
      categoryData:categories
    })
  }

  handleDepartmentNameChange =async(event)=>{
    const { value, name } = event.target;
    await this.setState({[name]: value});
    this.validateSubmit()
  }

  
  handleKpiSelectedChange=async(event)=>{
    const {value} =event.target;
    
    const triggeredKpiIndex=this.state.departmentNotassignedKpis.findIndex(kpi=>kpi.id==value)
    this.state.departmentNotassignedKpis[triggeredKpiIndex].standardScoreEnterDisable=!this.state.departmentNotassignedKpis[triggeredKpiIndex].standardScoreEnterDisable

    if(this.state.departmentNotassignedKpis[triggeredKpiIndex].standardScoreEnterDisable){
        const index=this.selectedKpiData.findIndex(kpi=> kpi.kpiId == this.state.departmentNotassignedKpis[triggeredKpiIndex].id);
        if (index > -1){
            this.state.departmentNotassignedKpis[triggeredKpiIndex].standardScore='0';
            this.selectedKpiData.splice(index, 1);  
        }
    }
    else{
        const kpiToPush={
            kpiId: this.state.departmentNotassignedKpis[triggeredKpiIndex].id,
            standardScore:'0',
            departmentId:this.state.departmentId
        }
        this.selectedKpiData.push(kpiToPush);
    }
    
    await this.setState({departmentNotassignedKpis:this.state.departmentNotassignedKpis})
   
    this.validateSubmit()
  }

  validateSubmit=()=>{
    if(this.state.departmentName==''){
      this.setState({submitButtonDisable:true})
    }
    else{
      this.setState({submitButtonDisable:false})
    }
    
  }
  standardScoreChange=(event)=>{
    const { value, name } = event.target;
    if(value<0||value.includes('e')){
      return;
    }
    const triggeredKpiIndex=this.state.departmentNotassignedKpis.findIndex(kpi=>kpi.id==name)
    this.state.departmentNotassignedKpis[triggeredKpiIndex].standardScore=value;
    
    const index=this.selectedKpiData.findIndex(kpi=> kpi.kpiId == this.state.departmentNotassignedKpis[triggeredKpiIndex].id);
    if (index > -1){
            this.selectedKpiData[index].standardScore=value
    }
    this.setState({departmentNotassignedKpis:this.state.departmentNotassignedKpis})
  }

  standardScoreOnLeave=(event)=>{
    const { value, name } = event.target;
    if(value==''){
        const triggeredKpiIndex=this.state.departmentNotassignedKpis.findIndex(kpi=>kpi.id==name)
        this.state.departmentNotassignedKpis[triggeredKpiIndex].standardScore='0';
        const index=this.selectedKpiData.findIndex(kpi=> kpi.kpiId == this.state.departmentNotassignedKpis[triggeredKpiIndex].id);
        if (index > -1){
                this.selectedKpiData[index].standardScore=0
        }
        this.setState({departmentNotassignedKpis:this.state.departmentNotassignedKpis})
    }
  }
  handleCatergoryChange=async(event)=>{
    const { value, name } = event.target;
     this.setState({[name]: value});
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
              departmentId:kpi.departmentId,
              active:true
          }
          departmentKpiDataToCreate.push(dataToPush)
        }
    })
    let dataTosend={
      departmentKpiDataToCreate:departmentKpiDataToCreate,
      departmentName:this.state.departmentName,
      departmentId:this.state.departmentId
    }

    const response=await DepartmentServices.addDepartmentKpis(this.props.plantId,dataTosend)
    
    if (response.status==200){
      alert("Successfully saved"); 
      this.props.history.push('/nervecenter/home/plantadmin/departments');
    }
    else{
      alert("Failed"); 
    }
  }

  handleUpdateSScoreClick=(kpiId)=>{
    this.props.history.push('/nervecenter/home/plantadmin/updateKPI/'+this.state.departmentId+'/'+kpiId+'/'+this.state.departmentName);
  }

  render() {
    if(this.props.accessLevel==3){
      const {departmentNotassignedKpis,departmentAssignedKpis,categoryNameSelected}=this.state;
      const filteredDepartmentNotassignedKpis=departmentNotassignedKpis.filter(kpi=>kpi.category.includes(categoryNameSelected));
      const filteredDepartmentAssignedKpis=departmentAssignedKpis.filter(kpi=>kpi.category.includes(categoryNameSelected));
        return (
          <div className="enter-container">
              <Card>
                  <CardHeader>
                    <h5 style={{fontSize:'2vw'}}>Edit Department</h5>  
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
                                    filteredDepartmentNotassignedKpis.map(
                                        ({id,kpiName,type,category,standardScoreEnterDisable ,standardScore}) =>
                                        <tr key={id}>
                                        <th>{kpiName}</th>
                                        <td>{category[0]}</td>
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
                            disabled={this.state.submitButtonDisable}
                            style={{float:"right"}}>Submit
                    </button>

                      <div >  
                      <h3 style={{marginTop:'50px'}}>Allocated KPIs</h3>
                        <table className="table table-hover table-outline" >
                            <thead className="thead-light">
                                <tr>
                                <th scope="col">Name</th>
                                <th scope="col">SQDCM</th>
                                <th scope="col">Type</th>
                                <th scope="col">Last Month Target</th>
                                <th scope="col">Update Target</th>
                                </tr>
                            </thead>
                            <tbody>
                                { 
                                    filteredDepartmentAssignedKpis.map(
                                        ({kpiId,kpiName,type,category,standardScore }) =>
                                        <tr key={kpiId}>
                                        <th style={{width:'280px'}}>{kpiName}</th>
                                        <td style={{paddingLeft:'30px'}}>{category[0]}</td>
                                        <td style={{paddingLeft:'20px'}}>{type}</td>
                                        <td style={{paddingLeft:'50px'}}>{standardScore}</td>
                                        <td style={{paddingLeft:'70px'}}>
                                            <Fab name={kpiId} onClick={()=>{this.handleUpdateSScoreClick(kpiId)}} style={{width:'35px',height:'35px'}} aria-label="add" >
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
    }else{
      return (
        <h2>Unautharized</h2>
      ) 
    } 
  }
}

export default EditDepartmentComponent;
