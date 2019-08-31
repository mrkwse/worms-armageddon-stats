import React from 'react';
// import Wins from './wins'
// import Damage from './damage'
import GenericStats from './GenericStats'

class StatsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
    render(){
        return (
        <div>
      
          <h2>
              This is the stats page
          </h2>
          {/* <Wins />
          <Damage /> */}
          <GenericStats />
            </div>
        )
    }
}

export default StatsPage;
