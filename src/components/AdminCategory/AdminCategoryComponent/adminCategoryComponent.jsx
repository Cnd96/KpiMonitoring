import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import {Card,CardBody,CardHeader,} from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import CatergoryServices from '../../../_services/category'

import './adminCategory.scss'
class AdminCategory extends Component {

  constructor(props){
    super(props);
    this.state={
        id:'',
        categories:[],
        buttonDisable:true
    }
  }
  async componentDidMount(){
    this.getCategories()    
  }

  getCategories=async()=>{
    const categories=await CatergoryServices.getCategories()
    this.setState({categories:categories})
  }
  handleChange=(event)=>{
    const { value, name } = event.target;
    this.setState({[name]: value},()=>{
      if(this.state.id==''){
        this.setState({buttonDisable:true})
      }
      else{
        this.setState({buttonDisable:false})
      }
    });
  }
  handleSubmit=async (event)=>{
    event.preventDefault();
    const category={
      categoryName:this.state.id
    }
    const response=await fetch(this.props.baseUrl+"category", {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(category)
    })
    if (response.status==200){
      alert("Successfully saved"); 
      this.props.history.push('/home/clusteradmin/kpis');
    }
    else{
      console.log(response.status)
      alert("Failed"); 
    }
  }
  render() {
    if(this.props.accessLevel==4){
    return (
      <div className="admin-category-container">
            <Card>
                <CardHeader>
                  <h2>Categories
                  </h2>  
                </CardHeader>
                <CardBody>
                  <div>
                    {
                      this.state.categories.map(({id,categoryName})=>
                      <div key={id}>
                        {/* <Avatar key={id} style={{backgroundColor:'orange'}}>{categoryName}</Avatar><br /> */}
                        <label  className="catergoryNameLabel">{categoryName}</label> 
                      </div>                        
                      )
                    }
                  </div><br />
                  <h3>Add New Category</h3>
                  <span>
                  <TextField
                    label='Catergory Name' 
                    name='id' 
                    type='text' 
                    onChange={this.handleChange}
                    value={this.state.id}
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

export default AdminCategory;
