import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// set global url 
import { GlobalState } from '../../../../global.state';

// Import RxJs required methods
// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class MasterKotaService {

    private token = this.global.Decrypt('mAuth').TOKEN
    private headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    private options = new RequestOptions({ headers: this.headers });

    constructor(public http: Http, public global: GlobalState) {
    }

    getDatas(): Promise<any> {
        let bodyString = {}; // Stringify payload // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/kota_list/', bodyString, this.options)
            .toPromise()
            .then(response => response.json())
    }

    getData(kota): Promise<any> {
        let bodyString = JSON.stringify({ kota: kota }); // Stringify payload // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/kota_get/', bodyString, this.options)
            .toPromise()
            .then(response => response.json())
    }

    saveKota(data): Promise<any> {
        //   let bodyString = {}; // Stringify payload // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/kota_insert/', data, this.options)
            .toPromise()
            .then(response => response.json())
    }

    editKota(data): Promise<any> {
        //   let bodyString = {}; // Stringify payload // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/kota_edit/', data, this.options)
            .toPromise()
            .then(response => response.json())
    }
}
