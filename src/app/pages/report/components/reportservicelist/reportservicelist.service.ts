import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import { GlobalState } from '../../../../global.state';

@Injectable()
export class ReportServiceListService {
    public smartTableData: any;

    constructor(private http: Http, public global: GlobalState) {

    }

    getReportServiceList(kode_dealer, tgl_awal, tgl_akhir, status) {
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        if (kode_dealer == '') {
            return this.http.get(this.global.GlobalUrl + '/reportServiceList/' + tgl_awal + '/' + tgl_akhir + '/' + status, options);
        } else {
            return this.http.get(this.global.GlobalUrl + '/reportServiceList/' + kode_dealer + '/' + tgl_awal + '/' + tgl_akhir + '/' + status, options);
        }
    }

    getReportServiceListALL(kode_dealer, tgl_awal, tgl_akhir) {
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        if (kode_dealer == '') {
            return this.http.get(this.global.GlobalUrl + '/reportServiceList/' + tgl_awal + '/' + tgl_akhir, options);
        }
        else {
            return this.http.get(this.global.GlobalUrl + '/reportServiceList/' + kode_dealer + '/' + tgl_awal + '/' + tgl_akhir, options);
        }

    }
}

