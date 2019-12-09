import React, { Component } from 'react';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import DepartmentServices from '../../../_services/departments'
import PlantServices from '../../../_services/plant'

class PlAdminViewRecordStatusContainer extends Component {
  constructor(props){
    super(props); 
    this.state={
      departmentMonthRecordAudit:[],
      selectedMonth:(new Date()).getMonth()+1,
      selectedYear:(new Date()).getFullYear(),
      departmentName:'',
      plantId:'',
      departments:[],
      departmentsInPlant:[],
      selectedDepartmentId:'',
    }
  }  
  componentDidMount=async()=>{
    if(this.props.plantId){
     this.getDepartmentsInPlant()
    }
  }
  async componentDidUpdate(prevProps) {
    if (this.props.plantId !== prevProps.plantId) {
      this.getDepartmentsInPlant()
    }
  }
  getDepartmentsInPlant=async()=>{
    const plantDetails=await PlantServices.getDepartmentsInPlant(this.props.plantId)
    if(plantDetails.departments.length>0){
      await this.setState({departmentsInPlant:plantDetails.departments,
        selectedDepartmentId:plantDetails.departments[0].id})
      this.getKpiRecordAudit()
    }  
  }

  getKpiRecordAudit=async()=>{
    const {selectedYear,selectedMonth,selectedDepartmentId}=this.state;
    
    const departmentMonthRecordAudit=await DepartmentServices.getDepartmentMonthlyRecordsStatus(selectedDepartmentId
      ,selectedYear,selectedMonth)
    this.setState({departmentMonthRecordAudit:departmentMonthRecordAudit})
  }
  handleDepartmentChange=async(event)=>{
    const {name,value}=event.target;
    await this.setState({[name]: value});
    this.getKpiRecordAudit()
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
    if(this.props.accessLevel==2||3){
    return (
      <div className="enter-container">
            <Card>
                <CardHeader>
                  <h5 style={{fontSize:'2vw'}}>Record History
                    <span style={{width:'50%',float:"right"}} > 
                    <FormControl  className="formControl" style={{width:'50%',
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
                              this.state.departmentsInPlant.map(
                                ({id,departmentName}) =>
                             <MenuItem key={id} value={id}>{departmentName}</MenuItem>
                              )  
                            }
                            </Select>
                    </FormControl>
                   
                    <FormControl  className="formControl" style={{width:'25%',
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
                    </FormControl><FormControl  className="formControl" style={{width:'25%',
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
                              <th scope="col">KPI</th>
                              <th scope="col">Target</th>
                              <th scope="col">No Of Records in Month</th>
                              {/* <th scope="col">Recorded Date</th>
                              <th scope="col">Comment</th> */}
                              </tr>
                          </thead>
                          <tbody>
                              { 
                                  this.state.departmentMonthRecordAudit.map(
                                      ({kpiName,kpiId,monthRecords,standardScore }) =>
                                      <tr key={kpiId}>
                                      <td>{kpiName}</td>
                                      <td>{standardScore}</td>
                                      <td>{monthRecords.length}</td>                            
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
export default PlAdminViewRecordStatusContainer;
