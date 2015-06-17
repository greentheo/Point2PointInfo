import {inject} from 'aurelia-framework';
import {computedFrom} from 'aurelia-framework';
import {AppData} from './dataservices/appdata';
import {LocalService} from './dataservices/localservice';
import {UserDataService} from './dataservices/userdataservice';

@inject(AppData, LocalService, UserDataService)
export class Account {

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
          this.localService.setItem(this.appData.AUTH_TOKEN, response.token);

          this.appData.userName = response.user.auth.email;

          router.navigate('collector');
        },
        errResponse => {
          this.loggingIn = false;
          this.loginError = errResponse.responseJSON.error;
        });
  };

  logout() {
    this.localService.unsetItem(this.appData.AUTH_TOKEN);
    this.isAuthenticated = false;
  };

  activate() {
    this.isAuthenticated = this.appData.isAuthenticated();
  };

  @computedFrom('loginError')
  get loginFail() {
    return this.loginError != '';
  };

  constructor(appData, localService, userDataService) {
    this.appData = appData;
    this.localService = localService;
    this.userDataService = userDataService;
  }
}
