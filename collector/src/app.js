import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

export class App {
  configureRouter(config, router){
    config.title = 'Bumpiness Collector';
    config.map([
      { route: ['', 'account'],   title: 'Account',   moduleId: './account',    nav: true },
      { route: 'collector',       title: 'Collector', moduleId: './collector',  nav: true }
    ]);

    this.router = router;
  }
}
