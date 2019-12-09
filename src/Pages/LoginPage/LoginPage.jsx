import React, { Component,  } from 'react';
import './LoginPage.scss';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import AuthServices from '../../_services/auth'
import PlantServices from '../../_services/plant'
import { ToastContainer} from 'react-toastify';
import notify from '../../components/Toast/notification'
import 'react-toastify/dist/ReactToastify.css';

class LoginPage extends Component {

  constructor(props){
    super(props);
    this.state={
        userName:'',
        password:''
    }
  }
  async componentDidMount(){
  }

  handleChange=(event)=>{
    const { value, name } = event.target;
    this.setState({[name]: value});
  }
  onSubmit=async(event)=>{
    event.preventDefault();
    let userData={
        userName:this.state.userName,
        password:this.state.password
    }
    // const data=await AuthServices.login(userData);
    // if(data.length>0){    
    //   localStorage.setItem('userId', data[0].id);
    //   const userData=await AuthServices.getUserData();
    //   const {plantId}=userData;
    //   if(data[0].accessLevel==4){
    //     notify("Login success","success")
    //     this.props.history.push('/nervecenter/home/clusteradmin/kpis');
    //   }
    //   else{
    //     if(data[0].plantId){
    //       notify("Login success","success")
    //       await PlantServices.updatePlantDepartmentsNewYearSScores(data[0].plantId)
    //     }
    //     this.props.history.push('/nervecenter/screenDashBoard/'+plantId);
    //   } 
    // }
    // else{
    //   notify("Login Failed","error")
    // }
    const adAuthneticateResponse=await AuthServices.adAuthenticate(userData);
   
    if (adAuthneticateResponse.status==200){
      const data=await AuthServices.login(userData);
      if(data.length>0){    
        localStorage.setItem('userId', data[0].id);
        const userData=await AuthServices.getUserData();
        const {plantId}=userData;
        if(data[0].accessLevel==4){
          notify("Login success","success")
          this.props.history.push('/nervecenter/home/clusteradmin/kpis');
        }
        else{
          if(data[0].plantId){
            notify("Login success","success")
            await PlantServices.updatePlantDepartmentsNewYearSScores(data[0].plantId)
          }
          this.props.history.push('/nervecenter/screenDashBoard/'+plantId);
        } 
      }
      else{
        notify("Login Failed","error")
      }
    }
    else{
      notify("Login Failed","error")
    }
    
  }
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
  
  render() {
    return (
      <div className="app" >
         <ToastContainer />
       <Card style={{marginTop:'11vw',width:"20%",marginLeft:'auto',marginRight:'auto'}}>
            <CardHeader>
                <h5>Nerve Center Login</h5>  
            </CardHeader>
            <CardBody >
                <div >
                <TextField
                    style={{marginLeft:'auto',marginRight:'auto'}}
                    label='User Name' 
                    name='userName' 
                    type='text' 
                    onChange={this.handleChange}
                    value={this.state.userName}
                >
                </TextField>
                <TextField
                    style={{marginTop:'20px'}}
                    label='Password' 
                    name='password' 
                    type='password' 
                    onChange={this.handleChange}
                    value={this.state.password}
                ></TextField> <br></br>  
                <button 
                 onClick={this.onSubmit}
                 style={{marginTop:'2vw',position:'relative',left:'50%'}} className="btn btn-primary btn-md">
                     Login <i className="fa fa-sign-in"></i></button>
                </div>
            </CardBody>
       </Card>
                  
      </div>
    );
  }
}
;
export default LoginPage;
