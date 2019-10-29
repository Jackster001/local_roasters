import React from 'react'
import { TouchableOpacity, Text, Dimensions, StyleSheet, View } from 'react-native'
import { Container, Header, Content, Footer, FooterTab, Button, Form, Item, Picker, Card, CardItem, Body, Left } from 'native-base';
import MapView,{ PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
export default class CoffeeMap extends React.Component {
	_isMounted = false;
	constructor(props) {
		super(props);
		this.state = {
			marginBottom: 1,
			initialRegion: [],
		}
	}

    async componentDidMount() {
		this._isMounted = true;
		try {
			await navigator.geolocation.getCurrentPosition(
				async position => {
					const obj = JSON.stringify(position);
					const location = JSON.parse(obj)
					const currLoc = [location[`coords`][`latitude`], location[`coords`][`longitude`]];
					let region = {
						latitude: location[`coords`][`latitude`],
						longitude: location[`coords`][`longitude`],
						latitudeDelta: 0.01,
						longitudeDelta: 0.01
					}
					this.mapView.animateToRegion(region,1000);
					if(this._isMounted){
						this.setState({
							initialRegion:region
						})
					}
				},
				error => Alert.alert(error.message),
				{ timeout: 20000, maximumAge: 1000 }
			);
		} catch (err) {
			console.log(err)
		}
    }
    
	componentWillUnmount() {
		this._isMounted = false;
    }
    
	onMapReady = () => this.setState({ marginBottom: 0 })
	goToProfile(){
		Actions.profile()
	}
	goToHome(){
		Actions.home()
	 }
	render() {
		return (
			<View style={styles.container}>
                <MapView 
                    provider={PROVIDER_GOOGLE}
					onMapReady={this.onMapReady}
					style={[styles.map, { flex: 1, marginBottom: this.state.marginBottom }]}
					initialRegion={{
						latitude: 40.7549,
						longitude: -73.9840,
						latitudeDelta: .08,
						longitudeDelta: .08,
					}}
					showsUserLocation={true}
					showsMyLocationButton={true}
					showsCompass={false}
					loadingEnabled={true}
					ref={ref => { this.mapView = ref }}>
					{this.state.distance}
				</MapView>
				<Footer>
                  <FooterTab>
                     <Button style={styles.navButton} onPress={()=>this.goToHome()}>
                        <Icon size={24} color="white" name="home"></Icon>
                     </Button>
                     <Button style={styles.navButton} >
                        <Icon size={24} color="white" name="map-marker-radius"></Icon>
                     </Button>
                     <Button style={styles.navButton} onPress={()=>this.goToProfile()}>
                     <Icon size={24} color="white" name="account-box"></Icon>
                     </Button>
                  </FooterTab>
               </Footer>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	navButton:{
		backgroundColor: "#9A764E",
		borderRadius: 0
	},
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	}
});