import React from 'react';
import statsjson from '../Assets/all_games'
import VegaLite from 'react-vega-lite';

class Damage extends React.Component {
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
              "y": {"field": "damage", "type": "quantitative"}
            }
          };
          
 
        let totalDamage = {}
        let barData = {"values": [
          ]
        }
        Object.keys(statsjson).forEach(key => {
            if (statsjson[key]['gameCompleted']){
              let damage = 0
                var teams = statsjson[key]['gameteams']
                Object.keys(teams).forEach(index => {
                  if ((teams[index]['turns']).length > 0 ){
                    
                      let turns = (teams[index]['turns'])
                      turns.forEach(function(element){
                       
                        element['turndamages'].forEach(function(x){
                          console.log(x['damage'])
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
                         // let totalDamage = teams[index]['turns']['turndamages']
                      // Object.keys(overallDamage).forEach(n => {
                      //       console.log(overallDamage[n])
                      //   });
            });
        };
        Object.keys(totalDamage).forEach(key => {
            barData['values'].push({"name": key ,"damage": totalDamage[key]})
        })

        });
        
        return (
        <div className="graphs">
             <VegaLite spec={spec} data={barData} />

            </div>
        )
    }
}

export default Damage;
