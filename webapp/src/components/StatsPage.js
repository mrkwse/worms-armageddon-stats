import React from 'react';
// import Wins from './wins'
// import Damage from './damage'
import StatsCompiler from './StatsCompilertest'

class StatsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        graphType: "wins",
        personOrGroup: "group"
    }
  this.preferenceChange = this.preferenceChange.bind(this)
  this.personOrGroupChange = this.personOrGroupChange.bind(this)
  }
  preferenceChange(event) {

    this.setState({ graphType: event.target.value });

  }
  personOrGroupChange(event) {

    this.setState({ personOrGroup: event.target.value });

  }
    render(){
        return (
        <div>
      
          <h2>
              This is the stats page
          </h2>
          <div className="form-group">
              <select name="personalOrGroup" className="form-control" value={this.state.personOrGroup} onChange={this.personOrGroupChange} required>
                <option value="group">group</option>
                <option value="personal">personal</option>
              </select>
            </div>
          <div className="form-group">
              <select name="groupstats" className="form-control" value={this.state.graphType} onChange={this.preferenceChange} required>
                <option value="wins">wins</option>
                <option value="damage">damage</option>
                <option value="losecontrol">losecontrol</option>
                <option value="gamesplayed">gamesplayed</option>
                <option value="weapons">weapons</option>
                <option value="kills">killed</option>

              </select>
            </div>
            
     
          <StatsCompiler personOrGroup={this.state.personOrGroup} graphType={this.state.graphType}/>
            </div>
        )
    }
}

export default StatsPage;
