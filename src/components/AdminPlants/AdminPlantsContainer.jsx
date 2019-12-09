import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import './AdminPlants.styles.scss'
import ClusterServices from '../../_services/clusters'
import { ToastContainer} from 'react-toastify';
import notify from '../Toast/notification'

class AdminPlantsContainer extends Component {

  constructor(props){
    super(props);
    this.state={
        id:'',
        plants:[],
        plantName:'',
        location:'',
        plantAdminName:'',
        buttonDisable:true
    }
  }
  async componentDidMount(){   
    if(this.props.clusterId){
      this.getPlants()
    }
  }
  
  async componentDidUpdate(prevProps) {
    if (this.props.clusterId !== prevProps.clusterId) {
      this.getPlants()
    }
  }
  handleChange=(event)=>{
    const { value, name } = event.target;
    this.setState({[name]: value},()=>{
      if(this.state.location==''||this.state.plantName==''||this.state.plantAdminName==''){
        this.setState({buttonDisable:true})
      }
      else{
        this.setState({buttonDisable:false})
      }
    });
  }

  handleSubmit=async (event)=>{
    event.preventDefault();
    const plantData={
      kpiRecordingMethod:"Role",
      plantName:this.state.plantName,
      location:this.state.location,
      clusterId:this.props.clusterId,
      userName:this.state.plantAdminName,
    }

    const response=await ClusterServices.createPlant(plantData);
    if (response.status==200){
      this.getPlants()
      alert("success")
      // notify("Created successfully","error")
    }
    else{
      // notify("Could Not Created","error")
    }
  }
  
  handlePlantClick=(id)=>{
    this.props.history.push('/nervecenter/screenDashBoard/'+id);
  }
  getPlants=async()=>{
    const plants=await ClusterServices.getPlantsInCluster(this.props.clusterId)
    this.setState({plants:plants,plantAdminName:'',plantName:'',location:''})
  }
  render() {
    if(this.props.accessLevel==4){
      return (
        
        <div >
         <ToastContainer />
              <Card>
                  <CardHeader>
                    <h2>Plants
                    </h2>  
                  </CardHeader>
                  <CardBody>
                    <div>
                      {
                        this.state.plants.map(({id,plantName,location})=>
                        <div key={id}>
                          
                          <label onClick={()=>this.handlePlantClick(id)}  className="plantNameLabel">{plantName}-{location}</label> 
                        </div>                        
                        )
                      }
                    </div><br />
                    <h3>Add New Plant</h3>
                    <span>
                    <TextField
                      label='Plant Name' 
                      name='plantName' 
                      type='text' 
                      onChange={this.handleChange}
                      value={this.state.plantName}
                      // margin="dense"
                    >
                    </TextField>
                    <TextField
                      style={{marginLeft:'10px'}}
                      label='Location' 
                      name='location' 
                      type='text' 
                      onChange={this.handleChange}
                      value={this.state.location}
                      // margin="dense"
                    >
                    </TextField> 
                    <TextField
                      style={{marginLeft:'10px'}}
                      label='Plant Admin' 
                      name='plantAdminName' 
                      type='text' 
                      onChange={this.handleChange}
                      value={this.state.plantAdminName}
                      // margin="dense"
                    >
                    </TextField>                          
                    <button onClick={this.handleSubmit} disabled={this.state.buttonDisable}
                     className="btn btn-primary" style={{marginTop:'14px'}}>Submit</button>
                    </span>
                                               
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

export default AdminPlantsContainer;
