import React from 'react';
import TextField from '@material-ui/core/TextField';
import './measuringUnitForm.scss'
class MeasuringUnitForm extends React.Component{
    constructor(props){
        super(props);
        this.state={
            unitSymbol:'',
            unitName:'',
            buttonDisable:true
        }
        console.log(props)
    }

    handleChange=async(event)=>{
      const { value, name } = event.target;
      await this.setState({[name]: value});
     this.validateForm()
    }

    validateForm=()=>{
      if(this.state.unitSymbol==''){
          this.setState({buttonDisable: true});
      }
      else if(this.state.unitName==''){
          this.setState({buttonDisable: true});
      }
      else{
          this.setState({buttonDisable: false});
      }
    }
    handleSubmit=async (event)=>{
      event.preventDefault();
      let measuringUnitToCreate={
        unitSymbol:this.state.unitSymbol,
        unitName:this.state.unitName
      }
      const response=await fetch(this.props.baseUrl+"measuringUnit", {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(measuringUnitToCreate)
      })
      
      
      if (response.status==200){
        alert("Successfully saved"); 
        const measuringUnitData=await response.json();
        console.log(measuringUnitData)
        this.props.setMeasurementUnits(measuringUnitData)
        this.props.handleClose()
      }
      else{
        console.log(response)
        alert("Failed"); 
      }
     
    }


    render(){
      return(
        <div className='measuringUnit-Form' >
           <form onSubmit={this.handleSubmit}>
              <TextField
                label='Unit Name' 
                name='unitName' 
                type='text' 
                onChange={this.handleChange}
                value={this.state.unitName}
                style={{width:'70%'}}
                margin="dense"
              /> <br />
              <TextField
                label='Symbol' 
                name='unitSymbol' 
                type='text' 
                onChange={this.handleChange}
                style={{width:'70%'}}
                value={this.state.unitSymbol}
                margin="dense"
              />
            <button disabled={this.state.buttonDisable} style={{marginTop:'18px'}} className='btn btn-primary'>Submit</button>
           </form>
        </div>
      )
    }
}


export default MeasuringUnitForm