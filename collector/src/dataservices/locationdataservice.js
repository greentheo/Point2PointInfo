import {inject} from 'aurelia-framework';
import {BaseDataService} from './basedataservice';

@inject(BaseDataService)
export class LocationDataService {

  constructor(baseDataService) {
    this.baseDataService = baseDataService;
  }

  postLocationData (locationData, success, fail) {
    return this.baseDataService.postJson('/location/savelocationdata', locationData, success, fail);
  }
}
