import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { GlobalState } from '../../../../global.state';

@Injectable()
export class RejectedServiceReportService {
    public smartTableData: any;

    constructor(private http: Http, public global: GlobalState) {

    }

    getRejectedServiceReport(kode_dealer, tgl_awal, tgl_akhir) {
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        if (kode_dealer == '') {
            return this.http.get(this.global.GlobalUrl + '/getRejectedServiceReportService/' + tgl_awal + '/' + tgl_akhir, options);
        } else {
            return this.http.get(this.global.GlobalUrl + '/getRejectedServiceReportService/' + kode_dealer + '/' + tgl_awal + '/' + tgl_akhir, options);
        }
    }

    getBassList(kode_dealer): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/getBassList/' + kode_dealer, options).toPromise()
            .then(response => this.smartTableData = response.json());
    }
}

export class User {
    KODE_BASS: string;
    USERNAME: string;
    KODE_ROLE: string;
    INPUTTED_BY: string;
    INPUTTED_BY_BASS: string;
    INPUTTED_DATE: string;
    TYPE: string;
    TOKEN: string;
}