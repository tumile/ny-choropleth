import React, { Component } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import NYZipCodes from "../nyzipcodes.json"
import Details from "./Details"
import Map from "./Map"

class App extends Component {
    state = {
        metric: "population",
        data: null,
        extremum: null
    }

    componentDidMount() {
        const data = JSON.parse(JSON.stringify(NYZipCodes)),
            features = data.features

        const extremum = features.reduce(
            (acc, val) => {
                for (let i in acc) {
                    let value = Number(val.properties[i].value)
                    if (value < acc[i].min) acc[i].min = value
                    if (value > acc[i].max) acc[i].max = value
                }
                return acc
            },
            {
                population: {
                    min: Number.MAX_VALUE,
                    max: Number.MIN_VALUE
                },
                income: {
                    min: Number.MAX_VALUE,
                    max: Number.MIN_VALUE
                },
                housing: {
                    min: Number.MAX_VALUE,
                    max: Number.MIN_VALUE
                },
                education: {
                    min: Number.MAX_VALUE,
                    max: Number.MIN_VALUE
                }
            }
        )
        this.setState({ data, extremum })
    }

    setMetric = metric => {
        this.setState({ metric })
    }

    render() {
        return (
            <Router>
                <Route
                    exact
                    path="/"
                    render={props => (
                        <Map
                            {...props}
                            metric={this.state.metric}
                            setMetric={this.setMetric}
                            data={this.state.data}
                            extremum={this.state.extremum}
                        />
                    )}
                />
                <Route
                    path="/details"
                    render={props => (
                        <Details {...props} extremum={this.state.extremum} />
                    )}
                />
            </Router>
        )
    }
}

export default App
