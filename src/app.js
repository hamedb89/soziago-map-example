import {h, render, Component, cloneElement} from 'preact';
import gm from 'google-maps';

const params = {v: '3.exp', key: 'AIzaSyDMXTa0RywA0ZfrwilGGIlR1Qx0aRc98CQ'};

gm.KEY = params.key;
gm.VERSION = params.v;

const coords = {
	lat: 53.5510846,
	lng: 9.99368179999999
};

class Marker extends Component {

	componentDidMount() {
		this.marker = this.renderMarker();
		this.infoWindow = this.renderInfoWindow();
		this.addEvents();
	}

	addEvents() {
		this.marker.addListener('click', (e) => this.infoWindow.open(this.props.map, this.marker));
	}

	renderInfoWindow() {
		return new google.maps.InfoWindow({
			content: this.props.children.join()
		});
	}

	renderMarker() {
		let { map, google, title, position } = this.props;

		return new google.maps.Marker({
			map: map,
			position: position || coords,
			title: title
		});
	}
}

class Map extends Component {

	componentDidMount(){
		gm.load(google => {
			this.google = google;
			this.renderMap();
			this.renderChildren();
			this.setState({
				hasMapLoaded: true
			});
		});
	}

	renderMap() {
		this.map = new google.maps.Map(this.mapEl, {
			center: coords,
			zoom: parseFloat(this.props.zoom) || 8
		});
	}

	renderChildren() {
		return this.children = this.props.children.map(c => {
			return cloneElement(c, {
				map: this.map,
				google: this.google
			});
		});
	}

	render() {
		return <div ref={e => this.mapEl = e}>
			{ this.children }
		</div>
	}
}

class App extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	renderVenues() {
		return this.props.models.map(model => {
			const location = model.venue.location;
			return <Marker position={location}>{model.venue.name}</Marker>
		});
	}

	render() {
		return (
			<Map zoom="12">
				{ this.renderVenues() }
			</Map>
		);
	}
};

fetch("https://api.foursquare.com/v2/venues/explore?v=20131016&query=kindergarten&near=hamburg&client_id=JAH43ONAEZTR3CRQRYT5FIV4BYRIFZREFRBI4HHR4PQBUGKY&client_secret=YDKO3F14ZEXICN1C5FYL4MJAZV3N5STXSDH41ITEJSEVTRXL")
	.then(response => {
		return response.json();
	})
	.then(json => {
		render(<App models={json.response.groups[0].items} />, document.getElementById('Map'));
	});
