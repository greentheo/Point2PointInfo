import {inject} from 'aurelia-framework';
import {computedFrom} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {AppData} from 'dataservices/appdata';
import {LocationDataService} from 'dataservices/locationdataservice';
import {DeviceAcceleration} from 'deviceservices/deviceacceleration';
import {DeviceLocation} from 'deviceservices/devicelocation';

@inject(EventAggregator, AppData, LocationDataService, DeviceAcceleration, DeviceLocation)
export class Collector {

  userName = '';
  buttonCaption = 'Start';
  collectionStart = null;
  collectionEnd = null;
  lastAccelerometer = this.deviceAcceleration.dummyData;
  accelerometerErrors = [];
  lastLocation = this.deviceLocation.dummyData;
  locationData = [];
  locationErrors = [];
  locationUnsupported = false;
  accelerationUnsupported = false;
  collectionInProgress = false;
  sendingData = false;

  toggleCollection() {
    var toggle = { Start: 'End', End: 'Start' };
    var command = this.buttonCaption;
    this.buttonCaption = toggle[this.buttonCaption];
    this.collectionInProgress = command === 'Start';
  };

  startWatching() {
    
    // geolocation

    this.deviceLocation.start();

    this.eventAggregator.subscribe('location.capture', data => {
      this.lastLocation = data;
      this.lastLocation.accelerometer = [];

      if (this.collectionInProgress) this.locationData.push(this.lastLocation);
    });

    this.eventAggregator.subscribe('location.unsupported', () => this.locationUnsupported = true);

    // acceleration

    this.deviceAcceleration.start();

    this.eventAggregator.subscribe('acceleration.capture', data => {

      if (!this.lastLocation) return;
      if (!this.lastLocation.accelerometer) return;

      // so we can attribute specific accelerometer stuff to a location, we'll add all
      // accelerometer data to lastLocation
      this.lastLocation.accelerometer.push(data);

      this.lastAccelerometer = data;
    });

    this.eventAggregator.subscribe('acceleration.error', data => { 
      if (this.collectionInProgress) {
        this.accelerometerErrors.push(data);
      }
    });

    this.eventAggregator.subscribe('acceleration.unsupported', () => this.accelerationUnsupported = true);
  };

  endWatching() {
    this.deviceLocation.end();
    this.deviceAcceleration.end();
  };

  addTestLocationData() {
    this.locationData.push({
      timestamp: new Date(),
      coords: {
        latitude: 40.009032,
        longitude: -105.097926,
        altitude: 1613.39,
        accuracy: 3,
        altitudeAccuracy: 3,
        heading: 90,
        speed: 0.5
      },
      accelerometer: [
        { x: 0.123, y: 0.234, z: 0.345, timestamp: new Date() },
        { x: 0.01, y: 0.345, z: 0.5, timestamp: new Date() },
        { x: 0.234, y: -0.5, z: -0.321, timestamp: new Date() }
      ]
    });
  };

  submitLocationData() {
    this.sendingData = true;
  
    this.locationDataService.postLocationData(
  
      // data to send
      {
        locationData: this.locationData,
        userEmail: this.userName
      },

      successResponse => {
        this.sendingData = false;
        this.locationData = [];     // TODO: do we want to do this automatically or let the user decide?

        // TODO: is there an Aurelia equivalent to the old durandal dialog?
        alert('Your location data was saved successfully.');
      },

      errResponse => {
        this.sendingData = false;
  
        // TODO: find out where there message comes from
        var errorMessage = errResponse.message;

        // TODO: is there an Aurelia equivalent to the old durandal dialog?
        alert('Could not save your location data!  Error: ' + errorMessage);
      });
  };

  clearLocationData() {
    this.locationData = [];
  };

  @computedFrom('userName')
  get canCollect() {
    return this.userName != '';
  };

  @computedFrom('locationData', 'collectionInProgress')
  get canSubmitData() {
    return this.locationData.length > 0 && !this.collectionInProgress;
  };

  @computedFrom('locationUnsupported', 'accelerationUnsupported')
  get oneOrMoreUnsupported() {
    return this.locationUnsupported || this.accelerationUnsupported;
  };

  // TODO: instead of defining "locationSupported", just bind to !locationUnsupported

  canActivate() {
    var isAuth = this.appData.isAuthenticated();
    if (!isAuth) alert('You need to login first');
    return isAuth;
  };

  activate() {
    this.userName = this.appData.userName;
    this.locationData = this.appData.locationData;
    this.locationErrors = this.appData.locationErrors;
    this.accelerometerData = this.appData.accelerometerData;
    this.accelerometerErrors = this.appData.accelerometerErrors;
  
    this.startWatching();
    // this.startWatching.apply(this);   // not necessary?
  };

  deactivate() {
    this.endWatching();
  };

  constructor(eventAggregator, appData, locationDataService, deviceAcceleration, deviceLocation) {
    this.eventAggregator = eventAggregator;
    this.appData = appData;
    this.locationDataService = locationDataService;
    this.deviceAcceleration = deviceAcceleration;
    this.deviceLocation = deviceLocation;
  }
}
