import React, { Component } from 'react';
import BarGraphComponent from './BarGraph.component'
import LineGraphComponent from './LineGraphContainer'
import PieChartComponent from './PieChart.component'
import Grid from '@material-ui/core/Grid';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import StatsServices from '../../_services/stats'
import AuthServices from '../../_services/auth'
import './dashboard.styles.scss'
import icon from '../../assets/N-Icon.png'
class DashboardContainer extends Component {

  constructor(props){
    super(props)
    this.state={
      departmentsAchievement:[],
      plantCriticalKpiList:[],
      selectedDepartmentId:'',
      selectedKpiId:'',
      accessLevel:'',
      selectedDepartmentName:'',
      selectedKpiName:'',
      criticalKpiSectionHeight:'20.9vw',
    };
    this.isKpiClicked=false;
    this.displayingKpiIndex=0
  }
  async componentDidMount(){
    const userData=await AuthServices.getUserData();
    this.setState({accessLevel:userData.accessLevel})
    if(window.innerHeight>640){
      this.setState({criticalKpiSectionHeight:'21.6vw'})
    }
    if(this.props.plantId){
      this.getData();
    }
  }
  async componentDidUpdate(prevProps) {
    if (this.props.plantId !== prevProps.plantId) {
      this.getData();
    }
  }
  getData=async()=>{
    const departmentsAchievement=await StatsServices.getDepartmentsAcheivement(this.props.plantId)
    const plantCriticalKpiList=await StatsServices.getPlantCriticalKpiList(this.props.plantId)
    
    
    if(plantCriticalKpiList.length>0){
      const {kpiId,departmentId,departmentName,kpiName }=plantCriticalKpiList[this.displayingKpiIndex];
      await this.setState({departmentsAchievement:departmentsAchievement,
        plantCriticalKpiList:plantCriticalKpiList,
        selectedDepartmentId:departmentId,
        selectedDepartmentName:departmentName,
        selectedKpiId:kpiId,
        selectedKpiName:kpiName,
       
      })
    }
  }
  
  componentWillMount() {
    this._isMounted = true;
		setInterval(() => {
      if (this._isMounted&&(!this.isKpiClicked)) {
        if(this.displayingKpiIndex<this.state.plantCriticalKpiList.length-1){
          this.displayingKpiIndex++
        }
        else{
          this.displayingKpiIndex=0
        }
        if(this.state.plantCriticalKpiList.length>0){
          const {kpiId,departmentId,departmentName,kpiName }=this.state.plantCriticalKpiList[this.displayingKpiIndex];
          this.handleCriticalKpiClick(kpiId,departmentId,departmentName,kpiName,this.displayingKpiIndex,false);
        }
      }   
		}, 5000);
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

  handleCriticalKpiClick=(kpiId,departmentId,departmentName,kpiName,index,isKpiClicked)=>{
    this.setState({
      selectedDepartmentId:departmentId,
      selectedDepartmentName:departmentName,
      selectedKpiId:kpiId,
      selectedKpiName:kpiName
    })
    this.displayingKpiIndex=index
    this.isKpiClicked=isKpiClicked
  }
  criticalKpiDoubleClick=()=>{
    this.isKpiClicked=!this.isKpiClicked
  }
  handleIconClick=()=>{
    this.props.history.push('/nervecenter/home');
  }
  render() {
    
    let scrollbarStyles={
      marginRight:'20px',
      height:this.state.criticalKpiSectionHeight,
    }
    return (
      
      <div style={{
        backgroundColor:'#212121'
      }}>
        
          <img src={icon} hidden={this.state.accessLevel>3} onClick={this.handleIconClick} alt="Logo" style={{width:'35px',height:'30px'}}/>;

          <Grid style={{padding:'0px 20px 20px 20px'}} item xs={12} >
            <div className="dashboardCards">
            
                 <BarGraphComponent departmentsAchievement={this.state.departmentsAchievement}  
                  plantId={this.props.plantId} />
            </div>
          </Grid>

          <Grid container >
            <Grid style={{paddingLeft:'20px'}} item xs={4} >
                <div className="dashboardCards">
                    <PieChartComponent 
                    departmentsAchievement={this.state.departmentsAchievement} />
                </div>  
            </Grid>
            <Grid  item xs={7} >
                <div  style={{marginLeft:'20px'}} className="dashboardCards">
                    <LineGraphComponent 
                      kpiId={this.state.selectedKpiId}
                      departmentId={this.state.selectedDepartmentId}
                      departmentName={this.state.selectedDepartmentName}
                      kpiName={this.state.selectedKpiName}
                    />
                </div>  
            </Grid>
            <Grid  item xs={1} >
                  <PerfectScrollbar style={scrollbarStyles} className="dashboardCards" >
                 { 
                      this.state.plantCriticalKpiList.map(
                          ({kpiId,departmentId,departmentName,kpiName },index) =>
                          <p 
                          onDoubleClick={this.criticalKpiDoubleClick}
                          onClick={()=>{this.handleCriticalKpiClick(kpiId,departmentId,departmentName,kpiName,index,true)}} 
                          style={{fontSize:'10px',color:'#F0F8FF'}} key={index}
                          className="criticalKpiLabel"
                          >{kpiName}-{departmentName}</p>        
                      )
                    }
                 </PerfectScrollbar>
                  
            </Grid>
          </Grid>
       </div>   
    );
  }

}
export default DashboardContainer;
