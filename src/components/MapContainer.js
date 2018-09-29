import React, { Component } from 'react';
import Geocode from "react-geocode";


class MapContainer extends Component {

	apiKey () {
		const key = "AIzaSyCPi0o_tjNjKYYDe_6nYg82r0leI7kKlOE"
		return key
	}

	constructor(props) {
		super(props);
		this.state = {
			locations: [
				{
                    'latitude': 40.140171522163406,
                    'longitude': -75.12365341186523,
                },
                {
                    'latitude': 40.0874923,
                    'longitude': -74.96162270000002,
                },
                {
                    'latitude': 40.0562108,
                    'longitude': -75.217331,
                },
                {
                    'latitude': 40.1415382,
                    'longitude': -74.44769610000003,
                },
                {
                    'latitude': 39.642897,
                    'longitude': -74.18041590000001,
                }

            ],
			'map': '',
        	'infowindow': '',
        	'prevstate': ''
		}
		this.initMap = this.initMap.bind(this);
	}

	loadMapJS(src) {
    	var ref = window.document.getElementsByTagName("script")[0];
    	var script = window.document.createElement("script");
    	script.src = src;
    	script.async = true;
    	script.onerror = function () {
        	document.write("Google Maps can't be loaded");
    	};
    	ref.parentNode.insertBefore(script, ref);
	}

	componentDidMount() {
        window.initMap = this.initMap;
        this.loadMapJS('https://maps.googleapis.com/maps/api/js?key='+this.apiKey()+'&callback=initMap')
    }

    initMap() {
    	var self = this
        var mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";

        var map = new window.google.maps.Map(mapview, {
            center: {lat: 39.9525839, lng: -75.16522150000003},
            zoom: 10,
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        var locationsDetails = [];
        this.state.locations.forEach(function (location) {
        	Geocode.setApiKey(self.apiKey());
    		Geocode.fromLatLng(location.latitude, location.longitude).then(
  				response => {
    				const address = response.results[0].formatted_address;
    				location.longname = address;
            		locationsDetails.push(location);
  				})
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });

            
        })

    	window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });
        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });      

        this.setState({
            'locations': locationsDetails
        });

        console.log(this.state)
    } 

    openInfoWindow(marker) {
    	this.closeInfoWindow()
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Loading Data...');
        this.state.map.setCenter(marker.getPosition());
        this.getMarkerInfo(marker);
    }

    getMarkerInfo(marker) {
    	var infoMarker = this.state.locations
    	var info = infoMarker.filter((im) => im.latitude === marker.getPosition().lat() && im.longitude === marker.getPosition().lng())
    	this.state.infowindow.setContent(
    			info[0].longname
    		);	
    }

    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }   


  	render() {

    	return (
      		<div className="mapContainer">
    			<div id="map"></div>
      		</div>
    	)
  	}
}

export default MapContainer




