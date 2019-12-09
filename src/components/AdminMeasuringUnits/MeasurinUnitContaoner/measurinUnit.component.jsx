import React, { Component } from 'react';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Popup from "reactjs-popup";
import MeasuringUnitForm from '../MeasuringUnitForm/measuringUnitForm.component'
import '../../popup.scss';

class MeasuringUnitContainer extends Component {
  constructor(props){
    super(props); 
    this.state={
      measuringUnitData:[],
    }
  }  
  componentDidMount(){
    console.log("did mount")
    this.getMeasuringUnits()
  }

  getMeasuringUnits=async()=>{
    const response=await fetch(this.props.baseUrl+'measuringUnit')
    const measuringUnits=await response.json()
    this.setState({measuringUnitData:measuringUnits})
  }
  setMeasurementUnits=(measuringUnits)=>{
    this.setState({measuringUnitData:measuringUnits})
  }
  render() {
    if(this.props.accessLevel==4){ 
    return (
      <div className="enter-container">
            <Card>
                <CardHeader>
                  <h2>Measuring Units 
                    <Popup  trigger={
                      <Fab style={{float:'right',width:'45px',height:'45px'}} color="primary" aria-label="add" >
                      <AddIcon />
                      </Fab>} modal>
                      {close => (
                        <div style={{padding:'40px'}} className="popupModal">
                          <a className="popupClose" onClick={close}>
                            &times;
                          </a>
                          <h2 className="popupHeader">Add new measuring unit</h2>
                          <div className="popupContent">
                            <MeasuringUnitForm 
                             {...this.props}  
                             setMeasurementUnits={this.setMeasurementUnits}
                             handleClose={close}/>
                          </div>
                        </div>
                      )}                    
                    </Popup>
                  </h2> 
                </CardHeader>
                <CardBody>
                  <div>
                    <table style={{}} className="table table-hover table-outline">
                          <thead className="thead-light">
                              <tr>
                              <th scope="col">Name</th>
                              <th scope="col">Symbol</th>
                              {/* <th scope="col">Update</th> */}
                              </tr>
                          </thead>
                          <tbody>
                              { 
                                  this.state.measuringUnitData.map(
                                      ({id,unitName,unitSymbol }) =>
                                      <tr key={id}>
                                      <th>{unitName}</th>
                                      <td>{unitSymbol}</td>
                                      {/* <td>
                                      <Fab style={{width:'35px',height:'35px'}} aria-label="add" >
                                      <CreateIcon />
                                      </Fab>
                                      </td> */}
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
export default MeasuringUnitContainer;
