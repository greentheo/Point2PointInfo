import {inject} from 'aurelia-framework';
import {LocalService} from './localservice';

let auth_token = 'authToken';

/**
 * Provides data at an app level.  Uses localStorage for values.
 */
@inject(LocalService)
export class AppData {

  constructor(localService) {
    this.localService = localService;
  }

  AUTH_TOKEN = auth_token;

  get userName() {
    return this.localService.getItem('userName') || ''; 
  }
  
  set userName(value) {
    this.localService.setItem('userName', value);
  }
  
  get locationData() {
    return this.localService.getItem('locationData') || [];
  }
  
  set locationData(value) {
    this.localService.setItem('locationData', value);  
  }

  get locationErrors() {
    return this.localService.getItem('locationErrors') || [];
  }

  set locationErrors(value) {
    this.localService.setItem('locationErrors', value);
  }

  get accelerationData() {
    return this.localService.getItem('accelerationData') || [];
  }

  set accelerationData(value) {
    this.localService.setItem('accelerationData', value);
  }

  get accelerometerErrors() {
    return this.localService.getItem('accelerometerErrors') || [];
  }

  set accelerometerErrors(value) {
    this.localService.setItem('accelerometerErrors', value);
  }

  get deviceReady() {
    return this.localService.getItem('deviceReady') || false;
  }

  set deviceReady(value) {
    this.localService.setItem('deviceReady', value);
  }

  isAuthenticated() {
    return this.localService.getItem(auth_token) != null;
  }
}
