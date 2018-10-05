
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
    this.props.closeInfoWindow()
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
      <div className="menuContainer" aria-label="Location Menu">
      <div className="search">		
			 <form className="input-search" aria-label="Search location" >
        		<DebounceInput
                aria-label="Search location"
            		minLength={1}
            		debounceTimeout={300}
            		placeholder="search"
            		value={query}
            		onChange={(event) => this.searchLocations(event.target.value)}
        			/>
			</form>
		</div>
		<div className="listPlaces" aria-label="List locations">
			{locations.map((location,index) => (
				<ul key={index} aria-label="list locations">
					<li 
          aria-label={location.name}
          tabIndex="2"
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
