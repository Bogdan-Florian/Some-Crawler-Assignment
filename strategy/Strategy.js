export class Strategy {
    constructor(name, handler) {
      this._name = name;
      this._handler = handler;
    }
  
    executeStrategy(...args) {
      return this._handler(...args);
    }
  }
  