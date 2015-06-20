import {inject, computedFrom} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AppData} from './dataservices/appdata';
import {LocalService} from './dataservices/localservice';
import {UserDataService} from './dataservices/userdataservice';

@inject(Router, AppData, LocalService, UserDataService)
export class Account {

  constructor(router, appData, localService, userDataService) {
    this.router = router;
    this.appData = appData;
    this.localService = localService;
    this.userDataService = userDataService;
  }

  email ='';
  password = '';
  loggingIn = false;
  loginError = '';
  isAuthenticated = false;

  login() {
    
    this.loggingIn = true;
  
    this.userDataService.login(this.email, this.password,
        response => {

          this.loggingIn = false;
          this.isAuthenticated = true;
          this.loginError = '';
          this.localService.setItem(this.appData.AUTH_TOKEN, response.content.token);

          this.appData.userName = response.content.user.auth.email;

          this.router.navigate('collector');
        },
        errResponse => {
          this.loggingIn = false;
          this.loginError = errResponse.responseJSON.error;
        });
  }

  logout() {
    this.localService.unsetItem(this.appData.AUTH_TOKEN);
    this.isAuthenticated = false;
  }

  activate() {
    this.isAuthenticated = this.appData.isAuthenticated();
    this.email = this.appData.userName;
  }

  @computedFrom('loginError')
  get loginFail() {
    return this.loginError != '';
  }
}
