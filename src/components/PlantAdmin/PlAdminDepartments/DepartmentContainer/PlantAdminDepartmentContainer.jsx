import React, { Component } from 'react';
import DepartmentTile from '../../../Departments/DepartmentTileComponent/departmentTile'
import {Card,CardBody,CardHeader,} from 'reactstrap';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import PlantServices from '../../../../_services/plant'

import COLOR_DATA from '../../../../colors'
import '../../../Departments/DepartmentsContainer/departmentContainer.styles.scss'


class PlantAdminDepartmentContainer extends Component {

  constructor(props){
    super(props)
    this.state={
      departmentsInPlant:[],
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
  handleAddDepartmentClick=()=>{
    this.props.history.push('/nervecenter/home/plantadmin/createDepartment');
  }
  getDepartmentsInPlant=async()=>{
    const plantDetails=await PlantServices.getDepartmentsInPlant(this.props.plantId)
    this.setState({departmentsInPlant:plantDetails.departments})
  }

  render() {
    for(let i=0;i<this.state.departmentsInPlant.length;i++){
      this.state.departmentsInPlant[i].color=COLOR_DATA[i%13];
    }
    if(this.props.accessLevel==3){
    return (  
      <div className="app">
        <Card>
            <CardHeader>
                    <h5 style={{fontSize:'2vw'}}>Admin Departments Section
                      <Fab onClick={()=>{this.handleAddDepartmentClick()}}
                        style={{float:'right',width:'45px',height:'45px'}} color="primary" aria-label="add" >
                       <AddIcon />
                      </Fab>
                    </h5>  
            </CardHeader>
            <CardBody> 
                  <div className='department-menu' >
                    { 
                        this.state.departmentsInPlant.map(
                            ({id,...otherProps }) =>
                            <DepartmentTile url="/nervecenter/home/plantadmin/editDepartment/" key={id} id={id} {...otherProps}/>
                        )  
                    }
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
export default PlantAdminDepartmentContainer;
