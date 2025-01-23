import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class GlobalState {
  // public GlobalUrl: String = 'http://103.253.107.56:5000';
  public GlobalUrl: String = 'http://10.1.0.181:5000';

  private _data = new Subject<Object>();
  private _dataStream$ = this._data.asObservable();

  private _subscriptions: Map<string, Array<Function>> = new Map<string, Array<Function>>();

  private secretNumber = 'mishirin';

  constructor() {
    this._dataStream$.subscribe((data) => this._onEvent(data));
  }

  getGlobalUrl(): String {
    return this.GlobalUrl;
  }

  Decrypt(key: string): any {
    try {
      let result = sessionStorage.getItem(key);
      let bytes = CryptoJS.AES.decrypt(JSON.parse(result), this.secretNumber);

      let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    } catch (error) {
      alert(error)
      return error
    }
  }

  // encryptString(text: string): String {
  //   const secret = 'mishirin';
  //   const algorithm = 'aes-256-cbc';
  //   try {
  //     var cipher = crypto.createCipher(algorithm, secret);
  //     var crypted = cipher.update(text, 'utf8', 'hex');
  //     crypted += cipher.final('hex');
  //     return (crypted);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // decryptString(text: string): String {
  //   const secret = 'mishirin';
  //   const algorithm = 'aes-256-cbc';
  //   try {
  //     var decipher = createDecipher(algorithm, secret);
  //     var dec = decipher.update(text, 'hex', 'utf8');
  //     dec += decipher.final('utf8');
  //     return (dec);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  notifyDataChanged(event, value) {

    let current = this._data[event];
    if (current !== value) {
      this._data[event] = value;

      this._data.next({
        event: event,
        data: this._data[event]
      });
    }
  }

  subscribe(event: string, callback: Function) {
    let subscribers = this._subscriptions.get(event) || [];
    subscribers.push(callback);

    this._subscriptions.set(event, subscribers);
  }

  _onEvent(data: any) {
    let subscribers = this._subscriptions.get(data['event']) || [];

    subscribers.forEach((callback) => {
      callback.call(null, data['data']);
    });
  }
}
