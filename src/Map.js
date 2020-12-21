import React from "react";
import "./Map.css";
import {MapContainer , TileLayer } from "react-leaflet"
import { showDataOnMap } from "./util";

function aap({countries, casesType, center, zoom}){
    return(
        <div className="map">
            <MapContainer center={center} zoom={zoom}>
            <TileLayer
                url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {showDataOnMap(countries, casesType)}
            </MapContainer>

        </div>
    );
}
export default aap;
