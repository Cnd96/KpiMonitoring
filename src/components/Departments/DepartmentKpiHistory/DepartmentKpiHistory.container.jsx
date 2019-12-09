import React, { Component } from 'react';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import StatsServices from '../../../_services/stats'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notify from '../../Toast/notification'
import DateFnsUtils from '@date-io/date-fns';
import lineGraphCalculation from '../../lineGraphCalculation';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {Line} from 'react-chartjs-2';
import './departmentKpiLabel.styles.scss'

class DepartmentKpiHistoryContainer extends Component {
  constructor(props){
    super(props); 
    this.state={
      departmentId:this.props.match.params.departmentId,
      kpiId:this.props.match.params.kpiId,
      lineGraphData:{},
      endDate:new Date(),
      startDate:new Date((new Date()).getFullYear()-1,(new Date()).getMonth(),(new Date()).getDate()),
      departmentName:'',
      kpiScoreData:[],
      kpiName:'',
      kpiData:{},
      departmentKpiData:{},
      options:{}
    }
  }  
  async componentDidMount(){
   const {kpiId,departmentId}=this.state
   this.drawLineGraph(this.state.startDate,this.state.endDate)
   const departmentKpiAchievement=await StatsServices.getDepartmentKpiAcheivement(departmentId,kpiId)
   this.divideDepartmentKpiAchievement(departmentKpiAchievement)
  }

  divideDepartmentKpiAchievement=(kpi)=>{
          if(kpi.type=='B'){
            if(kpi.averageYearScore<=kpi.meanYearStandardScore&&kpi.averageMonthScore<=kpi.monthStandardScore){
              kpi.achievementClass='bothAchievedKpiLabel'
            }
            else if(kpi.averageYearScore<=kpi.meanYearStandardScore){
              kpi.achievementClass='yearOnlyAchievedKpiLabel'
            }
            else if(kpi.averageMonthScore<=kpi.monthStandardScore){
              kpi.achievementClass='monthOnlyAchievedKpiLabel'
            }
            else if(kpi.averageYearScore>kpi.meanYearStandardScore&&kpi.averageMonthScore>kpi.monthStandardScore){
              kpi.achievementClass='bothNotAchievedKpiLabel'
            }
          }
          else if(kpi.type=='A'){
            if(kpi.averageYearScore>=kpi.meanYearStandardScore&&kpi.averageMonthScore>=kpi.monthStandardScore){
              kpi.achievementClass='bothAchievedKpiLabel'
            }
            else if(kpi.averageYearScore>=kpi.meanYearStandardScore){
              kpi.achievementClass='yearOnlyAchievedKpiLabel'
            }
            else if(kpi.averageMonthScore>=kpi.monthStandardScore){
              kpi.achievementClass='monthOnlyAchievedKpiLabel'
            }
            else if(kpi.averageYearScore<kpi.meanYearStandardScore&&kpi.averageMonthScore<kpi.monthStandardScore){
              kpi.achievementClass='bothNotAchievedKpiLabel'
            }
          }
          kpi.averageMonthScore=Math.round(kpi.averageMonthScore * 100) / 100
          kpi.averageYearScore=Math.round(kpi.averageYearScore * 100) / 100
          this.setState({kpiData:kpi})
  }
  drawLineGraph=async(startDate,endDate)=>{
    const dateRange={
      endDate:endDate,
      startDate:startDate
    }
    const lineGraphData=await lineGraphCalculation(this.state.kpiId,this.state.departmentId,
      startDate,endDate)
      if(!lineGraphData){
        notify("No Records","info")
        this.setState({lineGraphData:{},kpiScoreData:[]})
      }
      else{
        const {options,kpiName,departmentName,data}=lineGraphData;

        options.scales.xAxes[0].scaleLabel.fontColor="black";
        options.scales.yAxes[0].scaleLabel.fontColor="black";
        options.scales.xAxes[0].ticks.fontColor="black";
        options.scales.yAxes[0].ticks.fontColor="black";
        options.legend.labels.fontColor="black"
        
        this.setState({lineGraphData:data,options:options,
          departmentName:departmentName,kpiName:kpiName,kpiScoreData:lineGraphData.departmentKpiRecords})
      }
  }
  handleStartDateChange=async(date)=>{
 
    if((this.state.endDate.getTime() < (date.getTime()))){
      notify("Select validate date","warn")
    }
    else{
      await this.setState({startDate: date})
      this.drawLineGraph(this.state.startDate,this.state.endDate);
    }
  }
  handleEndDateChange=async(date)=>{
    if((this.state.startDate > (date.getTime()))){
      notify("Select validate date","warn")
    }
    else{
      await this.setState({endDate: date})
      this.drawLineGraph(this.state.startDate,this.state.endDate);
    }
  }
  render() { 
    if(this.props.accessLevel==2||3){
    return (
      <div >
        <ToastContainer />
            <Card>
                <CardHeader className={this.state.kpiData.achievementClass}>
                  <h5 style={{fontSize:'2vw'}}>{this.state.departmentName}-{this.state.kpiName}
                  <span style={{width:'55%',float:"right"}} > 
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            style={{marginLeft:'10px'}}
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            // margin="normal"
                            id="startDate"
                            label="Start Date"
                            name="startDate"
                            value={this.state.startDate}
                            onChange={this.handleStartDateChange}
                          />
                      </MuiPickersUtilsProvider>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            style={{marginLeft:'10px'}}
                            // margin="normal"
                            id="endDate"
                            label="End Date"
                            name="endDate"
                            value={this.state.endDate}
                            onChange={this.handleEndDateChange}
                            
                          />
                      </MuiPickersUtilsProvider>     
                    </span>
                    </h5> 
                </CardHeader>
                <CardBody>
                  <div>
                    <Line 
                     data={this.state.lineGraphData} 
                     height={100}
                     options={this.state.options}
                     />
                  </div>  
                  <div style={{marginTop:'2vw'}}> 
                    <h6 style={{display:'inline-block',fontSize:'1.3vw'}}>Month Target:{this.state.kpiData.monthStandardScore}</h6>
                    <h6 style={{display:'inline-block', marginLeft:'1.5vw',fontSize:'1.3vw'}}>Month Actual:{this.state.kpiData.averageMonthScore}</h6>
                    <h6 style={{display:'inline-block', marginLeft:'1.5vw',fontSize:'1.3vw'}}>Year Target:{this.state.kpiData.meanYearStandardScore}</h6>
                    <h6 style={{display:'inline-block', marginLeft:'1.5vw',fontSize:'1.3vw'}}>Year Actual:{this.state.kpiData.averageYearScore}</h6>
                    <h6 style={{display:'inline-block', marginLeft:'1.5vw',fontSize:'1.3vw'}}>Type:{this.state.kpiData.type}</h6>
                  </div>  
                  <table style={{marginTop:'2vw'}} className="table table-hover table-outline">
                          <thead className="thead-light">
                              <tr>
                              <th scope="col">Date</th>
                              <th scope="col">Week Number</th>
                              <th scope="col">Target</th>
                              <th scope="col">Actual</th>
                              </tr>
                          </thead>
                          <tbody>
                              { 
                                  this.state.kpiScoreData.map(
                                      ({week,date,standardScore,score },index) =>
                                      <tr key={index}>
                                      <td>{new Date(date).toDateString()}</td>
                                      <td>{week}</td>
                                      <td>{standardScore}</td>
                                      <td>{score}</td>
                                      </tr>
                                  )  
                              }
                          </tbody>
                      </table>                        
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
export default DepartmentKpiHistoryContainer;
