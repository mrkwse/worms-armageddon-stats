import React from 'react';

class Basiccomponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
    render(){
        return (
        <div>
      
      <div className="jumbotron">
  <h1 className="display-3">Player Profile: </h1>
  <p className="lead">This will contain information about a player</p>
  <hr className="my-4" />
  <p>This will contain some futher detials about a player</p>
  <p className="lead">
  </p>

</div>
            </div>
        )
    }
}

export default Basiccomponent;
