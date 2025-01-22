import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// set global url 
import { GlobalState } from '../../../../../../global.state';

// Import RxJs required methods
// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ListPartReceivingService {

    public PageData:any=[];
    public coba:any = true;

    private token = this.global.Decrypt('mAuth').TOKEN;
    private headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    private options = new RequestOptions({ headers: this.headers });
    
    constructor(public http: Http, public global: GlobalState) {
    }

    getPRList(kodebass, tgldari, tglsampai): Promise<any> {
        let bodyString = JSON.stringify({ kodebass: kodebass, tgldari: tgldari, tglsampai: tglsampai }); // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/prList/', bodyString, this.options)
            .toPromise()
            .then(response => response.json())
    }

    getPRbyKode(nopr, kodebass): Promise<any> {
        let bodyString = JSON.stringify({ nopr:nopr, kodebass:kodebass }); // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/prListbyKode/', bodyString, this.options)
            .toPromise()
            .then(response => response.json())
    }
}
