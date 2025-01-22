import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import { GlobalState } from '../../../../global.state';


@Injectable()
export class MasterAplikasiService {
    data: any;

    constructor(private http: Http, public global: GlobalState) {
    }

    getListMasterAplikasi(kode_aplikasi): Promise<any> {

        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({ "kode_aplikasi": kode_aplikasi }); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/getAplikasi/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }

}