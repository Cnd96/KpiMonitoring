import React, { Component } from 'react';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import {Line} from 'react-chartjs-2';
import DailyKpiRecordsServices from '../../../_services/dailyKpiRecords'
class EnterContainer extends Component {

  constructor(props){
    super(props); 
    this.state={
      remainingKpis:[],
      dailyKpiRecords:[],
      date:new Date(),
      buttonDisable:true,
      
    }
    this.kpiRecords=[]
  }  
  componentDidMount(){
    let date=(new Date()).getDate();
    let month=(new Date()).getMonth()+1;
    let year=(new Date()).getFullYear();
    this.getRemainingKpi(year,month,date)
  }

  getRemainingKpi=async(year,month,date)=>{
    const dailyKpiRecordStatus=await DailyKpiRecordsServices.getDailyKpiRecordStatus(
      this.props.departmentId,year,month,date)
    await this.setState({remainingKpis:dailyKpiRecordStatus.remainingKpiRecordToSend,
      dailyKpiRecords:dailyKpiRecordStatus.kpiRecord})
  }

  onChangeRecord=(event)=>{
      const {value,id}=event.target;
      let recordToInsert={
        kpiId:id,
        score:value,
        departmentId:this.props.departmentId,
        date:this.state.date
      }
      const index=this.kpiRecords.findIndex(record=> record.kpiId == id);
     
      if (index > -1){
          if(value==""){
            this.kpiRecords.splice(index, 1);
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

  onSubmit=(event)=>{
    event.preventDefault();
      fetch(this.props.baseUrl+"dailyKpiRecords/bulkCreate", {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(this.kpiRecords)
      })
      .then(response=>{ 
        if (response.status==200){
          alert("Successfully saved"); 
          this.props.history.push('/nervecenter/home/dashboard');
        }
        else{
          console.log(response.status)
          alert("Failed"); 
        }
      })
  }

  onDateSelect=async(event)=>{
    const {value,name} =event.target;
    if((new Date()).getTime() < (new Date(value)).getTime()){
      alert("Select valid date")
    }
    else{
      await this.setState({[name]: value})
      let date=(new Date(this.state.date)).getDate();
      let month=(new Date(this.state.date)).getMonth()+1;
      let year=(new Date(this.state.date)).getFullYear();
      this.getRemainingKpi(year,month,date)
    }
  }
  render() {
    if(this.props.accessLevel==2||3){
    return (
      <div className="enter-container">
            <Card>
                <CardHeader>
                  <h2>Record KPI
                    <span style={{width:'30%',float:"right"}} > 
                      {/* {this.state.date} */}
                    <input style={{width:'70%',float:"right"}} 
                        name='date' type='date' 
                        value={this.state.date} 
                        onChange={this.onDateSelect}
                         className="form-control"/>
                    </span>
                  </h2>  
                </CardHeader>
                <CardBody>
                  <div>
                    <table style={{}} className="table table-hover table-outline">
                          <thead className="thead-light">
                              <tr>
                              <th scope="col">Name</th>
                              <th scope="col">SQDCM</th>
                              <th scope="col">Type</th>
                              <th scope="col">Target</th>
                              <th scope="col">Actual</th>
                              </tr>
                          </thead>
                          <tbody>
                              { 
                                  this.state.remainingKpis.map(
                                      ({kpiId,kpiName,type,category,standardScore }) =>
                                      <tr key={kpiId}>
                                      <th>{kpiName}</th>
                                      <td>{category}</td>
                                      <td>{type}</td>
                                      <td>{standardScore}</td>
                                      <td><input type='number' onChange={this.onChangeRecord} id={kpiId} className="form-control"/></td>
                                      </tr>
                                  )  
                              }
                          </tbody>
                      </table>
                  </div>
                    
                    <button className='btn btn-primary' disabled={this.state.buttonDisable} onClick={this.onSubmit} style={{float:"right"}}>Submit</button>
        
                    <div >  
                    <h3 style={{marginTop:'50px'}}>Recorded KPIs</h3>
                      <table className="table table-hover table-outline" >
                          <thead className="thead-light">
                              <tr>
                              <th scope="col">Name</th>
                              <th scope="col">SQDCM</th>
                              <th scope="col">Type</th>
                              <th scope="col">Target</th>
                              <th scope="col">Actual</th>
                              </tr>
                          </thead>
                          <tbody>
                              { 
                                  this.state.dailyKpiRecords.map(
                                      ({kpiId,kpiName,type,category,standardScore,score }) =>
                                      <tr key={kpiId}>
                                      <th>{kpiName}</th>
                                      <td>{category}</td>
                                      <td>{type}</td>
                                      <td>{standardScore}</td>
                                      <td>{score}</td>
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
export default EnterContainer;
