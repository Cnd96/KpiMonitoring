import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import AuthServices from '../../_services/auth'
import {
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
import navigation from '../../_nav';
import plantAdminNavigation from '../../_plantAdminNav'
import plantRecorderNavigation from '../../_plantRecorderNav'
import plantViewerNavigation from '../../_plantViewerNav'
import clusterAdminNavigation from '../../_clusterAdminNav'

import routes from '../../routes';


class HomePage extends Component {

  constructor(){
    super();
    this.state={
      accessLevel:'',
      userName:'',
      clusterId:'',
      plantId:'',
      userId:'',
      plantName:'',
      baseUrl:'http://10.227.50.8:3002/api/'
    }
  }
  async componentDidMount(){
   
    const userId=await localStorage.getItem('userId');
    if(!userId){
      this.props.history.push('/')
    }
    const userData=await AuthServices.getUserData();
    const {userName,accessLevel,plantId,clusterId,plantName}=userData;
    
    plantAdminNavigation.items[0].name=userName;
    clusterAdminNavigation.items[0].name=userName;
    plantViewerNavigation.items[0].name=userName;
    plantRecorderNavigation.items[0].name=userName;
    await this.setState({
      accessLevel:accessLevel,
      userName:userName,
      clusterId:clusterId,
      plantName:plantName,
      userId:userId,
      plantId:plantId,
    })
  }


  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
  signOut(e) {
    e.preventDefault()
    this.props.history.push('/login')
  }
  render() {
    return (
      <div className="app">

        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
            {(() => {
              switch (this.state.accessLevel) {
                case 1: return <AppSidebarNav  navConfig={plantViewerNavigation} {...this.props} router={router}/>;
                case 2: return <AppSidebarNav  navConfig={plantRecorderNavigation} {...this.props} router={router}/>;
                case 3: return <AppSidebarNav  navConfig={plantAdminNavigation} {...this.props} router={router}/>;
                case 4: return <AppSidebarNav  navConfig={clusterAdminNavigation} {...this.props} router={router}/>;
                default:      return <AppSidebarNav  navConfig={navigation} {...this.props} router={router}/>;
              }
            })()}
                       
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} router={router}/>
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} 
                            baseUrl={this.state.baseUrl}
                            name={this.state.name}
                            accessLevel={this.state.accessLevel}
                            userId={this.state.userId} 
                            plantId={this.state.plantId}
                            plantName={this.state.plantName}
                            clusterId={this.state.clusterId} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/" />
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
      </div>
    );
  }
}

export default HomePage;
