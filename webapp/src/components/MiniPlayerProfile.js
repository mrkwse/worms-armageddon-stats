import React from 'react';
import Shelby from '../Assets/Shelby_The_Worm.png'
import players from '../Assets/PlayerProfiles.json'
class Basiccomponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

    render(){
        return (
        <div className="miniPlayerCard">
      <div className="card" >
      <img className="card-img-top" src={Shelby}  alt="Card cap" />
  <div className="card-body">
    <h5 className="card-title">Worms player: {this.props.player.name}</h5>
    <p className="">Style: {this.props.player.style}</p>
    <p className="card-text-small">Favorite Weapon: {this.props.player.faveweapon}</p>
    <p className="card-text-small">Bio: {this.props.player.bio}</p>
    <p className="card-text-small">Team: {this.props.player.team}</p>

  </div>
</div>
            </div>
        )
    }
}

export default Basiccomponent;
