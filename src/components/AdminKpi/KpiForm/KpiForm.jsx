import React from 'react';
import TextField from '@material-ui/core/TextField';
import './kpiForm.scss'
import KpiServices from '../../../_services/kpis'

import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { ToastContainer} from 'react-toastify';
import notify from '../../Toast/notification'
import 'react-toastify/dist/ReactToastify.css';

class KpiForm extends React.Component{
    constructor(props){
        super(props);
        this.state={
                measuringUnitData:[],
                kpiName:this.props.kpiName,
                description:'',
                type:this.props.type,
                categoryId:this.props.categoryId,
                measuringUnitId:this.props.measuringUnitId,
                clusterId:'',
                buttonDisable:true,
                kpiId:this.props.kpiId,
                isNew:this.props.isNew
        }
        console.log(props)
    }

    handleChange=async(event)=>{
      const { value, name } = event.target;
      await this.setState({[name]: value});
      this.validateForm();
      console.log(this.state.categoryId)
    }

    validateForm=()=>{
        if(this.state.kpiName==''){
            this.setState({buttonDisable: true});
        }
        else if(this.state.type==''){
            this.setState({buttonDisable: true});
        }
        else if(this.state.categoryId==''){
            this.setState({buttonDisable: true});
        }
        else if(this.state.measuringUnitId==''){
            this.setState({buttonDisable: true});
        }
        else{
            this.setState({buttonDisable: false});
        }
    }
    handleSubmit=async (event)=>{
      event.preventDefault();
      const {kpiId,kpiName,categoryId,measuringUnitId,type} =this.state
      if(this.state.isNew){
        const kpiToCreate={
            kpiName:kpiName,
            type:type,
            categoryId:categoryId,
            measuringUnitId:measuringUnitId,
            description:kpiName,
            clusterId:this.props.clusterId,
          }
          const response=await KpiServices.createKpi(kpiToCreate)
          
          if (response.status==200){
            // notify("Successfully Saved","success")
            const kpiData=await response.json();
            await this.props.setKpiList(kpiData)
            this.props.handleClose()
            
          }
          else{
            notify("Error in save","error")
          }
        }
        else{
            const kpiToUpdate={
                kpiName:kpiName,
                type:type,
                categoryId:categoryId,
                measuringUnitId:measuringUnitId,
                description:kpiName,
                clusterId:this.props.clusterId,
                kpiId:kpiId
            }
            const response=await KpiServices.updateKpi(kpiToUpdate)
            if (response.status==200){
                // notify("Successfully Changed","success")
                const kpiData=await response.json();
                this.props.setKpiList(kpiData)
                this.props.handleClose()
                
                
            }
            else{
                notify("Could not change","error")
            }
        }
      
    }
    componentDidMount(){
        this.getMeasuringUnits()
    }
    getMeasuringUnits=async()=>{
        const response=await fetch(this.props.baseUrl+'measuringUnit')
        const measuringUnits=await response.json()
        this.setState({measuringUnitData:measuringUnits})
    }
    render(){
      return(
        <div className='kpi-Form' >
            <ToastContainer />
           <form onSubmit={this.handleSubmit}>
              
             <Grid container spacing={3}>
                
                <Grid item xs={6}>
                    <div>
                        <TextField
                            className="formControl"
                            label='KPI Name' 
                            name='kpiName' 
                            type='text' 
                            onChange={this.handleChange}
                            value={this.state.kpiName}
                            style={{width:'90%'}}
                        /> <br />
                        <FormControl  className="formControl" style={{width:'90%'}}>
                            <InputLabel >Measuring Unit</InputLabel>
                            <Select
                            name='measuringUnitId'
                            value={this.state.measuringUnitId}
                            onChange={this.handleChange}
                            >
                             { 
                                  this.state.measuringUnitData.map(
                                      ({id,unitName }) =>
                                      <MenuItem key={id}value={id}>{unitName}</MenuItem>
                                  )  
                              }
                            </Select>
                        </FormControl>

                                                                  
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div>
                        <FormControl  className="formControl" style={{width:'90%'}}>
                            <InputLabel >Category</InputLabel>
                            <Select
                            name='categoryId'
                            value={this.state.categoryId}
                            onChange={this.handleChange}
                            >
                             { 
                                  this.props.categoryData.map(
                                      ({id,categoryName}) =>
                                      <MenuItem key={id} value={id}>{categoryName}</MenuItem>
                                  )  
                              }
                            </Select>
                        </FormControl>

                        <FormControl  style={{marginTop:"20px"}}>
                            <FormLabel >Type</FormLabel>
                            <RadioGroup aria-label="position" name="type" value={this.state.type} onChange={this.handleChange} row>
                                <FormControlLabel
                                value="A"
                                control={<Radio color="primary" />}
                                label="A"
                                labelPlacement="end"
                                />
                                <FormControlLabel
                                value="B"
                                control={<Radio color="primary" />}
                                label="B"
                                labelPlacement="end"
                                />
                            </RadioGroup>
                        </FormControl>  
                        <button disabled={this.state.buttonDisable} 
                        style={{marginTop:'90px',float:'right' ,marginRight:'22px'}} 
                        className='btn btn-primary'>Submit</button>
                    </div>
                </Grid>
            </Grid>
           </form>
        </div>
      )
    }
}


export default KpiForm

// handleSubmit=async (event)=>{
//     event.preventDefault();
//     let standardScoreData=[];
//     const year=(new Date()).getFullYear();
//     const month=(new Date()).getMonth()+1;

//     for(let i=month;i<=12;i++){
//       const dataToPush={
//           month:i,
//           year:year,
//           standardScore:this.state.standardScore
//       }
//       standardScoreData.push(dataToPush)
//     }
//     const kpiToCreate={
//       kpiName:this.state.kpiName,
//       standardScore:standardScoreData,
//       type:this.state.type,
//       categoryId:this.state.categoryId,
//       measuringUnitId:this.state.measuringUnitId,
//       description:this.state.kpiName,
//       clusterId:this.props.clusterId,
//     }

//     const response=await fetch(this.props.baseUrl+"kpis", {
//       method: "POST",
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body:JSON.stringify(kpiToCreate)
//     })
    
    
//     if (response.status==200){
//       alert("Successfully saved"); 
//       const kpiData=await response.json();
//       this.props.setKpiList(kpiData)
//       this.props.handleClose()
//     }
//     else{
//       console.log(response)
//       alert("Failed"); 
//     }
   
//   }
