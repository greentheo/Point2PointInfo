import {inject} from 'aurelia-framework';
import {BaseDataService} from './basedataservice';

/**
 * Provides functions for logging a user in and out
 */
@inject(BaseDataService)
export class UserDataService {

  constructor(baseDataService) {
    this.baseDataService = baseDataService;
  }

  /**
   * Logs a user in
   * @param email {string} - the user's email address
   * @param password {string} - the user's password
   * @param cb {function} - the callback to handle the results of the request
   * @returns {Bluebird Promise}
   */
  login (email, password, cb, fail) {
    return this.baseDataService.postJson('/auth/login', { email: email, password: password }, cb, fail);
  }

  /**
   * Logs a user out
   * @param cb {function} - the callback to handle the results of the request
   * @returns {Bluebird Promise}
   */
  logout (email, cb, fail) {
    return this.baseDataService.postJson('/auth/logout', { email: email }, cb, fail);
  }
}
