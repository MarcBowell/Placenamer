import React, { Component } from 'react';
import { MapContainer, Popup, TileLayer, CircleMarker } from "react-leaflet";
import '../custom.css';
import 'leaflet/dist/leaflet.css';

export default class MapComponent extends Component {
    render() {
        return (
            <MapContainer center={[51.51, -0.12]} zoom={6} className="map-area">
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {this.props.SearchResults.map(item => this.renderSearchResult(item))}
            </MapContainer>);
    }

    renderSearchResult = (searchItem, index) => {
        return searchItem.Items.map((item, index) => this.renderSearchResultItem(item, searchItem.Colour, index));
    }

    renderSearchResultItem = (item, colour, index) => {
        const colourOption = { color: colour };
        return (
            <CircleMarker key={colour + index} center={[item.latitude, item.longitude]} pathOptions={colourOption} fill={colourOption} radius={4}>
                <Popup>{item.placeName}</Popup>
            </CircleMarker>);
    }
}
