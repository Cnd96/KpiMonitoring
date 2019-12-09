import React, { Component } from 'react';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import UsersServices from '../../../_services/users'
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import DailyKpiRecordsServices from '../../../_services/dailyKpiRecords'
import CreateIcon from '@material-ui/icons/Create';
import Fab from '@material-ui/core/Fab';

import { ToastContainer} from 'react-toastify';
import notify from '../../Toast/notification'
import 'react-toastify/dist/ReactToastify.css';
class EnterKpiScoreRoleWiseContainer extends Component {
  constructor(props){
    super(props); 
    this.state={
      roles:props.roles,
      roleKpis:[],
      date:new Date(),
      buttonDisable:true,
      plantId:'',
      selectedKpi:'',
      selectedKpiFreezeStatus:true,
      remainingKpiRecords:[],
      dailyKpiRecords:[]
    }
    this.kpiRecords=[]
  }  
  async componentDidMount(){
    if(this.props.plantId){
      this.getUserRoles()
    }
  }
  async componentDidUpdate(prevProps) {
    if (this.props.plantId !== prevProps.plantId) {
      this.getUserRoles()
    }
  }

  getUserRoles=async()=>{
    await this.setState({plantId: this.props.plantId})
    const userData=await UsersServices.getLoggedUserData();
    let userRoles=[];
    userData.roles.forEach(role=>{
      userRoles.push(role.id)
    })
    let roleKpis=await UsersServices.getUserRoleKpis(this.state.plantId,{roles:userRoles})
    this.setState({roleKpis:roleKpis}) 
  }
  render() {
    if(this.props.accessLevel==2||this.props.accessLevel==3){ 
    return (
      <div>
        <ToastContainer />
            <Card>
                <CardHeader>
                  <h5 style={{fontSize:'2vw'}}>Record KPI
                    <span style={{width:'50%',float:"right"}} > 
                    <FormControl  className="formControl" style={{width:'50%',
                          backgroundColor:'white',
                          height:'100%',border: '1px solid #ebeeec',borderRadius:'5px'
                          }}>
                        <InputLabel>KPI</InputLabel>
                            <Select
                              name='selectedKpi'
                              value={this.state.selectedKpi}
                              onChange={this.handleKpiChange}
                            >
                            <MenuItem value={''}></MenuItem>
                            { 
                              this.state.roleKpis.map(
                                ({id,kpiName}) =>
                             <MenuItem key={id} value={id}>{kpiName}</MenuItem>
                              )  
                            }
                            </Select>
                    </FormControl>
                    <input style={{width:'50%',height:'50px',float:"right"}} 
                        disabled={this.state.selectedKpi==''}
                        name='date' type='date'
                        value={this.state.date} 
                        onChange={this.handleChangeDate} 
                        className="form-control"/>
                    </span>
                  </h5>  
                </CardHeader>
                <CardBody>
                <div>
                  <h3 style={{marginTop:'10px'}}>To be record</h3>
                    <table style={{}} className="table table-hover table-outline">
                          <thead className="thead-light">
                              <tr>
                              <th scope="col">Department</th>
                              <th scope="col">SQDCM</th>
                              <th scope="col">Type</th>
                              <th scope="col">Target</th>
                              <th scope="col">Actual</th>
                              <th scope="col">Comment</th>
                              </tr>
                          </thead>
                          <tbody>
                              { 
                                  this.state.remainingKpiRecords.map(
                                      ({departmentId,departmentName,type,category,standardScore,score,comment },index) =>
                                      <tr key={index}>
                                      <th>{departmentName}</th>
                                      <td>{category[0]}</td>
                                      <td>{type}</td>
                                      <td>{standardScore}</td>
                                      <td><input  onChange={this.handleChangeScore} value={score}  
                                      id={index} className="form-control"/></td>
                                      <td><input 
                                      disabled={score==''}
                                      type='text' value={comment} onChange={this.handleChangeComment}  
                                      id={index} className="form-control"/></td>
                                      </tr>
                                  )  
                              }
                          </tbody>
                      </table>
                  </div>
                  <button className='btn btn-primary' disabled={this.state.buttonDisable}
                   onClick={this.onSubmit} style={{float:"right"}}>Submit</button>
                  <div >  
                    <h3 style={{marginTop:'50px'}}>Records</h3>
                      <table className="table table-hover table-outline" >
                          <thead className="thead-light">
                              <tr>
                              <th scope="col">Department</th>
                              <th scope="col">SQDCM</th>
                              <th scope="col">Target</th>
                              <th scope="col">Actual</th>
                              <th scope="col">Comment</th>
                              <th scope="col">Submit</th>
                              <th scope="col">Edit</th>
                              </tr>
                          </thead>
                          <tbody>
                              { 
                                  this.state.dailyKpiRecords.map(
                                      ({departmentName,departmentId,kpiId,
                                        category,standardScore,score,comment,editDisable },index) =>
                                      <tr key={index}>
                                      <th>{departmentName}</th>
                                      <td>{category[0]}</td>
                                      <td style={{paddingLeft:'50px'}}>{standardScore}</td>
                                      <td>
                                        <input 
                                        onChange={this.handleRecordedKpiChangeScore}
                                        disabled={editDisable} value={score}  
                                        id={index} className="form-control"/>
                                      </td>
                                      <td>
                                        <input type='text'
                                        onChange={this.handleRecordedKpiChangeComment}
                                         disabled={editDisable} value={comment} 
                                        id={index} className="form-control"/>
                                      </td>
                                      <td >
                                          <button 
                                           disabled={editDisable||score==''}
                                           value={index}
                                           onClick={(e)=>{this.onRecordedKpiSubmit(e,index)}}
                                           className='btn btn-primary'>Submit</button>
                                        </td>
                                      <td>
                                        <Fab name={index} 
                                         onClick={()=>{this.handleRecordedKpiEditClick(index)}}
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
    );
   }  else{
    return (
      <h2>Unautharized</h2>
    ) 
   }
  }
  
  handleRecordedKpiEditClick=async(index)=>{
    if(!this.state.selectedKpiFreezeStatus){
      const {editDisable,score,previousScore}=this.state.dailyKpiRecords[index];
    
      this.state.dailyKpiRecords[index].editDisable=!editDisable;
      if(previousScore){
        this.state.dailyKpiRecords[index].score=previousScore;
      }
      else{
        this.state.dailyKpiRecords[index].previousScore=score;
      } 
      await this.setState({dailyKpiRecords:this.state.dailyKpiRecords})  
    }
   
  }

  handleKpiChange=async(event)=>{
    const {name,value}=event.target;
    if(value){
      await this.setState({[name]: value});
      const roleKpi=this.state.roleKpis.find(kpi=>kpi.id==value)
      
      this.kpiRecords=[];
      this.setState({date: '',remainingKpiRecords:[],selectedKpiFreezeStatus:roleKpi.freeze})
    }
    
  }

  handleChangeDate=async(event)=>{
    const {value,name} =event.target;
    const differenceInDays = ((new Date()).getTime()-(new Date(value)).getTime()) / (1000 * 3600 * 24);
    if(differenceInDays<0){
      alert("Select valid date")
    }
    else if(differenceInDays>30&&this.state.selectedKpiFreezeStatus){
      alert("Expired")
    }
    else{
      await this.setState({[name]: value})
      let date=(new Date(this.state.date)).getDate();
      let month=(new Date(this.state.date)).getMonth()+1;
      let year=(new Date(this.state.date)).getFullYear();
      this.getRemainingKpiStatus(year,month,date)
    }
    
  }

  getRemainingKpiStatus=async(year,month,date)=>{
    const dailyKpiRecordStatus=await DailyKpiRecordsServices.getDailyKpiRecordStatusRoleWise(
      this.state.plantId,this.state.selectedKpi,year,month,date
    )
    dailyKpiRecordStatus.remainingKpiRecordToSend.forEach(record=>{
      record.score='';
      record.comment=''
    })
    dailyKpiRecordStatus.roleDailyKpiRecords.forEach(kpi=>{
      kpi.editDisable=true
    })
    this.setState({remainingKpiRecords:dailyKpiRecordStatus.remainingKpiRecordToSend,
      dailyKpiRecords:dailyKpiRecordStatus.roleDailyKpiRecords
    })
  }
  handleRecordedKpiChangeScore=async(event)=>{
    const {value,id}=event.target;
    if((!isNaN(value))||value==""||value=="-"){
      this.state.dailyKpiRecords[id].score=value;
      await this.setState({dailyKpiRecords:this.state.dailyKpiRecords})
    }
   
  }

  
  onRecordedKpiSubmit=async(event,index)=>{
    event.preventDefault();
    const {score,previousScore,kpiId,departmentId,date,comment}=this.state.dailyKpiRecords[index];

    const updatedRecord={
      departmentId:departmentId,
      kpiId:kpiId,
      date:date,
      score:score,
      comment:comment,
      auditComment:"Change score from "+previousScore+" to "+score,
      userId:this.props.userId
    }
    const response=await DailyKpiRecordsServices.updateDailyKpiRecordsRoleWise(updatedRecord);
    if (response.status==200){
      notify("Successfully Changed","success")
      this.resetState();
    }
    else{
      notify("Error in save","error")
    }
  }
  handleRecordedKpiChangeComment=async(event)=>{
    const {value,id}=event.target;
    this.state.dailyKpiRecords[id].comment=value;
    await this.setState({dailyKpiRecords:this.state.dailyKpiRecords})
  }



  handleChangeScore=async(event)=>{
    const {value,id}=event.target;
    
    if((!isNaN(value))||value==""||value=="-"){
      this.state.remainingKpiRecords[id].score=value;
      await this.setState({remainingKpiRecords:this.state.remainingKpiRecords})

      let recordToInsert={
        kpiId:this.state.selectedKpi,
        score:value,
        departmentId:this.state.remainingKpiRecords[id].departmentId,
        date:this.state.date,
        comment:''
      }
      const index=this.kpiRecords.findIndex(record=>
        record.departmentId == this.state.remainingKpiRecords[id].departmentId);
      
      if(index > -1){
          if(value==""){
            this.kpiRecords.splice(index, 1);
            this.state.remainingKpiRecords[id].comment=''
          }else{
            this.kpiRecords[index].score=value
          }    
      }else{
        this.kpiRecords.push(recordToInsert);
      }

      if(this.kpiRecords.length==0){
        this.setState({buttonDisable:true})
      }
      else{
        this.setState({buttonDisable:false})
      }
    }
  }
  handleChangeComment=async(event)=>{
    const {value,id}=event.target;
    this.state.remainingKpiRecords[id].comment=value;
    await this.setState({remainingKpiRecords:this.state.remainingKpiRecords})
    
    const index=this.kpiRecords.findIndex(record=>
      record.departmentId == this.state.remainingKpiRecords[id].departmentId);
     
    if (index > -1){
        this.kpiRecords[index].comment=value 
    }
    if(this.kpiRecords.length==0){
      this.setState({buttonDisable:true})
    }
    else{
      this.setState({buttonDisable:false})
    }
  }
  onSubmit=async(event)=>{
    event.preventDefault();
    console.log(this.kpiRecords)
    // const response=await DailyKpiRecordsServices.createDailyKpiRecordsRoleWise(this.kpiRecords,this.props.userId);
    // if (response.status==200){
    //   notify("Successfully Saved","success")
    //   this.resetState();
    // }
    // else{
    //   notify("Error in save","error")
    // }
  }

  resetState=()=>{
    this.setState({buttonDisable:false,
      selectedKpi:'',
      selectedKpiFreezeStatus:true,
      remainingKpiRecords:[],
      dailyKpiRecords:[],
      date:''
    })
    this.kpiRecords=[];
  }
  
}
export default EnterKpiScoreRoleWiseContainer;
