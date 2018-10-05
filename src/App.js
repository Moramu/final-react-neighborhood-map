import React, { Component } from 'react';
import MetaTags from 'react-meta-tags';
import MapContainer from "./components/MapContainer"
import MenuContainer from "./components/MenuContainer"
import './App.css';

const googleApiKey = "Your APIkey"
const foursquareID = "Your APIkey"
const foursquareSecret = "Your APIkey"

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			locations: [
				{
                    'name': 'Willow Grove Park Mall',
                    'latitude': 40.1422472,
                    'longitude': -75.12231700000001,
                },
                {   
                    'name': 'Franklin Mills Mall',
                    'latitude': 40.0874923,
                    'longitude': -74.96162270000002,
                },
                {
                    'name': 'Wissahickon Valley Park',
                    'latitude': 40.0562108,
                    'longitude': -75.217331,
                },
                {
                    'name': 'Six Flags Great Adventure',
                    'latitude': 40.1415382,
                    'longitude': -74.44769610000003,
                },
                {
                    'name': 'Ship Boottom',
                    'latitude': 39.642897,
                    'longitude': -74.18041590000001,
                },
                {
                    'name': 'Niagara Falls',
                    'latitude': 43.0962143,
                    'longitude': -79.0377388,
                }

            ],
			'map': '',
        	'infowindow': '',
        	'prevstate': ''
		}
		this.initMap = this.initMap.bind(this);
		this.closeInfoWindow = this.closeInfoWindow.bind(this);
		this.openInfoWindow = this.openInfoWindow.bind(this);
	}

    //Async loading script
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
        this.loadMapJS('https://maps.googleapis.com/maps/api/js?key='+googleApiKey+'&callback=initMap')
        window.gm_authFailure = this.gm_authFailure
    }

    componentWillMount() {
        this.setState({
            'locations': this.state.locations
        });
    }

    gm_authFailure(){
        window.alert("Google Maps error!")
    }

    //initialization map with markers
    initMap() {
    	var self = this
        var mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            center: {lat: 39.9525839, lng: -75.16522150000003},
            zoom: 10,
            mapTypeControl: false,
            streetViewControl: false
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        var locationsMarker = [];
        this.state.locations.forEach(function (location) {
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });
            location.longname = self.getLocationDetails();
            location.marker = marker;
            location.display = true;
            locationsMarker.push(location);
            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });        
        })

        this.setState({
            'locations': locationsMarker
        });

    	window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });
        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });   
    } 

    //geting data for marker using Geocode
    getLocationDetails () {
        var locationsDetails = []
        this.state.locations.forEach(function (location) {
            var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+location.latitude+","+location.longitude+"&key="+googleApiKey
            fetch(url).then(
                 function (response) {
                    response.json().then(function (data) {
                       if(data.status !== "REQUEST_DENIED" && data.status !=="OVER_QUERY_LIMIT"){
                        const address = data.results[0].formatted_address;
                        location.longname = address;
                        locationsDetails.push(location);
                       } 
                    });
                }
            )})
        this.setState({
            'locations': locationsDetails
        });
    }


    openInfoWindow(marker) {
        //console.log(this.state.locations)
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

    getFoursquareQuery(marker) {
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + foursquareID + "&client_secret=" + foursquareSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        return url 
    }

    getMarkerInfo(marker) {
        var self = this;
        var infoMarker = this.state.locations
        var info = infoMarker.filter((im) => im.latitude === marker.getPosition().lat() && im.longitude === marker.getPosition().lng())
        fetch(this.getFoursquareQuery(marker))
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Sorry data can't be loaded");
                        return;
                    }
                    response.json().then(function (data) {
                        var location_data = data.response.venues[0];
                        var readMore = '<p><a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More on Foursquare Website</a></p>'
                        self.state.infowindow.setContent('<div class="infoWindow">'+info[0].longname + readMore+'</div>');
                    });
                }
            )
            .catch(function (err) {
                self.state.infowindow.setContent("Sorry data can't be loaded");
            });
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

  	const { locations } = this.state
    
    return (
      <div className="main">
      <MetaTags>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </MetaTags>
      	<MenuContainer 
      		locations={locations}
      		openInfoWindow={this.openInfoWindow}
            closeInfoWindow={this.closeInfoWindow}
      	/>
        <MapContainer />
      </div>
    )
  }
}

export default App;
