
import React, { Component } from 'react';
import {DebounceInput} from 'react-debounce-input'

class MenuCointainer extends Component {

	state = {
		query: '',
		locations: ''
	}

	componentWillMount() {
        this.setState({
            'locations': this.props.locations
        });
    }

	updateQuery = (query) => {
		this.setState({query})
	}

	searchLocations(event) {
        var locations = [];
        this.props.locations.forEach(function (location) {
        	location.marker.setVisible(false);
        	if (location.longname.toLowerCase().indexOf(event.toLowerCase()) >= 0){
        		location.marker.setVisible(true);
        		locations.push(location);
        	}	
        })
        this.setState({
        	'locations': locations,
        	'query': event
    	})
        }

  	render() {

  	const { query } = this.state
  	const { locations } = this.state
    
    return (
      <div className="menuContainer">
      	<div className="search">		
			<form className="input-search">
        		<DebounceInput
            		minLength={1}
            		debounceTimeout={300}
            		placeholder="enter place"
            		value={query}
            		onChange={(event) => this.searchLocations(event.target.value)}
        			/>
			</form>
		</div>
		<div className="listPlaces">
			{locations.map((location,index) => (
				<ul key={index}>
					<li
					onClick={this.props.openInfoWindow.bind(this, locations[index].marker)}								
					 >{location.name}</li>
				</ul>
			))}
		</div>
      </div>
    )
  }
}

export default MenuCointainer;
