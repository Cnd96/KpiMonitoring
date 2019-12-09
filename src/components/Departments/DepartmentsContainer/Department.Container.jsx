import React, { Component } from 'react';
import DepartmentAcheivementButton from '../../DepartmentAchievementButton/departmentAcheivementButonn'
import {Card,CardBody,CardHeader,} from 'reactstrap';
import './departmentContainer.styles.scss'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import CatergoryServices from '../../../_services/category'
import AuthServices from '../../../_services/auth'
import PlantServices from '../../../_services/plant'
import StatsServices from '../../../_services/stats'
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import PerfectScrollbar from 'react-perfect-scrollbar'
import Popper from '@material-ui/core/Popper';
import icon from '../../../assets/N-Icon.png'
import 'react-toastify/dist/ReactToastify.css';

class DepartmentContainer extends Component {

  constructor(props){
    super(props)
    this.state={
      departmentsInPlant:[],
      categoryData:[],
      catergoryDivLength:'18%',//14 if 6
      departmentsAchievement:[],
      selectedClass:'',
      plantName:'',
      open:false,
      anchorEl:null,
      placement:'top-end',
      mouseOnOverKpi:'',
    } ;
  }

  async componentDidMount(){
     if(this.props.plantId){
      this.getDepartmentsInPlant()
      let departmentsAchievement=await this.getDepartmentsAchievementCatergoryWise()
      this.divideDepartmentAchievements(departmentsAchievement);
      const categories=await CatergoryServices.getCategories();
      if(categories.length==6){
        this.state.catergoryDivLength='14%'
      }
      await this.setState({categoryData:categories,
        plantName:this.props.plantName,catergoryDivLength:this.state.catergoryDivLength}); 
     }
  }
  async componentDidUpdate(prevProps) {
    if (this.props.plantId !== prevProps.plantId) {
      this.getDepartmentsInPlant()
      let departmentsAchievement=await this.getDepartmentsAchievementCatergoryWise()
      this.divideDepartmentAchievements(departmentsAchievement);
      const categories=await CatergoryServices.getCategories();
      if(categories.length==6){
        this.state.catergoryDivLength='14%'
      }
      await this.setState({categoryData:categories,
        plantName:this.props.plantName,catergoryDivLength:this.state.catergoryDivLength}); 
    }
  }
  getDepartmentsAchievementCatergoryWise=async()=>{
    const departmentsAchievement=await StatsServices.getDepartmentsAcheivementCategoryWise(this.props.plantId);
    return departmentsAchievement;
  }
  getDepartmentsInPlant=async()=>{
    const plantDetails=await PlantServices.getDepartmentsInPlant(this.props.plantId);
    this.setState({departmentsInPlant:plantDetails.departments})
  }
  divideDepartmentAchievements=(departmentsAchievement)=>{
    departmentsAchievement.forEach(department => {
      department.categoryData.forEach(category=>{
        category.data.forEach(kpi=>{
          if(kpi.type=='B'){
            if(kpi.averageYearScore<=kpi.meanYearStandardScore&&kpi.averageMonthScore<=kpi.monthStandardScore){
              kpi.achievementClass='bothAchievedButton'
            }
            else if(kpi.averageYearScore<=kpi.meanYearStandardScore){
              kpi.achievementClass='yearOnlyAchievedButton'
            }
            else if(kpi.averageMonthScore<=kpi.monthStandardScore){
              kpi.achievementClass='monthOnlyAchievedButton'
            }
            else if(kpi.averageYearScore>kpi.meanYearStandardScore&&kpi.averageMonthScore>kpi.monthStandardScore){
              kpi.achievementClass='bothNotAchievedButton'
            }
          }
          else if(kpi.type=='A'){
            if(kpi.averageYearScore>=kpi.meanYearStandardScore&&kpi.averageMonthScore>=kpi.monthStandardScore){
              kpi.achievementClass='bothAchievedButton'
            }
            else if(kpi.averageYearScore>=kpi.meanYearStandardScore){
              kpi.achievementClass='yearOnlyAchievedButton'
            }
            else if(kpi.averageMonthScore>=kpi.monthStandardScore){
              kpi.achievementClass='monthOnlyAchievedButton'
            }
            else if(kpi.averageYearScore<kpi.meanYearStandardScore&&kpi.averageMonthScore<kpi.monthStandardScore){
              kpi.achievementClass='bothNotAchievedButton'
            }
          }
        })
      })
    });
    this.setState({departmentsAchievement:departmentsAchievement})
  }
  handleAchievementChange=async(event)=>{
    const { value, name } = event.target;
    await this.setState({[name]: value});

  }
  filterDepartmentsAchivement=()=>{
    let filteredDepartmentsAchievement=[]
    const {departmentsAchievement}=this.state;
    departmentsAchievement.forEach(department=>{
      let departentToPush={
        departmentId:department.departmentId,
        departmentName:department.departmentName,
        categoryData:[]
      };
      department.categoryData.forEach(category=>{
        let departmentFilteredKpis=category.data.filter(data=>data.achievementClass.includes(this.state.selectedClass))
        let categoryDataTopush={
          name:category.name,
          data:departmentFilteredKpis
        }
        departentToPush.categoryData.push(categoryDataTopush)
      })
      filteredDepartmentsAchievement.push(departentToPush)
    })
    return filteredDepartmentsAchievement
  }
  handleKpiClick=(kpiId,departmentId)=>{
    this.props.history.push('/nervecenter/home/department/kpiHistory/'+kpiId+'/'+departmentId);
  }
  handleOnMouseOver=async(event,kpiName)=>{
    if(this.state.anchorEl==null){
        await this.setState({ anchorEl: event.currentTarget });
    }
    else{
        await this.setState({ anchorEl: null }) 
    }
    await this.setState({ mouseOnOverKpi:kpiName, open: true });
  }
  handleOnMouseLeft=async(event)=>{
    if(this.state.anchorEl==null){
        await this.setState({ anchorEl: event.currentTarget });
    }
    else{
        await this.setState({ anchorEl: null }) 
    }
    await this.setState({ ...this.state, open: false });
  }
  handleIconClick=async()=>{
    const userData=await AuthServices.getUserData();
    const {plantId}=userData;
    this.props.history.push('/nervecenter/screenDashBoard/'+plantId);
  }
  render() {
    const open = this.state.anchorEl === null ? false : true;
    const id = this.state.open ? "simple-popper" : null
    const filteredDepartmentsAchievement=this.filterDepartmentsAchivement();
    if(this.props.accessLevel==2||3){
    return (
      <div >
         <Popper id={id} open={this.state.open} anchorEl={this.state.anchorEl} placement={this.state.placement} transition>
             {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper>
                    <Typography style={{padding:'4px'}}>{this.state.mouseOnOverKpi}</Typography>
                  </Paper>
                </Fade>
              
             )}
           </Popper>  
        <Card>
            <CardHeader>
                   
                    <h5  style={{fontSize:'2vw'}}>
                      <img src={icon} onClick={this.handleIconClick} alt="Logo" style={{width:'35px',height:'30px',marginRight:'15px'}}/>
                      Department List - {this.props.plantName}
                    <span  > 
                    <select style={{width:'30%',float:'right'}} className="form-control" 
                     name='selectedClass'
                     value={this.state.selectedClass}
                     onChange={this.handleAchievementChange}
                     >
                      <option  value={''}>Select Achievement</option>
                      <option value={'bothNotAchievedButton'}>Not achieved</option>
                      <option value={'yearOnlyAchievedButton'}>Year only</option>
                      <option value={'monthOnlyAchievedButton'}>Month only</option>
                      <option value={'bothAchievedButton'}>Both achieved</option>
                    </select>
                    </span>
                    </h5>  
            </CardHeader>
            <CardBody> 

            <div >
              <Grid container spacing={3}>
                <Grid item xs={2} >  
                </Grid>
                <Grid item xs={10} >
                  <div className="catergoryFlexContainer">
                   { 
                        this.state.categoryData.map(
                            ({id,categoryName,...otherProps }) =>
                            <div  key={id} className="catergoryFlexContainerCard" 
                               style={{width:this.state.catergoryDivLength}}>
                              {/* <Avatar style={{backgroundColor:'#4285F4',margin:'auto'}}>{categoryName}</Avatar> */}
                              <Chip style={{backgroundColor:'white',color:'#1E88E5',border:'1px solid #1E88E5'}} avatar={<Avatar 
                                    style={{height:'2.7vw',width:'2.7vw',color:'white',
                                    backgroundColor:'#1565C0'}}>
                                {categoryName[0]}</Avatar>} label={categoryName}/>
                            </div>  
                        )  
                    }     
                  </div>
                </Grid>
              </Grid>
              <PerfectScrollbar style={{height:'416px'}}  >
              {
                    filteredDepartmentsAchievement.map(({departmentId,categoryData,departmentName})=>
                    // <Card key={departmentId}>
                    //   <CardBody>
                    <div key={departmentId} style={{marginBottom:'10px',border:'1px solid #A9A9A9',borderRadius:'5px',overflow:'hidden'}}>
                      <Grid container  key={departmentId}  spacing={3}>
                        <Grid item xs={2} style={{margin:'auto'}}>
                          <h4 style={{marginLeft:'20px'}}>{departmentName}</h4>
                        </Grid>
                        <Grid item xs={10} >
                          <div className="catergoryFlexContainer" style={{border:''}}>
                          { 
                                categoryData.map(
                                    ({name,data }) =>
                                    <div key={name} className="catergoryFlexContainerCard" 
                                      style={{width:this.state.catergoryDivLength,
                                      // borderWidth:'1px',
                                      // borderRight:'solid',
                                      // borderLeft:'solid',
                                      // borderColor:'#D3D3D3',
                                      // borderRadius:'5px',
                                      // // backgroundColor:'#f5f5f5'
                                    }}
                                      >
                                      {
                                        data.map(({kpiName,kpiId,achievementClass})=>
                                        <DepartmentAcheivementButton  key={kpiId} kpiName={kpiName} 
                                          handleKpiClick={()=>{this.handleKpiClick(kpiId,departmentId)}}
                                          handleOnMouseOver={(e)=>{this.handleOnMouseOver(e,kpiName)}}
                                          handleOnMouseLeft={this.handleOnMouseLeft}
                                          achievementClass={achievementClass}/>
                                        )
                                      }
                                    </div>  
                                )  
                            }     
                          </div>
                          
                        </Grid>
                      </Grid>
                    </div>
                      
                    //   </CardBody>
                    // </Card>   
                    )
                  }
              </PerfectScrollbar>
           
            </div>                  
            </CardBody>
        </Card>  
      </div>
    );
   } 
   else if(this.props.accessLevel=4){
    this.props.history.push('/nervecenter/home/clusteradmin/kpis');
   }
   else{
    return (
      <h2>Unautharized</h2>
    ) 
   }
  }
}
export default DepartmentContainer;
