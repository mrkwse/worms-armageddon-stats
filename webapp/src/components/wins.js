import React from 'react';
import statsjson from '../Assets/all_games'
import VegaLite from 'react-vega-lite';

class Wins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
    render(){
        const spec = {
            "description": "A simple bar chart with embedded data.",
            "mark": "bar",
            "encoding": {
              "x": {"field": "name", "type": "ordinal"},
              "y": {"field": "wins", "type": "quantitative"}
            }
          };
          
 
        let winners = {}
        let barData = {"values": [
          ]
        }
        Object.keys(statsjson).forEach(key => {
            if (statsjson[key]['gameCompleted']){
                var teams = statsjson[key]['gameteams']
                Object.keys(teams).forEach(index => {
                    if(teams[index]['winner']){
                        if (teams[index]['team']['name'] in winners){
                            winners[teams[index]['team']['name']] = winners[teams[index]['team']['name']] +1

                        } else {
                            winners[teams[index]['team']['name']] = 1
                        }
                    }
            });
        };
        Object.keys(winners).forEach(key => {
            barData['values'].push({"name": key ,"wins": winners[key]})
        })
     

        });
        
        return (
        <div className="graphs">
             <VegaLite spec={spec} data={barData} />

            </div>
        )
    }
}

export default Wins;
