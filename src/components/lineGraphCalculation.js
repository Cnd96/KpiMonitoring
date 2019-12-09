import DepartmentServices from '../_services/departments';

const getLineGraphData=async(kpiId,departmentId,startDate,endDate)=>{
    const dateRange={
        endDate:endDate,
        startDate:startDate
    }
    let departmentData=await DepartmentServices.getDepartmentKpiHistory(kpiId,departmentId,dateRange)
    setDepartmentKpiWeeks(departmentData.kpiRecords,departmentData.departmentKpiStandardScores);
      if(departmentData.kpiRecords.length>0){
        const data= setLineGraph(departmentData.kpiRecords,departmentData)
        return data;
      }
      else{
       return false
     }
} 

const setDepartmentKpiWeeks=(departmentKpiRecords,standardScoreDatas)=>{
    departmentKpiRecords.forEach(record => {
      const recordMonth=(new Date(record.date)).getMonth()+1;
      const recordYear=(new Date(record.date)).getFullYear();
      
      standardScoreDatas.forEach(standardScoreData=>{
      if(standardScoreData.year==recordYear&&standardScoreData.month==recordMonth){
        record.standardScore=standardScoreData.standardScore;
        return;
      }
      })
      record.week=getWeek(record.date)
    });
}
    
const getWeek=(recordDate)=>{
    let date = new Date(recordDate);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        
    let week1 = new Date(date.getFullYear(), 0, 4);
        
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                    - 3 + (week1.getDay() + 6) % 7) / 7);
}

const setLineGraph=(departmentKpiRecords,departmentData)=>{
        let data = {
        weekOrMonth:'',
        labels: [],
        datasets: [
            {
            label: 'Actual Score',
            fill: false,
            lineTension: 0.1,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: []
            },
            {
            label: 'Target Score',
            fill: false,
            lineTension: 0.1,
            borderColor: '#ef9a9a',
            backgroundColor: '#e53935',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#ef9a9a',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor:'#ef9a9a',
            pointHoverBorderColor: '#ff4444',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: []
            }
        ]
        };
        let options= {
          legend: {
            labels: {
              fontColor: "white",
              fontSize: 11
           }
          },
          scales: {
              xAxes: [
                  {
                  display: true,
                  ticks: {
                    fontColor: "#F0F8FF",
                    fontSize: 14,},
                    scaleLabel: {
                      display: true,
                      labelString: '',
                      fontColor: "#F0F8FF",
                      fontFamily:'Century Gothic',
                      fontSize:18
                   },
                }
              ],
              yAxes: [
                { display: true,
                  ticks: {
                    fontColor: "#F0F8FF",
                    fontSize: 14},
                    scaleLabel: {
                       display: true,
                       labelString: 'Score',
                       fontColor: "#F0F8FF",
                       fontSize:18
                    },
                  }
              ],
          }
        }  
        const firstRecord=departmentKpiRecords[0];
        const lastRecord=departmentKpiRecords[departmentKpiRecords.length-1]
        const startMonth=(new Date(firstRecord.date)).getMonth()+1;
        const lastMonth=(new Date(lastRecord.date)).getMonth()+1;
       
        let totalMonths;
        if(new Date(firstRecord.date).getFullYear()==new Date(lastRecord.date).getFullYear()){
            totalMonths=(lastMonth+1)-startMonth
        }
        else{
           totalMonths=lastMonth+(13-startMonth)
        }
        if(departmentKpiRecords.length<=totalMonths){
          data.labels.push(new Date(firstRecord.date).getFullYear()+'-'+months[new Date(firstRecord.date).getMonth()+1]);
          data.datasets[0].data.push(firstRecord.score);
          data.datasets[1].data.push(firstRecord.standardScore)
          for(let i=1;i<departmentKpiRecords.length;i++){
          if(departmentKpiRecords[i].week==1){
              data.labels.push(new Date(departmentKpiRecords[i].date).getFullYear()+'-'+months[new Date(departmentKpiRecords[i].date).getMonth()+1])
          }
          else{
              data.labels.push(months[new Date(departmentKpiRecords[i].date).getMonth()+1])
          }
          data.datasets[0].data.push(departmentKpiRecords[i].score);
          data.datasets[1].data.push(departmentKpiRecords[i].standardScore)
          }
          options.scales.xAxes[0].scaleLabel.labelString='Month'
        }
        else{
          // data.labels.push(new Date(firstRecord.date).getFullYear()+'-'+shortMonths[new Date(firstRecord.date).getMonth()+1]+'-'+firstRecord.week);
          data.labels.push(new Date(firstRecord.date).getFullYear()+'-'+firstRecord.week);
          data.datasets[0].data.push(firstRecord.score);
          data.datasets[1].data.push(firstRecord.standardScore)
          for(let i=1;i<departmentKpiRecords.length;i++){
            if(departmentKpiRecords[i].week==1){
                data.labels.push(new Date(departmentKpiRecords[i].date).getFullYear()+'-'+departmentKpiRecords[i].week)
                // data.labels.push(new Date(departmentKpiRecords[i].date).getFullYear()+'-'+shortMonths[new Date(departmentKpiRecords[i].date).getMonth()+1]+'-'+departmentKpiRecords[i].week)
            }
            else{
                // data.labels.push(shortMonths[new Date(departmentKpiRecords[i].date).getMonth()+1]+ '-'+departmentKpiRecords[i].week)
                data.labels.push(departmentKpiRecords[i].week)
            }
            data.datasets[0].data.push(departmentKpiRecords[i].score);
            data.datasets[1].data.push(departmentKpiRecords[i].standardScore)
          }
          options.scales.xAxes[0].scaleLabel.labelString='Week Number'
        }
        
        options.scales.yAxes[0].scaleLabel.labelString=departmentKpiRecords[0].measuringUnit
        return {
          departmentKpiRecords:departmentKpiRecords,
          data:data,
          options:options,
          departmentName:departmentData.kpiRecords[0].departmentName,
          kpiName:departmentData.kpiRecords[0].kpiName
        };
        
}
 
const months=[ "0","January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December" ];
const shortMonths=[ "0","Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];


export default getLineGraphData
 
  
