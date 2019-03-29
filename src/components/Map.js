import React, { Component } from "react"
import {
    GoogleMap,
    Marker,
    withGoogleMap,
    withScriptjs
} from "react-google-maps"
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer"
import { MAP } from "react-google-maps/lib/constants"
import { compose, withProps } from "recompose"
import "../styles/Map.css"

class Map extends Component {
    componentDidMount() {
        this.setupMap(this.props.data)
        this.onMetricChange({ target: { value: this.props.metric } })
    }

    setupMap = data => {
        const map = this.map.context[MAP]
        map.data.addGeoJson(data, { idPropertyName: "id" })
        map.data.setStyle(this.styleFeature)
        map.data.addListener("mouseover", e => {
            this.slider.value = e.feature.getProperty("metric")
            e.feature.setProperty("state", "hover")
        })
        map.data.addListener("mouseout", e =>
            e.feature.setProperty("state", "normal")
        )
        map.data.addListener("click", e =>
            this.props.history.push({
                pathname: "/details",
                state: {
                    zipCode: e.feature.getProperty("zipCode"),
                    poName: e.feature.getProperty("poName"),
                    borough: e.feature.getProperty("borough"),
                    population: e.feature.getProperty("population"),
                    income: e.feature.getProperty("income"),
                    housing: e.feature.getProperty("housing"),
                    education: e.feature.getProperty("education"),
                    latitude: e.feature.getProperty("latitude"),
                    longitude: e.feature.getProperty("longitude")
                }
            })
        )
    }

    styleFeature = feature => {
        const { min, max } = this.props.extremum[this.props.metric]
        let low = [5, 69, 54]
        let high = [151, 83, 34]
        let delta = (feature.getProperty("metric") - min) / (max - min)
        let color = []
        for (let i = 0; i < 3; i++) {
            color[i] = (high[i] - low[i]) * delta + low[i]
        }
        let strokeWeight = 0.5,
            fillOpacity = 0.75
        if (feature.getProperty("state") === "hover") {
            strokeWeight = 2
            fillOpacity = 0.5
        }
        return {
            strokeWeight,
            strokeColor: "white",
            fillColor:
                "hsl(" + color[0] + "," + color[1] + "%," + color[2] + "%)",
            fillOpacity
        }
    }

    onMetricChange = e => {
        const metric = e.target.value,
            map = this.map.context[MAP]
        this.props.data.features.forEach(feature => {
            let value = Number(feature.properties[metric].value)
            map.data
                .getFeatureById(feature.properties.id)
                .setProperty("metric", value)
        })
        this.props.setMetric(metric)
    }

    render() {
        const {
            data: { features },
            extremum,
            metric
        } = this.props

        return (
            <div>
                <div className="select-container">
                    <span>Colored by</span>
                    <select
                        className="select"
                        onChange={this.onMetricChange}
                        value={this.props.metric}>
                        <option value="population">Population</option>
                        <option value="housing">Housing</option>
                        <option value="income">Income</option>
                        <option value="education">Education</option>
                    </select>
                    <input
                        ref={ref => (this.slider = ref)}
                        className="slider slider-map"
                        type="range"
                        min={extremum[metric].min}
                        max={extremum[metric].max}
                    />
                </div>
                <GoogleMap
                    ref={ref => (this.map = ref)}
                    defaultZoom={11}
                    defaultCenter={{ lat: 40.685, lng: -73.949997 }}>
                    <MarkerClusterer
                        averageCenter
                        enableRetinaIcons
                        gridSize={50}>
                        {features.map(({ properties: p }) => (
                            <Marker
                                noRedraw
                                key={p.id}
                                label={{
                                    color: "white",
                                    text: p.zipCode
                                }}
                                icon={{
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    scale: 0
                                }}
                                position={{
                                    lat: p.latitude,
                                    lng: p.longitude
                                }}
                            />
                        ))}
                    </MarkerClusterer>
                </GoogleMap>
            </div>
        )
    }
}

export default compose(
    withProps({
        googleMapURL:
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyBfHGmkF7zZOV-K6Mwd36F4xRIGYUWOqeY",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100vh` }} />,
        mapElement: <div style={{ height: `100%` }} />
    }),
    withScriptjs,
    withGoogleMap
)(Map)
