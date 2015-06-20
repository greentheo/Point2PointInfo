/**
 * Provides a quick abstraction to interacting with localService data
 */
export class LocalService {

  getItem (key) {
    return localStorage.getItem(key);
  }

  setItem (key, val) {
    return localStorage.setItem(key, val);
  }

  unsetItem (key) {
    return localStorage.removeItem(key);
  }
}

