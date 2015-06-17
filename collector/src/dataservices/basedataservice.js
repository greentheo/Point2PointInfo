import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {LocalService} from './localservice';

let baseUrl = 'http://localhost:1337';

@inject(HttpClient, LocalService)
export class BaseDataService {

  getJson (url, options, success, fail) {
    return http.get(this.fullUrl(url), options, this.addTokenIfExists())
      .then(success)
      .fail(fail);
  }

  postJson (url, jsonData, success, fail) {
    return http.post(this.fullUrl(url), jsonData, this.addTokenIfExists())
      .then(success)
      .fail(fail);
  }

  addTokenIfExists() {
    let token = localService.getItem('authToken');
    if (token == null) return undefined;

    return { 'access_token': token };
  }

  fullUrl (url) {
    if (url.indexOf('/') != 0) url = '/' + url;
    return baseUrl + url;
  }

  constructor(http, localService) {
    this.http = http;
    this.localService = localService;
  }
}




