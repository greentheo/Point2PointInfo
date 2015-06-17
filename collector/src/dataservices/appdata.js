import {inject} from 'aurelia-framework';
import {LocalService} from './localservice';

let auth_token = 'authToken';

@inject(LocalService)
export class AppData {

  AUTH_TOKEN = auth_token;

  userName = '';
  collectionStart = null;
  collectionEnd = null;
  locationData = [];
  locationErrors = [];
  accelerometerData = [];
  accelerometerErrors = [];
  deviceReady = false;

  isAuthenticated() { return this.localService.getItem(auth_token) != null; }

  constructor(localService) {
    this.localService = localService;
  }
}
