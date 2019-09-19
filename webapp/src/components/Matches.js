import React from 'react';
import VegaLite from 'react-vega-lite';

import transformMatchData from '../transformMatchData'

const spec = yaxis => ({
    "encoding": {
        "x": {"field": "round", "type": "temporal"},
        "y": {"field": yaxis, "type": "quantitative"},
        "color": {"field": "name", "type": "nominal"}
    },
    "mark": {
        "interpolate": "linear",
        "type": "line",
        // "filled": true,
        // "fillOpacity": 0.6,
    }
})

const flattenTurns = (turns, statkey) => {
    let flattenedTurns = []
    console.log(turns.turn)
    Object.keys(turns).forEach((key) => {
        for (let ii = 0; ii < turns[key].round.length; ii++) {
            flattenedTurns.push({name: turns[key].name, round: turns[key].round[ii], [statkey]: turns[key][statkey][ii]})
        }
    })
    return {values: flattenedTurns}
}

const MatchPicker = (pickerProps) => {
    let matchRange = Array.from(Array(pickerProps.matchCount).keys())
    return (
        <div>
            <div>Hello</div>
            <div className="form-group">
                <select name="currentMatch" className="form-control" value={pickerProps.currentMatch} onChange={pickerProps.changeMatch}>
                    {matchRange.map((ii) => (
                            <option value={ii} key={'matchOption' + ii}>{ii}</option>
                        ))
                    }
                </select>
            </div>
        </div>
    )
}

class Matches extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentMatch: 0,
            matchCount: this.props.matches.length,
            matches: this.props.matches,
            matchData: transformMatchData(this.props.matches[0])
        }
        this.changeMatch = this.changeMatch.bind(this)
        // console.log('matches = ' + this.props.matches)
    }

    componentDidUpdate() {
        // this.setState({ })
    }

    getTurnStats(match) {
        let turnsByTeam = {}
        match.gameteams.forEach((team) => {
            turnsByTeam[team.team.id] = {
                name: team.team.name,
                damage: [],
                ropesFired: [],
                
            }
        })
    }

    changeMatch(event) {
        this.setState({ 
            currentMatch: event.target.value,
            matchData: transformMatchData(this.state.matches[event.target.value])
        })
    }

    render() {
        return (
            <div>
                <div>Current Match: {this.state.currentMatch}</div>
                <MatchPicker matchCount={this.state.matchCount} currentMatch={this.state.currentMatch} changeMatch={this.changeMatch}/>
                <VegaLite className="graphs" spec={spec('totalDamage')} data={flattenTurns(this.state.matchData, 'totalDamage')} />
                <VegaLite className="graphs" spec={spec('ropesFired')} data={flattenTurns(this.state.matchData, 'ropesFired')} />
            </div>
        )
    }

}

export default Matches