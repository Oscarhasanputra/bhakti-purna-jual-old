import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
// set global url 
import { GlobalState } from '../../../../global.state';

@Injectable()
export class ServiceListService {
    public smartTableData: any;

    constructor(private http: Http, public global: GlobalState) {

    }

    getServiceListHome(sKodeBass, kode_cust, selectedStatus, tglAwal, tglAkhir): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN;
        let bodyString = JSON.stringify({ "kode_service": "%%", "kode_bass": sKodeBass, "kode_cust": kode_cust, "tgl_awal": tglAwal, "tgl_akhir": tglAkhir, "status": selectedStatus }); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/serviceListHome/', bodyString, options) // ...using post request
            .toPromise()
            .then(response => this.smartTableData = response.json());
    }
}