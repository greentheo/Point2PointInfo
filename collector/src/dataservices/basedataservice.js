import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {LocalService} from './localservice';

let baseUrl = 'http://localhost:1337';

@inject(HttpClient, LocalService)
export class BaseDataService {

  constructor(http, localService) {
    this.http = http;
    this.localService = localService;

    this.http.configure(h => h.withBaseUrl(baseUrl));
  }

  getJson (url, options, cb) {
    var request =
      this.http.createRequest(url)
        .asGet()
        .withContent(options);

    // add token if it exists
    request = this.addTokenToRequest(request);

    request.send().then(cb);
  }

  postJson (url, jsonData, cb) {
    var request =
      this.http.createRequest(url)
        .asPost()
        .withContent(jsonData);

    // add token if it exists
    request = this.addTokenToRequest(request);

    request.send().then(cb);
  }

  addTokenToRequest(request) {
    let token = this.localService.getItem('authToken');
    if (token == null) return request;

    return request.withHeader('access_token', token);
  }

  fullUrl (url) {
    if (url.indexOf('/') != 0) url = '/' + url;
    return baseUrl + url;
  }
}




