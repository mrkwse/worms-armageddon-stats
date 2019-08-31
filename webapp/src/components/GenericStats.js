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
          const spec2 = {
            "description": "A simple bar chart with embedded data.",
            "mark": "bar",
            "encoding": {
              "x": {"field": "name", "type": "ordinal"},
              "y": {"field": "damage", "type": "quantitative"}
            }
          };
          const spec3 = {
            "description": "A simple bar chart with embedded data.",
            "mark": "bar",
            "encoding": {
              "x": {"field": "name", "type": "ordinal"},
              "y": {"field": "losecontrol", "type": "quantitative"}
            }
          };
          
        let loseControl = {}
        let totalDamage ={}
        let winners = {}
        let barData = {"values": [
          ]
        }
        Object.keys(statsjson).forEach(key => {
            if (statsjson[key]['gameCompleted']){
                var teams = statsjson[key]['gameteams']
                Object.keys(teams).forEach(index => {
                    let damage = 0
                    let controllost = 0
                    if(teams[index]['winner']){
                        if (teams[index]['team']['name'] in winners){
                            winners[teams[index]['team']['name']] = winners[teams[index]['team']['name']] +1

                        } else {
                            winners[teams[index]['team']['name']] = 1
                        }
                    }
                    if ((teams[index]['turns']).length > 0 ){
                    
                        let turns = (teams[index]['turns'])
                        turns.forEach(function(element){
                         
                          element['turndamages'].forEach(function(x){
                        
                            damage = damage + x['damage']
                          })
  
                        })
                    }
                    
                      if (teams[index]['team']['name'] in totalDamage){
                          totalDamage[teams[index]['team']['name']] = totalDamage[teams[index]['team']['name']] + damage
  
                      } else {
                          totalDamage[teams[index]['team']['name']] = damage
                      }
                      damage = 0
                    if ((teams[index]['turns']).length > 0 ){
                    
                        let turns = (teams[index]['turns'])
                        turns.forEach(function(element){
                         
                          if (element['lossOfControl']){
                        
                            if (teams[index]['team']['name'] in loseControl){
                                loseControl[teams[index]['team']['name']] = loseControl[teams[index]['team']['name']] +1
        
                            } else {
                                loseControl[teams[index]['team']['name']] = 1
                            }
                          }
  
                        })
                    }
   

            });
        };
        Object.keys(winners).forEach(key => {
            barData['values'].push({"name": key ,"wins": winners[key], "damage": totalDamage[key], "losecontrol": loseControl[key]})
       
        })
     

        });
        
        return (
        <div className="graphs">
             <VegaLite spec={spec} data={barData} />
             <VegaLite spec={spec2} data={barData} />
             <VegaLite spec={spec3} data={barData} />
            </div>
        )
    }
}

export default Wins;
