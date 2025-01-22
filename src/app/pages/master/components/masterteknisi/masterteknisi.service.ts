import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import { GlobalState } from '../../../../global.state';


@Injectable()
export class MasterTeknisiService {
    data:any;

    constructor(private http: Http, public global: GlobalState) {

    }

    getListMasterTeknisi(kode_bass,kode_teknisi,status): Promise<any> {
        
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({"kode_bass":kode_bass,"kode_teknisi":kode_teknisi,"status":status}); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json','x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/getTeknisiList/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }

    deleteTeknisi(kode_bass,kode_teknisi): Promise<any> {
        
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({"kode_bass":kode_bass,"kode_teknisi":kode_teknisi}); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json','x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/deleteTeknisi/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }

    activateTeknisi(kode_bass,kode_teknisi): Promise<any> {
        
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({"kode_bass":kode_bass,"kode_teknisi":kode_teknisi}); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json','x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/activateTeknisi/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }
}