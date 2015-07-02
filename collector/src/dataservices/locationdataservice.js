import {inject} from 'aurelia-framework';
import {BaseDataService} from './basedataservice';

/**
 * Provides functions for posting location data
 */
@inject(BaseDataService)
export class LocationDataService {

  constructor(baseDataService) {
    this.baseDataService = baseDataService;
  }

  /**
   * Posts a user's location data
   * @param locationData {Array of LocationData objects} - the collected location data
   * @param cb {function} - the callback to handle the results of the request
   * @returns {Bluebird Promise}
   */
  postLocationData (locationData, cb, fail) {
    return this.baseDataService.postJson('/location/savelocationdata', locationData, cb, fail);
  }
}
