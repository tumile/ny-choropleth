import React from "react"
import { Redirect } from "react-router-dom"
import "../styles/Details.css"

const Details = props => {
    const { extremum } = props
    if (!extremum) return <Redirect to="/" />
    const {
        zipCode,
        poName,
        borough,
        population,
        housing,
        income,
        education,
        latitude,
        longitude
    } = props.location.state

    return (
        <div className="container">
            <div className="col-left">
                <i
                    className="fas fa-arrow-left"
                    onClick={() => props.history.push("/")}
                />
                <h3>Zip Code: {zipCode}</h3>
                <p>{poName + ", " + borough}</p>
                <img
                    alt="maps"
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=400x300&key=AIzaSyBfHGmkF7zZOV-K6Mwd36F4xRIGYUWOqeY`}
                />
            </div>
            <div className="col-right">
                <Item
                    icon={<i className="fas fa-users" />}
                    data={population}
                    extremes={extremum.population}
                />
                <Item
                    icon={<i className="fas fa-home" />}
                    data={housing}
                    extremes={extremum.housing}
                />
                <Item
                    icon={<i className="fas fa-hand-holding-usd" />}
                    data={income}
                    extremes={extremum.income}
                />
                <Item
                    icon={<i className="fas fa-graduation-cap" />}
                    data={education}
                    extremes={extremum.education}
                />
            </div>
        </div>
    )
}

const Item = ({ icon, data, extremes }) => {
    let value = Number(data.value)
    return (
        <div style={{ marginBottom: "2.5em" }}>
            <p style={{ fontSize: "larger" }}>
                {icon} {data.label}
            </p>
            <h3>{value}</h3>
            <div className="slider-container">
                <span>{extremes.min}</span>
                <input
                    disabled
                    className="slider"
                    type="range"
                    min={extremes.min}
                    max={extremes.max}
                    value={value}
                />
                <span>{extremes.max}</span>
            </div>
        </div>
    )
}

export default Details
