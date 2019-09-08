'use strict'
import React from 'react';
import statsjson from '../Assets/all_games'
import GraphComponent from './GraphComponent';


class Wins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.listCompletedGames = this.listCompletedGames.bind(this);
    this.weaponused = this.weaponused.bind(this);
    this.killsanddamage = this.killsanddamage.bind(this);
    this.utilityused = this.utilityused.bind(this)
  }
  listCompletedGames(){
  let listOfCompletedGames = []
    Object.keys(statsjson).forEach(key => {
      if (statsjson[key]['gameCompleted']){
        listOfCompletedGames.push(statsjson[key]['name'])
      }
    });
    return listOfCompletedGames;
  }

  weaponused(player){
    let weaponsUsed = {}
    Object.keys(statsjson).forEach(key => {
      if (statsjson[key]['gameCompleted']){
        if (statsjson[key]['gameteams']){
          (statsjson[key]['gameteams']).forEach(function (item) {
            if (item['team']['name'] === player){
            if (item['turns'].length > 0){
              (item['turns']).forEach(function (index) {
                if (index['weapon'] !== null){
            
                if (index['weapon']['name'] in weaponsUsed){
                  weaponsUsed[index['weapon']['name']] = weaponsUsed[index['weapon']['name']] +1

              } else {
                  weaponsUsed[index['weapon']['name']] = 1
              }
                }
              })
            }
          }
          });
      }
    }
  });
  return weaponsUsed
  }
  utilityused(player){
    let utilityUsed = {}
    let totalTurns = 0
    Object.keys(statsjson).forEach(key => {
      if (statsjson[key]['gameCompleted']){
        if (statsjson[key]['gameteams']){
          (statsjson[key]['gameteams']).forEach(function (item) {
            if (item['team']['name'] === player){
            if (item['turns'].length > 0){
              (item['turns']).forEach(function (index) {
                totalTurns += 1;
                if (index['turnutilityweapons'] !== null && index['turnutilityweapons'].length > 0){
                  (index['turnutilityweapons']).forEach(function(element) {
                    if (element['utilityweapon']['name'] in utilityUsed){
                      console.log(element['numberOfFires'])
                      utilityUsed[element['utilityweapon']['name']] = utilityUsed[element['utilityweapon']['name']] + element['numberOfFires']

              } else {
                  utilityUsed[element['utilityweapon']['name']] = element['numberOfFires']
              }
                })
                }
              })
            }
          }
          });
      }
    }
  });
Object.keys(utilityUsed).forEach(key => {
  utilityUsed[key] = utilityUsed[key] / totalTurns
})
  return utilityUsed
  }

  killsanddamage(player){
    let killsanddamage= {}
    Object.keys(statsjson).forEach(key => {
      if (statsjson[key]['gameCompleted']){
        if (statsjson[key]['gameteams']){
          (statsjson[key]['gameteams']).forEach(function (item) {
            if (item['team']['name'] === player){
            if (item['turns'].length > 0){
              (item['turns']).forEach(function (index) {
                if (index['turndamages'] !== null && index['turndamages'].length >0  ){
                  (index['turndamages']).forEach(function (element){
                    if (element['team']['name'] in killsanddamage){
                     
                      killsanddamage[element['team']['name']]['kills'] = killsanddamage[element['team']['name']]['kills'] + element['kills']
                      killsanddamage[element['team']['name']]['damage'] = killsanddamage[element['team']['name']]['damage'] + element['damage']
    
                  } else {
                    killsanddamage[element['team']['name']] = {'kills': element['kills'], 'damage': element['damage']}
                  }
                  })
                }
              })
            }
          }
          });
      }
    }
  });

    return killsanddamage
  }
  
    render(){  
      let gamesList = this.listCompletedGames();
      let allplayers = this.props.listAllPlayers[0];
      let gamesplayed = this.props.listAllPlayers[1];
        let loseControl = {}
        let totalDamage ={}
        let winners = {}
        let barData = {"values": [
          ]
        }
        if (this.props.personOrGroup === 'group'){
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
                }
              });
              Object.keys(winners).forEach(key => {
                let utilities = this.utilityused(key)
                barData['values'].push({"name": key ,"wins": winners[key], "damage": totalDamage[key], "losecontrol": loseControl[key], "gamesplayed": gamesplayed[key], "ninjaRope": utilities['Ninja Rope']})
            })
        } else if (this.props.personOrGroup ==='personal') {
        this.personalData = {}
        this.weapons = {}
        allplayers.forEach((element) => {
          let personalVendetta = this.killsanddamage(element);
          let personalWeapons = this.weaponused(element);
          this.personalData[element]= {'values': []}
          Object.keys(personalVendetta).forEach(key => {
            this.personalData[element]['values'].push({"name": key ,"kills": personalVendetta[key]['kills'], "damage": personalVendetta[key]['damage'], "weapons": personalWeapons})
          })
          this.weapons[element] = {'values': []}
          Object.keys(personalWeapons).forEach(key => {     
            this.weapons[element]['values'].push({"weapon": key ,"usage": personalWeapons[key]})
          })

        });
        if (this.props.personalstats === 'weapons' ){
          
          barData = this.weapons[this.props.focusOnPlayer]
    
        } else{
       barData = this.personalData[this.props.focusOnPlayer]

        }
      
      }
        return (
          (this.props.personalstats === 'weapons' ?
        <div className="graphs">
             <GraphComponent xaxis="weapon" yaxis = "usage" graphtype={barData} />
            </div>
            :
            <div className="graphs">
            <GraphComponent xaxis="name" yaxis = {this.props.graphType} graphtype={barData} />
           </div>
          )
        )
    }
}

export default Wins;
