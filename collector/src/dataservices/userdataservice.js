import {inject} from 'aurelia-framework';
import {BaseDataService} from './basedataservice';

@inject(BaseDataService)
export class UserDataService {

  constructor(baseDataService) {
    this.baseDataService = baseDataService;
  }

  login (email, password, cb) {
    return this.baseDataService.postJson('/auth/login', { email: email, password: password }, cb);
  }

  logout (cb) {
    // TODO:  what???? you want to log out???
  }
}
