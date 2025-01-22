import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { GlobalState } from '../../../../global.state';

@Injectable()
export class ReportPartOrderService {
    public smartTableData:any;

    constructor(private http: Http, public global: GlobalState) {

    }

    getReportPartOrderServices(kode_dealer,kode_zona,tgl_awal,tgl_akhir){
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/reportpartorder/' + kode_dealer + '/' + kode_zona + '/' + tgl_awal + '/' + tgl_akhir, options);
    }

    getZonaList(kode_dealer){
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/getZonaList/' + kode_dealer, options);
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