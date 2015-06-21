import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {LocalService} from './localservice';
import {AppConfig} from '../config/appconfig';

/**
 * Base data service that takes care of common config setup tasks for getting and posting data
 */
@inject(HttpClient, LocalService, AppConfig)
export class BaseDataService {

  constructor(http, localService, config) {
    this.http = http;
    this.localService = localService;
    this.config = config;

    this.http.configure(h => h.withBaseUrl(this.config.baseUrl));
  }

  /**
   * Sends a get json request.
   * @param {string} url - The url of the request.  Do not include the base url here.
   * @param {object} options - options to send with the request.  Will be converted to a URL arguments string
   * @param {function} cb - callback function which will contain the json data from the request
   */
  getJson (url, options, cb) {
    if (typeof options == 'object') {
      url += this.convertOptionstoUrlString(options);
    }

    var request =
      this.http.createRequest(url).asGet();

    // add token if it exists
    request = this.addTokenToRequest(request);

    request.send().then(cb);
  }

  /**
   * Sends a post json request.
   * @param {string} url - The url of the request.  Do not include the base url here.
   * @param {object} jsonData - data in json format to post to the server
   * @param {function} cb - callback function which will contain the results from the request
   */
  postJson (url, jsonData, cb) {
    var request =
      this.http.createRequest(url)
        .asPost()
        .withContent(jsonData);

    // add token if it exists
    request = this.addTokenToRequest(request);

    request.send().then(cb);
  }

  /**
   * Adds an authentication token to the provided request's headers if one exists.
   * @param {HttpClient} request - The provided request object
   * @returns {HttpClient} - Returns the HttpClient object with the token if it exists, or the unchanged HttpClient if it doesn't.
   */
  addTokenToRequest(request) {
    let token = this.localService.getItem('authToken');
    if (token == null) return request;

    return request.withHeader('access_token', token);
  }

  /**
   * Returns the full url, including the base info
   * @param url {string} - the url of the specific request only (ex. '/foo/bar')
   * @returns {string} - the full url (ex. 'http://my.website.com/foo/bar')
   */
  fullUrl (url) {
    if (url.indexOf('/') != 0) url = '/' + url;
    return baseUrl + url;
  }

  /**
   * Iterates the provided options object and returns a url encoded argument string
   * suitable for a get request.
   * @param options
   * @returns {string} - formatted argument string
   */
  convertOptionstoUrlString(options) {
    let results = '';

    for (var prop in options) {
      if (results == '') {
        results = '?';
      } else {
        results += '&';
      }

      results += prop + '=' + encodeURIComponent(options[prop]);
    }

    return results;
  }
}




