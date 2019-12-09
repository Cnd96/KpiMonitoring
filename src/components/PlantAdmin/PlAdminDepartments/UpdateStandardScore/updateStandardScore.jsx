import React, { Component } from 'react';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import './updateStandardScore.scss'
import DepartmentKpisServices from '../../../../_services/departmentKpis'

class UpdateDepartmentKpiContainer extends Component {
  constructor(props){
    super(props); 
    this.state={
      currentYear:(new Date()).getFullYear(),
      departmentId:'',
      department:'',
      kpiId:'',
      kpiName:'',
      kpiStandardScoresData:[]
    }
    this.months=[ "0","January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December" ];
  }  

  async componentDidMount(){

    await this.setState({department:this.props.match.params.departmentName,
        departmentId:this.props.match.params.departmentId,
        kpiId:this.props.match.params.kpiId,
    })
    const kpiStandardScoresData=await DepartmentKpisServices.getYearKpiStandardScores(this.state.departmentId,this.state.kpiId)
    this.setState({kpiStandardScoresData:kpiStandardScoresData,
        kpiName:kpiStandardScoresData[0].kpi})
  }

  standardScoreChange=(event)=>{
    const { value, name } = event.target;
    if(value<0){
      this.state.kpiStandardScoresData[name].standardScore=0;
    }
    else{
      this.state.kpiStandardScoresData[name].standardScore=value;
    }
    this.setState({kpiStandardScoresData:this.state.kpiStandardScoresData})
  }
  standardScoreOnLeave=(event)=>{
    const { value, name } = event.target;
    if(value==''){
      this.state.kpiStandardScoresData[name].standardScore=0;
      this.setState({kpiStandardScoresData:this.state.kpiStandardScoresData})
    }
  }

  onUpdateButtonClick=async(kpiId,index)=>{
    // console.log(this.state.kpiStandardScoresData[index])
    const response=await DepartmentKpisServices.updateMonthlyStandardScore(this.state.kpiStandardScoresData[index])
    if (response.status==200){
      alert("Successfully saved"); 
      // this.props.history.push('/home/plantadmin/departments');
      const kpiStandardScoresData=await DepartmentKpisServices.getYearKpiStandardScores(this.state.departmentId,this.state.kpiId)
      this.setState({kpiStandardScoresData:kpiStandardScoresData,
        kpiName:kpiStandardScoresData[0].kpi})
    }
    else{
      alert("Failed"); 
    }
  }

  onUpdateAllDepButtonClick=async(kpiId,index)=>{
    const response=await DepartmentKpisServices.updateMonthlyStandardScoreAllDepartments(
        this.state.kpiStandardScoresData[index],this.props.plantId)
    if (response.status==200){
      alert("Successfully saved"); 
      this.props.history.push('/nervecenter/home/plantadmin/departments');
    }
    else{
      alert("Failed"); 
    }
  }

  render() {
    if(this.props.accessLevel==3){
      return (
            <div className="enter-container">
              <Card>
                  <CardHeader>
                    <h5 style={{fontSize:'2vw'}}>Update Monthly KPI Target-{this.state.department}</h5>  
                  </CardHeader>
                  <CardBody>
                    <div>
                      <h5 style={{marginBottom:'30px',fontSize:'1.7vw'}}>{this.state.kpiName}-{this.state.currentYear}</h5>
                      {
                        this.state.kpiStandardScoresData.map(
                          ({kpiId,month,standardScore },index) =>
                          <div key={index} >
                            <span  style={{display:'inline-block'}}>
                               <label className="monthLabel">{this.months[month]}</label> 
                              <input value={standardScore}
                                     type="number"
                                     id={kpiId}
                                     name={index}
                                     value={standardScore}
                                     onBlur={this.standardScoreOnLeave}
                                     onChange={this.standardScoreChange}
                              />
                            <button 
                              onClick={()=>{this.onUpdateButtonClick(kpiId,index)}}
                              style={{marginLeft:'10px'}} className='btn btn-primary'>Update</button>
                            <button 
                              onClick={()=>{this.onUpdateAllDepButtonClick(kpiId,index)}}
                              style={{marginLeft:'10px'}} className='btn btn-danger'>Update in All Departments</button>
                            </span>
                            
                          </div>
                       ) 
                      }
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
export default UpdateDepartmentKpiContainer;
