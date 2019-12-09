import React, { Component } from 'react';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Popup from "reactjs-popup";
import KpiForm from '../KpiForm/KpiForm'
import '../../popup.scss';


import { ToastContainer} from 'react-toastify';
import notify from '../../Toast/notification'
import 'react-toastify/dist/ReactToastify.css';

import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

class AdminKpiContainer extends Component {
  constructor(props){
    super(props); 
    this.state={
      clusterKpiData:[],
      categoryData:[],
      categoryNameSelected:''
    }
  }  
  componentDidMount(){
    if(this.props.clusterId){
    this.getKpiList()
    this.getCategories()
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.clusterId !== prevProps.clusterId) {
      this.getKpiList()
      this.getCategories()
    }
  }

  getKpiList=async()=>{
    const response=await fetch(this.props.baseUrl+'clusters/kpiList/'+this.props.clusterId)
    const kpiData=await response.json()
    this.setState({clusterKpiData:kpiData})
  }
  setKpiList=async(kpiList)=>{
    await  this.setState({clusterKpiData:kpiList})
  }

  notificationSaved=()=>{
    notify("Successfully Saved","success")
  }
  notificationChanged=()=>{
    notify("Successfully Changed","success") 
  }

  getCategories=async()=>{
    const response=await fetch(this.props.baseUrl+'category')
    const categories=await response.json();
    this.setState({categoryData:categories})
  }
  handleChange=async(event)=>{
    const { value, name } = event.target;
     this.setState({[name]: value});
  }
  render() { 
    const {clusterKpiData,categoryNameSelected}=this.state;
    const filteredKpis=clusterKpiData.filter(kpi=>kpi.category.categoryName.includes(categoryNameSelected));
    console.log(this.props.accessLevel)
    if(this.props.accessLevel==4){
    return (
      <div >
         <ToastContainer />
           <Card>
                <CardHeader>
                  <h2>KPI List
                    <Popup  trigger={
                      <Fab style={{float:'right',width:'45px',height:'45px'}} color="primary" aria-label="add" >
                      <AddIcon />
                      </Fab>} modal>
                      {close => (
                        <div style={{padding:'40px'}} className="popupModal">
                          <a className="popupClose" onClick={close}>
                            &times;
                          </a>
                          <h2 className="popupHeader">Add New KPI</h2>
                          <div className="popupContent">
                            <KpiForm {...this.props}  
                            categoryData={this.state.categoryData}
                            setKpiList={this.setKpiList}
                            measuringUnitId=''
                            type=''
                            isNew={true}
                            categoryId=''
                            kpiName=''
                            kpiId=''
                            handleClose={close}
                            />
                          </div>
                        </div>
                      )}                    
                    </Popup>
                  </h2> 
                </CardHeader>
                <CardBody>
                    <div>
                      <div style={{width:'30%',float:'right',marginBottom:'20px'}}>
                        <FormControl  className="formControl" style={{width:'90%'}}>
                                <InputLabel >SQDCM</InputLabel>
                                <Select
                                name='categoryNameSelected'
                                value={this.state.categoryNameSelected}
                                onChange={this.handleChange}
                                >
                                        <MenuItem value={''}></MenuItem>
                                { 
                                      this.state.categoryData.map(
                                          ({id,categoryName}) =>
                                          <MenuItem key={id} value={categoryName}>{categoryName[0]}</MenuItem>
                                      )  
                                  }
                                </Select>
                          </FormControl>
                      </div>
                      
                      <table  className="table table-hover table-outline">
                            <thead className="thead-light">
                                <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Type</th>
                                <th scope="col">SQDCM</th>
                                <th scope="col">Measuring Unit</th>
                                <th scope="col">Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                { 
                                    filteredKpis.map(
                                        ({id,type,kpiName,category,measuringUnit}) =>
                                        <tr key={id}>
                                        <th>{kpiName}</th>
                                        <td>{type}</td>
                                        <td>{category.categoryName[0]}</td>
                                        <td>{measuringUnit.unitName}</td>
                                        <td>
                                        <Popup  trigger={
                                        <Fab style={{width:'40px',height:'40px'}} aria-label="add" >
                                        <CreateIcon />
                                        </Fab>} modal>
                                        {close => (
                                          <div style={{padding:'40px'}} className="popupModal">
                                            <a className="popupClose" onClick={close}>
                                              &times;
                                            </a>
                                            <h2 className="popupHeader">Edit KPI</h2>
                                            <div className="popupContent">
                                              <KpiForm {...this.props}  
                                              measuringUnitId={measuringUnit.id}
                                              kpiName={kpiName}
                                              type={type}
                                              isNew={false}
                                              kpiId={id}
                                              categoryId={category.id}
                                              categoryData={this.state.categoryData}
                                              setKpiList={this.setKpiList}
                                              handleClose={close}
                                              notificationChanged={this.notificationChanged}
                                              notificationSaved={this.notificationSaved}
                                              />
                                            </div>
                                          </div>
                                        )}                    
                                      </Popup>
                                        
                                        </td>
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
export default AdminKpiContainer;
