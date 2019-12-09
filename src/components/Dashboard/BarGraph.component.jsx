import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

class BarGraphComponent extends Component {
  constructor(props){
    super(props)
    this.state={
      stacked:false,
      data:{}, 
      options: {
        plugins: {
          labels: false
        },
        legend: {
          labels: {
            fontColor: "white",
            fontSize: 11
          }
        },
        // maintainAspectRatio: false,
        scales: {
               xAxes: [
                 {display: true,
                  ticks: {
                  fontColor: "#F0F8FF",
                  // fontColor: "white",
                  fontFamily:'Century Gothic',
                  fontSize: 15,},
                //   scaleLabel: {
                //     display: true,
                //     labelString: 'Department',
                //     // fontColor: '#000000',
                //     fontSize:10
                //  },
                gridLines: { color: "#606060" }
                }
                ],
               yAxes:[
                 {display: true,ticks: {
                  // fontColor: "#e1bee7",
                  fontColor: "#F0F8FF",
                  fontFamily:'Century Gothic',
                  fontSize: 14,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Percentage %',
                    // fontColor: '#e1bee7',
                    fontColor: "#F0F8FF",
                    fontFamily:'Century Gothic',
                    fontSize:10
                 },
                  gridLines: { color: "#606060" }
                }
                ],
         }
      }   
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.departmentsAchievement !== prevProps.departmentsAchievement) {
      const departmentsAchievement=this.props.departmentsAchievement
      let departmentsAchievementAsNumber= this.calculateAchievement(departmentsAchievement)
      let departmentsAchievementAsPercenTage=this.calculateAchievementAsPercentage(departmentsAchievementAsNumber)
      let barGraphData=this.populateBarGraphData(departmentsAchievementAsPercenTage)
      
      barGraphData.datasets.forEach(dataset=>{
        dataset.stack='1'
      })
      this.setState({data:barGraphData})
    }
  }
  handleViewChange=async()=>{
    this.state.stacked=!this.state.stacked;
    await this.setState({stacked:this.state.stacked})
    if(this.state.stacked){    
      await this.setState({data:{}})
      const departmentsAchievement=this.props.departmentsAchievement
      let departmentsAchievementAsNumber= this.calculateAchievement(departmentsAchievement)
      let departmentsAchievementAsPercenTage=this.calculateAchievementAsPercentage(departmentsAchievementAsNumber)
      let barGraphData=this.populateBarGraphData(departmentsAchievementAsPercenTage)
      this.setState({data:barGraphData})
    }
    else{
      await this.setState({data:{}})
      const departmentsAchievement=this.props.departmentsAchievement
      let departmentsAchievementAsNumber= this.calculateAchievement(departmentsAchievement)
      let departmentsAchievementAsPercenTage=this.calculateAchievementAsPercentage(departmentsAchievementAsNumber)
      let barGraphData=this.populateBarGraphData(departmentsAchievementAsPercenTage)
      barGraphData.datasets.forEach(dataset=>{
        dataset.stack='1'
      })
      this.setState({data:barGraphData})
    }
    
  }

  render() {
    return (
      <div >   
          <h5 style={{marginLeft:'15px',paddingTop:'5px',marginTop:'6px',fontSize:'20px',color: "#F0F8FF",}}>
            Departments Performance
            <span style={{width:'5%',float:"right"}} >
              <FormControlLabel
                  // value={id}
                  control={<Switch onChange={this.handleViewChange} checked={this.state.stacked} color="primary" />}
                  label=""
                  labelPlacement="end"
              />
            </span>
            
          </h5>
              <Bar
                onElementsClick={this.onBarGraphElementsClick}
                data={this.state.data}
                height={54}
                options={this.state.options}
              />
      </div>
    );
  }

  onBarGraphElementsClick=(e)=>{
    if(e.length>0){
      // this.props.history.push('/nervecenter/home');
      console.log(this.props)
      // console.log(e[0]._model.label)
    }
  }

  calculateAchievement=(departmentsAchievement)=>{
    let departmentsAchievementAsNumber=[];
    departmentsAchievement.forEach(department => {
      let data={
        departmentName:department.departmentName,
        departmentId:department.departmentId,
        onlyMonthAchieved:0,
        onlyYearAchieved:0,
        monthAndYearAchieved:0,
        monthAndYearNotAchieved:0
      }
      department.data.forEach(kpi=>{
        if(kpi.type=='B'){
          if(kpi.averageYearScore<=kpi.meanYearStandardScore&&kpi.averageMonthScore<=kpi.monthStandardScore){
            data.monthAndYearAchieved++;
          }
          else if(kpi.averageYearScore<=kpi.meanYearStandardScore){
            data.onlyYearAchieved++;
          }
          else if(kpi.averageMonthScore<=kpi.monthStandardScore){
            data.onlyMonthAchieved++;
          }
          else if(kpi.averageYearScore>kpi.meanYearStandardScore&&kpi.averageMonthScore>kpi.monthStandardScore){
            data.monthAndYearNotAchieved++;
          }
        }
        else if(kpi.type=='A'){
          if(kpi.averageYearScore>=kpi.meanYearStandardScore&&kpi.averageMonthScore>=kpi.monthStandardScore){
            data.monthAndYearAchieved++;
          }
          else if(kpi.averageYearScore>=kpi.meanYearStandardScore){
            data.onlyYearAchieved++;
          }
          else if(kpi.averageMonthScore>=kpi.monthStandardScore){
            data.onlyMonthAchieved++;
          }
          else if(kpi.averageYearScore<kpi.meanYearStandardScore&&kpi.averageMonthScore<kpi.monthStandardScore){
            data.monthAndYearNotAchieved++;
          }
        }
      })
      departmentsAchievementAsNumber.push(data);
    });
    return departmentsAchievementAsNumber;
  }

  calculateAchievementAsPercentage=(departmentsAchievementAsNumber)=>{
    let departmentsAchievementAsPercenTage=[]
    departmentsAchievementAsNumber.forEach(department=>{
      const totalKpis=(department.onlyMonthAchieved)+(department.onlyYearAchieved)
          +(department.monthAndYearAchieved)+(department.monthAndYearNotAchieved)
      
      department.monthAndYearAchievedPercentage=(((department.monthAndYearAchieved)/totalKpis)*100).toFixed(2);
      department.monthAndYearNotAchievedPercentage=(((department.monthAndYearNotAchieved)/totalKpis)*100).toFixed(2);
      department.onlyMonthAchievedPercentage=(((department.onlyMonthAchieved)/totalKpis)*100).toFixed(2);
      department.onlyYearAchievedPercentage=(((department.onlyYearAchieved)/totalKpis)*100).toFixed(2);
      
      const departmenScore=(department.onlyMonthAchieved*5)+(department.onlyYearAchieved*5)+(department.monthAndYearAchieved*10)
      department.departmentOverallScore=(departmenScore/(totalKpis*10))*100

      departmentsAchievementAsPercenTage.push(department)
    })
    departmentsAchievementAsPercenTage.sort(function(a, b){return b.departmentOverallScore-a.departmentOverallScore});
    return departmentsAchievementAsPercenTage
  }

  populateBarGraphData=(departmentsAchievementAsPercenTage)=>{
    let data={
      labels:[],
      datasets:[
        {
        label:'Month And Year Achieved',
        backgroundColor: '#4dbd74',
        borderColor: '#00c853',
        stack:'1',
        borderWidth: 0,
        hoverBackgroundColor: '#00c853',
        hoverBorderColor: '#4dbd74',
        data:[],
        
        },
        {
          label:'Only Year Achieved',
          backgroundColor: '#ffa000',
          borderColor: '#ff8f00',
          stack:'2',
          borderWidth: 0,
          hoverBackgroundColor: '#ff8f00',
          hoverBorderColor: '#ffa000',
          data:[]
          },
          {
            label:'Only Month Achieved',
            backgroundColor: '#ffff00',
            borderColor: '#ffeb3b',
            stack:'3',
            borderWidth: 0,
            hoverBackgroundColor: '#ffeb3b',
            hoverBorderColor: '#ffff00',
            data:[]
            },
            {
              label:'Not Achieved',
              backgroundColor: '#f86c6b',
              borderColor: '#e53935',
              stack:'4',
              borderWidth: 0,
              hoverBackgroundColor: '#e53935',
              hoverBorderColor: '#f86c6b',
              data:[]
              }
      ],
    }
    
    departmentsAchievementAsPercenTage.forEach(department=>{
      data.labels.push(department.departmentName)
      data.datasets[0].data.push(department.monthAndYearAchievedPercentage)
      data.datasets[1].data.push(department.onlyYearAchievedPercentage)
      data.datasets[2].data.push(department.onlyMonthAchievedPercentage)
      data.datasets[3].data.push(department.monthAndYearNotAchievedPercentage)
    })
    return data
  }
}
export default BarGraphComponent;
