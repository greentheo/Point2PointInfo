import {inject, computedFrom} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {AppConfig} from './config/appconfig';
import {AppData} from './dataservices/appdata';
import {LocationDataService} from './dataservices/locationdataservice';
import {DeviceEvents} from './deviceservices/deviceevents';
import {DeviceAcceleration} from './deviceservices/deviceacceleration';
import {DeviceLocation} from './deviceservices/devicelocation';

@inject(EventAggregator, AppConfig, AppData, LocationDataService, DeviceEvents, DeviceAcceleration, DeviceLocation)
export class Collector {

  constructor(eventAggregator, config, appData, locationDataService, deviceEvents, deviceAcceleration, deviceLocation) {
    this.config = config;
    this.appData = appData;
    this.locationDataService = locationDataService;
    this.deviceEvents = deviceEvents;
    this.deviceAcceleration = deviceAcceleration;
    this.deviceLocation = deviceLocation;

    // note: in aurelia docs, example shows setting this to an object property.
    // however, when I do this, it doesn't receive events.
    // Further research found the example contact list.  In that code, it does NOT
    // set the injected aggregator to an object property, but uses it directly
    // in the constructor code.  THIS pattern works.
    // this.eventAggregator = eventAggregator;

    this.lastAccelerometer = this.deviceAcceleration.dummyData;
    this.lastLocation = this.deviceLocation.dummyData;

    // here's all of the events to listen for:

    // if the device is already ready, start watching.  Otherwise,
    // wait for it for to report ready, THEN start watching.
    if (this.appData.deviceReady) {
      this.startWatching();
    } else {
      eventAggregator.subscribe('deviceready', () => {

        this.appData.deviceReady = true;
        this.deviceReady = true;

        this.startWatching();
      });
    }

    eventAggregator.subscribe('location.capture', data => {
      this.lastLocation = data;
      this.lastLocation.accelerometer = [];

      if (this.collectionInProgress) this.locationData.push(this.lastLocation);
    });

    eventAggregator.subscribe('location.unsupported', () => this.locationUnsupported = true);

    eventAggregator.subscribe('acceleration.capture', data => {

      if (!this.lastLocation) return;
      if (!this.lastLocation.accelerometer) return;

      // so we can attribute specific accelerometer stuff to a location, we'll add all
      // accelerometer data to lastLocation
      this.lastLocation.accelerometer.push(data);

      this.lastAccelerometer = data;
    });

    eventAggregator.subscribe('acceleration.error', data => {
      if (this.collectionInProgress) {
        this.accelerometerErrors.push(data);
      }
    });

    eventAggregator.subscribe('acceleration.unsupported', () => this.accelerationUnsupported = true);
  }

  userName = '';
  buttonCaption = 'Start';
  collectionStart = null;
  collectionEnd = null;
  lastAccelerometer = null;
  accelerometerErrors = [];
  lastLocation = null;
  locationData = [];
  locationErrors = [];
  locationUnsupported = false;
  accelerationUnsupported = false;
  collectionInProgress = false;
  sendingData = false;
  deviceReady = false;
  testLocationData = false;

  toggleCollection() {
    var toggle = { Start: 'End', End: 'Start' };
    var command = this.buttonCaption;
    this.buttonCaption = toggle[this.buttonCaption];
    this.collectionInProgress = command === 'Start';
  }

  startWatching() {
    this.deviceLocation.start();
    this.deviceAcceleration.start();
  }

  endWatching() {
    this.deviceLocation.end();
    this.deviceAcceleration.end();
  }

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
  }

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
  }

  clearLocationData() {
    this.locationData = [];
  }

  @computedFrom('userName', 'deviceReady')
  get canCollect() {
    return this.userName != '' && this.deviceReady;
  }

  @computedFrom('locationData', 'collectionInProgress')
  get canSubmitData() {
    return this.locationData.length > 0 && !this.collectionInProgress;
  }

  @computedFrom('locationUnsupported', 'accelerationUnsupported')
  get oneOrMoreUnsupported() {
    return this.locationUnsupported || this.accelerationUnsupported;
  }

  @computedFrom('collectionInProgress', 'testLocationData')
  get showTestDataButton() {
    return this.collectionInProgress && this.testLocationData;
  }

  canActivate() {
    var isAuth = this.appData.isAuthenticated();
    if (!isAuth) alert('You need to login first');
    return isAuth;
  }

  activate() {
    this.userName = this.appData.userName;
    this.locationData = this.appData.locationData;
    this.locationErrors = this.appData.locationErrors;
    this.accelerometerData = this.appData.accelerometerData;
    this.accelerometerErrors = this.appData.accelerometerErrors;
    this.deviceReady = this.appData.deviceReady;
    this.testLocationData = this.config.testLocationData;

    console.log("Device ready on activation: " + this.deviceReady);

    if (!this.deviceReady) {
      console.log("Device NOT ready, binding events");

      this.deviceEvents.bindEvents();

      //this.eventAggregator.subscribe('deviceready', () => {
      //  console.log("Collector:  DeviceReady event FIRED.");
      //
      //  this.appData.deviceReady = true;
      //  this.deviceReady = true;
      //
      //  this.startWatching();
      //});
    }
  }

  deactivate() {
    this.endWatching();
  }
}
