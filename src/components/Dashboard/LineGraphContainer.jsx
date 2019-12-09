import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
import lineGraphCalculation from '../lineGraphCalculation';
import Popper from '@material-ui/core/Popper';

class LineGraphComponent extends Component {
  constructor(props){
    super(props)
    this.state={
      data:{},
      kpiId:this.props.kpiId,
      departmentId:this.props.departmentId,
      departmentName:this.props.departmentName,
      kpiName:this.props.kpiName,
      endDate:new Date(),
      startDate:new Date((new Date()).getFullYear()-1,(new Date()).getMonth(),(new Date()).getDate()),
    //   open:false,
    //   anchorEl:null,
    //   placement:'bottom-end'
      options:{}
      
    }
  }

  async componentDidMount(){
    
  }
  
  async componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      const {kpiId,departmentId,departmentName,kpiName}=this.props
      await this.setState({kpiId:kpiId,kpiName:kpiName,departmentId:departmentId,departmentName:departmentName})
      const lineGraphData=await lineGraphCalculation(this.state.kpiId,this.state.departmentId,
         this.state.startDate,this.state.endDate)
      if(!lineGraphData){
        this.setState({data:{}})
      }
      else{
        this.setState({data:lineGraphData.data,options:lineGraphData.options})
      }
    }
  }

  render() {
    if(window.innerHeight>640){
      return (
        <div > 
           <h5 style={{marginLeft:'15px',paddingTop:'5px',fontSize:'20px',color: "#F0F8FF",}}>
             {this.state.departmentName}-{this.state.kpiName}
            </h5>

            
           <Line 
             data={this.state.data} 
             options={this.state.options}
             height={100}
             />  
       </div>
     );
    }
   else{
        return (
          <div > 

            <h5 style={{marginLeft:'15px',paddingTop:'5px',fontSize:'20px',color: "#F0F8FF",}}>
              {this.state.departmentName}-{this.state.kpiName}
            </h5>
            <Line 
              data={this.state.data} 
              options={this.state.options}
              height={95}
              />  
        </div>
      );
    }
  }
}
export default LineGraphComponent;
