import React, { Component } from 'react';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import DepartmentServices from '../../_services/departments'
import UsersServices from '../../_services/users'

class KpiScoreRecordHistoryContainer extends Component {
  constructor(props){
    super(props); 
    this.state={
      departmentKpiRecordAudit:[],
      selectedMonth:(new Date()).getMonth()+1,
      selectedYear:(new Date()).getFullYear(),
      departmentName:'',
      plantId:'',
      departments:[],
      selectedDepartmentId:'',
      selectedKpi:'',
      remainingKpiRecords:[],
      departmentAssignedKpis:[]
    }
  }  
  async componentDidMount(){
    if(this.props.plantId){
      this.getDepartmentsData()
    }
  }
  async componentDidUpdate(prevProps) {
    if (this.props.plantId !== prevProps.plantId) {
      this.getDepartmentsData()
    }
  }

  getDepartmentsData=async()=>{
    const userData=await UsersServices.getLoggedUserData();
    if(userData.departments.length>0){
      await this.setState({plantId:this.props.plantId,departments:userData.departments})
      this.state.selectedDepartmentId=this.state.departments[0].id
      this.getSelectedDepartmentData() 
    }
  }

  getSelectedDepartmentData=async()=>{
    const departmentData=await DepartmentServices.getDepartmentStatus(this.props.plantId,this.state.selectedDepartmentId)
    if(departmentData.department){
      await this.setState({
        departmentAssignedKpis:departmentData.assignedKpis, 
        selectedKpi:departmentData.assignedKpis[0].kpiId
      })
      this.getKpiRecordAudit()
    }
  }

  getKpiRecordAudit=async()=>{
    const {selectedKpi,selectedYear,selectedMonth,selectedDepartmentId}=this.state;
    const departmentKpiRecordAudit=await DepartmentServices.getDepartmentKpiRecordAudit(selectedKpi,selectedDepartmentId,selectedMonth,selectedYear)
    this.setState({departmentKpiRecordAudit:departmentKpiRecordAudit})
  }
  handleKpiChange=async(event)=>{
    const {name,value}=event.target;
    await this.setState({[name]: value});
    this.getKpiRecordAudit()
  }
  handleDepartmentChange=async(event)=>{
    const {name,value}=event.target;
    await this.setState({[name]: value});
    this.getSelectedDepartmentData()
  }

  handleMonthChange=async(event)=>{
    const {value,name} =event.target;
    await this.setState({[name]: value});
    this.getKpiRecordAudit()
  }
  handleYearChange=async(event)=>{
    const {value,name} =event.target;
    await this.setState({[name]: value});
    this.getKpiRecordAudit()
  }

  render() {
    if(this.props.accessLevel==2||this.props.accessLevel==3){
    return (
      <div className="enter-container">
            <Card>
                <CardHeader>
                  <h5 style={{fontSize:'2vw'}}>Department Audit
                    <span style={{width:'75%',float:"right"}} > 
                    <FormControl  className="formControl" style={{width:'30%',
                          backgroundColor:'white',
                          height:'100%',border: '1px solid #ebeeec',borderRadius:'5px'
                          }}>
                        <InputLabel>Department</InputLabel>
                            <Select
                              name='selectedDepartmentId'
                              value={this.state.selectedDepartmentId}
                              onChange={this.handleDepartmentChange}
                            >
                            { 
                              this.state.departments.map(
                                ({id,departmentName}) =>
                             <MenuItem key={id} value={id}>{departmentName}</MenuItem>
                              )  
                            }
                            </Select>
                    </FormControl>
                    <FormControl  className="formControl" style={{width:'30%',
                          backgroundColor:'white',
                          height:'100%',border: '1px solid #ebeeec',borderRadius:'5px'
                          }}>
                        <InputLabel>KPI</InputLabel>
                            <Select
                              name='selectedKpi'
                              value={this.state.selectedKpi}
                              onChange={this.handleKpiChange}
                            >
                            { 
                              this.state.departmentAssignedKpis.map(
                                ({kpiId,kpiName}) =>
                             <MenuItem key={kpiId} value={kpiId}>{kpiName}</MenuItem>
                              )  
                            }
                            </Select>
                    </FormControl>
                    <FormControl  className="formControl" style={{width:'20%',
                          backgroundColor:'white',
                          height:'100%',border: '1px solid #ebeeec',borderRadius:'5px'
                          }}>
                        <InputLabel>Year</InputLabel>
                            <Select
                              name='selectedYear'
                              value={this.state.selectedYear}
                              onChange={this.handleYearChange}
                            >
                            <MenuItem value={'2018'}>2018</MenuItem>
                            <MenuItem value={'2019'}>2019</MenuItem>
                            <MenuItem value={'2020'}>2020</MenuItem>
                            <MenuItem value={'2021'}>2021</MenuItem>
                            <MenuItem value={'2022'}>2022</MenuItem>
                            </Select>
                    </FormControl><FormControl  className="formControl" style={{width:'20%',
                          backgroundColor:'white',
                          height:'100%',border: '1px solid #ebeeec',borderRadius:'5px'
                          }}>
                        <InputLabel>Month</InputLabel>
                            <Select
                              name='selectedMonth'
                              value={this.state.selectedMonth}
                              onChange={this.handleMonthChange}
                            >
                            <MenuItem value={'1'}>January</MenuItem>
                            <MenuItem value={'2'}>February</MenuItem>
                            <MenuItem value={'3'}>March</MenuItem>
                            <MenuItem value={'4'}>April</MenuItem>
                            <MenuItem value={'5'}>May</MenuItem>
                            <MenuItem value={'6'}>June</MenuItem>
                            <MenuItem value={'7'}>July</MenuItem>
                            <MenuItem value={'8'}>August</MenuItem>
                            <MenuItem value={'9'}>September</MenuItem>
                            <MenuItem value={'10'}>October</MenuItem>
                            <MenuItem value={'11'}>November</MenuItem>
                            <MenuItem value={'12'}>December</MenuItem>
                            </Select>
                    </FormControl>
                    </span>
                  </h5>  
                </CardHeader>
                <CardBody>
                <div>
                    <table className="table table-hover table-outline">
                          <thead className="thead-light">
                              <tr>     
                              <th scope="col">Score</th>
                              <th scope="col">Date</th>
                              <th scope="col">Recorded By</th>
                              <th scope="col">Recorded Date</th>
                              <th scope="col">Comment</th>
                              </tr>
                          </thead>
                          <tbody>
                              { 
                                  this.state.departmentKpiRecordAudit.map(
                                      ({date,createdAt,id,user,score,comment }) =>
                                      <tr key={id}>
                                      <td>{score}</td>
                                      <td>{(new Date(date)).toDateString()}</td>
                                      <td>{user.userName}</td>
                                      <td>{(new Date(createdAt)).toDateString()}</td>
                                      <td>{comment}</td>                                     
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
export default KpiScoreRecordHistoryContainer;
