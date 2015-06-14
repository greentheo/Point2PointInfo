export class LocalService {

  static getItem (key) {
    return localStorage.getItem(key);
  }

  static setItem (key, val) {
    return localStorage.setItem(key, val);
  }

  static unsetItem (key) {
    return localStorage.removeItem(key);
  }
}

