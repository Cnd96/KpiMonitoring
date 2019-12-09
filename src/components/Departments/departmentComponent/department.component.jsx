import React, { Component } from 'react';

class Department extends Component {

  constructor(props){
    super(props);
    console.log(props)
    console.log(props.match.params.id)
  }

  render() {
    return (
      <div className="app">
          <h2>jjj</h2>
      </div>
    );
  }
}

export default Department;
