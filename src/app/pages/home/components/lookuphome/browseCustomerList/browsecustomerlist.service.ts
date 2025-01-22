import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'

// set global url 
import { GlobalState } from '../../../../../global.state';

@Injectable()
export class BrowseCustomerListService {
    public data: any;

    constructor(private http: Http, public global: GlobalState) {

    }

    getCustomerList(kode_zona, kode_bass): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({ "KODE_ZONA": kode_zona, "KODE_BASS": kode_bass }); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/getCustomerList/', bodyString, options) // ...using post request
            .toPromise()
            .then(response => this.data = response.json());
    }

    getCustomerListPusat(kode_zona): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({ "KODE_ZONA": kode_zona }); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/getCustomerListPusat/', bodyString, options) // ...using post request
            .toPromise()
            .then(response => this.data = response.json());
    }

    getZonaList(kode_dealer) {
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/getZonaList/' + kode_dealer, options);
    }

}

