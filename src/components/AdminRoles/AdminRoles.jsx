import React, { Component } from 'react';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import RolesServices from '../../_services/roles'

import './AdminRoles.styles.scss'
class AdminRolesComponent extends Component {

  constructor(props){
    super(props);
    this.state={
        roleName:'',
        clusterRoles:[],
        buttonDisable:true,
        clusterId:''
    }
  }
  async componentDidMount(){
    if(this.props.clusterId){
      await this.setState({clusterId:this.props.clusterId})
      const clusterRoles=await RolesServices.getClusterRoles(this.state.clusterId)
      this.setState({clusterRoles:clusterRoles})
    }
  }
  async componentDidUpdate(prevProps) {
    if (this.props.clusterId !== prevProps.clusterId) {
      await this.setState({clusterId:this.props.clusterId})
      const clusterRoles=await RolesServices.getClusterRoles(this.state.clusterId)
      this.setState({clusterRoles:clusterRoles})
    }
  }

  handleChange=(event)=>{
    const { value, name } = event.target;
    this.setState({[name]: value},()=>{
      if(this.state.roleName==''){
        this.setState({buttonDisable:true})
      }
      else{
        this.setState({buttonDisable:false})
      }
    });
  }
  handleSubmit=async (event)=>{
    event.preventDefault();
    
    const role={
        roleName:this.state.roleName,
        clusterId:this.state.clusterId
    }
    const response=await RolesServices.createRole(role);
    if (response.status==200){
      alert("Successfully saved"); 
      this.props.history.push('/nervecenter/home/clusteradmin/kpis');
    }
    else{
      alert("Failed"); 
    }
  }
  render() {
    if(this.props.accessLevel==4){
    return (
      <div className="admin-category-container">
            <Card>
                <CardHeader>
                  <h2>Roles
                  </h2>  
                </CardHeader>
                <CardBody>
                  <div>
                    {
                      this.state.clusterRoles.map(({id,roleName})=>
                      <div key={id}>
                          <label className="roleNameLabel">{roleName}</label> 
                      </div>                        
                      )
                    }
                  </div><br />
                  <h3>Add New Role</h3>
                  <span>
                  <TextField
                    label='Role' 
                    name='roleName' 
                    type='text' 
                    onChange={this.handleChange}
                    value={this.state.roleName}
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

export default AdminRolesComponent;
