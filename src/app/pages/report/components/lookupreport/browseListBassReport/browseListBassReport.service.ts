import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import { GlobalState } from '../../../../../global.state';


@Injectable()
export class BrowseListBassReportService {
    public smartTableData:any;

    constructor(private http: Http, public global: GlobalState) {

    }

    getReportServiceList(kode_dealer,tgl_awal,tgl_akhir,status){
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/reportServiceList/' + kode_dealer + '/' + tgl_awal + '/' + tgl_akhir + '/' + status, options);
    }

    getReportServiceListALL(kode_dealer,tgl_awal,tgl_akhir){
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/reportServiceList/' + kode_dealer + '/' + tgl_awal + '/' + tgl_akhir, options);
    }

    getBassList(kode_dealer): Promise<any>{
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/getBassList/' + kode_dealer, options).toPromise()
        .then(response => this.smartTableData = response.json());
    }

    getBassListUnderCabang(kode_dealer): Promise<any>{
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/getBassListUnderCabang/' + kode_dealer, options).toPromise()
        .then(response => this.smartTableData = response.json());
    }
}

