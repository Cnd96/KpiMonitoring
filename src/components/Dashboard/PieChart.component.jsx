import React, { Component } from 'react';
import {Pie} from 'react-chartjs-2';
import "chartjs-plugin-labels";
class PieChartComponent extends Component {
  constructor(props){
    super(props)
    this.state={
      data:{},
      options: {
        plugins: {
          labels: {
            fontColor:"black"
          }
        },
        legend: {
          labels: {
            fontColor: "white",
            fontSize: 10
        }
       },
     }  
    }
  }
  async componentDidMount(){    
  }

  componentDidUpdate(prevProps) {
    if (this.props.departmentsAchievement !== prevProps.departmentsAchievement) {
      const departmentsAchievement=this.props.departmentsAchievement
      const plantAchievement= this.calculatePlantAchievement(departmentsAchievement)
      const plantAchievementAsPercentage=this.calculatePlantAchievementAsPercentage(plantAchievement)
      const pieChartData=this.populatePieChartData(plantAchievementAsPercentage)
      this.setState({data:pieChartData})
    }
  }
  render() {
    if(window.innerHeight>640){
      return (
        <div >
            <h5 style={{marginLeft:'15px',paddingTop:'3px',fontSize:'20px',color: "#F0F8FF"}}> Plant Performance</h5>
          <Pie 
              height={180}
              options={this.state.options}
              data={this.state.data} />
        </div>
      );
    }else{
      return (
        <div >
            <h5 style={{marginLeft:'15px',paddingTop:'3px',fontSize:'20px',color: "#F0F8FF"}}> Plant Performance</h5>
          <Pie 
              // width={120}
              height={170}
              options={this.state.options}
              data={this.state.data} />
        </div>
      );
    }

  }

  calculatePlantAchievement=(departmentsAchievement)=>{
    let plantAchievement={
        onlyMonthAchieved:0,
        onlyYearAchieved:0,
        monthAndYearAchieved:0,
        monthAndYearNotAchieved:0
    };
    departmentsAchievement.forEach(department => {
      department.data.forEach(kpi=>{
        if(kpi.type=='B'){
          if(kpi.averageYearScore<=kpi.meanYearStandardScore&&kpi.averageMonthScore<=kpi.monthStandardScore){
            plantAchievement.monthAndYearAchieved++;
          }
          else if(kpi.averageYearScore<=kpi.meanYearStandardScore){
            plantAchievement.onlyYearAchieved++;
          }
          else if(kpi.averageMonthScore<=kpi.monthStandardScore){
            plantAchievement.onlyMonthAchieved++;
          }
          else if(kpi.averageYearScore>kpi.meanYearStandardScore&&kpi.averageMonthScore>kpi.monthStandardScore){
            plantAchievement.monthAndYearNotAchieved++;
          }
        }
        else if(kpi.type=='A'){
          if(kpi.averageYearScore>=kpi.meanYearStandardScore&&kpi.averageMonthScore>=kpi.monthStandardScore){
            plantAchievement.monthAndYearAchieved++;
          }
          else if(kpi.averageYearScore>=kpi.meanYearStandardScore){
            plantAchievement.onlyYearAchieved++;
          }
          else if(kpi.averageMonthScore>=kpi.monthStandardScore){
            plantAchievement.onlyMonthAchieved++;
          }
          else if(kpi.averageYearScore<kpi.meanYearStandardScore&&kpi.averageMonthScore<kpi.monthStandardScore){
            plantAchievement.monthAndYearNotAchieved++;
          }
        }
      })
    });
    return plantAchievement;
  }

  calculatePlantAchievementAsPercentage=(plantAchievement)=>{
    const totalKpis=plantAchievement.monthAndYearNotAchieved+plantAchievement.onlyMonthAchieved+
            plantAchievement.onlyYearAchieved+plantAchievement.monthAndYearAchieved
    
    let plantAchievementAsPercentage={
        onlyMonthAchieved:((plantAchievement.onlyMonthAchieved/totalKpis)*100).toFixed(2),
        onlyYearAchieved:((plantAchievement.onlyYearAchieved/totalKpis)*100).toFixed(2),
        monthAndYearAchieved:((plantAchievement.monthAndYearAchieved/totalKpis)*100).toFixed(2),
        monthAndYearNotAchieved:((plantAchievement.monthAndYearNotAchieved/totalKpis)*100).toFixed(2),
    }
    return plantAchievementAsPercentage
  }

  populatePieChartData=(plantAchievementAsPercentage)=>{
  
    let data={
      labels:['Only Year','Only Month','Both Achieved','Both Not Achieved'],
      datasets:[{
        data: [
            plantAchievementAsPercentage.onlyYearAchieved,
            plantAchievementAsPercentage.onlyMonthAchieved,
            plantAchievementAsPercentage.monthAndYearAchieved,
            plantAchievementAsPercentage.monthAndYearNotAchieved],
        backgroundColor: ['#FFBF00','#ffff00','#4dbd74','#f86c6b'],
      }],
    }
   return data
  }
}
export default PieChartComponent;
