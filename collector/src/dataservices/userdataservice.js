import {inject} from 'aurelia-framework';
import {BaseDataService} from './basedataservice';

@inject(BaseDataService)
export class UserDataService {

  login (email, password, success, fail) {
    return this.baseDataService.postJson('/auth/login', { email: email, password: password }, success, fail);
  }

  logout (success, fail) {
    // TODO:  what???? you want to log out???
  }

  constructor(baseDataService) {
    this.baseDataService = baseDataService;
  }
}
