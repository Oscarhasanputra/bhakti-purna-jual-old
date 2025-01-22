import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import { GlobalState } from '../../../../global.state';

@Injectable()
export class MasterBassService {
    data: any;

    constructor(private http: Http, public global: GlobalState) {

    }

    getZonaList(kode_dealer) {
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/getZonaList/' + kode_dealer, options);
    }

    getListMasterBass(kode_zona, status): Promise<any> {
        if (kode_zona == 'ALL') {
            kode_zona = '';
        }
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({ "kode_zona": kode_zona, "status": status }); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/getListMasterBass/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }

    deleteBass(kode_bass): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({ "kode_bass": kode_bass }); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/deleteBass/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }

    activateBass(kode_bass): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({ "kode_bass": kode_bass }); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/activateBass/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }
}