import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import { GlobalState } from '../../../../../../global.state';

@Injectable()
export class FrmInputMasterTransportasiService {
    public data: any;

    constructor(private http: Http, public global: GlobalState) {

    }

    saveTambahTransportasi(registerTransportasi): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN;
        registerTransportasi["inputted_by"] = this.global.Decrypt('mAuth').USERNAME;
        registerTransportasi["inputted_by_bass"] = this.global.Decrypt('mAuth').KODE_BASS;
        let bodyString = JSON.stringify(registerTransportasi);


        // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/saveTambahTransportasi/', bodyString, options) // ...using post request
            .toPromise()
            .then(response => this.data = response.json());
    }

    getTransportasiSingle(kode_transportasi) {
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({ "kode_transportasi": kode_transportasi });
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/getTransportasiSingle/', bodyString, options);
    }

    editTransportasi(registerTransportasi, kode_transportasi): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        registerTransportasi["kode_transportasi"] = kode_transportasi;
        // console.log(registerTransportasi);
        let bodyString = JSON.stringify(registerTransportasi);
        // console.log(bodyString);
        // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/updateTransportasi/', bodyString, options) // ...using post request
            .toPromise()
            .then(response => this.data = response.json());
    }

}