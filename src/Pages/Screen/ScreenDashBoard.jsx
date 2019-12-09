import React, { Component,  } from 'react';
import DashboardContainer from '../../components/Dashboard/DashboardContainer'
import AuthServices from '../../_services/auth'
class Screen extends Component {

  constructor(props){
    super(props);
    this.state={
      plantId:''
    }
  }
  async componentDidMount(){
    // localStorage.setItem('userPlantId', data[0].plantId);
    // const userData=await AuthServices.getUserData();
    // const {userName,accessLevel,plantId,clusterId,plantName}=userData;
    // if(plantId){
    //   this.setState({plantId:plantId})
    // }
    this.setState({plantId:this.props.match.params.plantId})
  }

  async componentDidUpdate(prevProps) {

  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
  
  render() {
    return (
      <div className="app" style={{backgroundColor:'#212121'}}>
        <DashboardContainer {...this.props} plantId={this.state.plantId}/>
      </div>
    );
  }
}

export default Screen;
