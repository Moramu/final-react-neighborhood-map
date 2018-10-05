import React, { Component } from 'react';


class MapContainer extends Component {

  	render() {
    	return (
      		<div className="mapContainer">
      		<main role="presentation"  aria-label="Map showing places" className="main-container">
    			<div id="map" aria-label="map"></div>
    		</main>
      		</div>
    	)
  	}
}

export default MapContainer




