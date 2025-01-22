import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'

// set global url 
import { GlobalState } from '../../../../global.state';

@Injectable()
export class PartOrderExpiredService {
    public smartTableData: any;

    constructor(private http: Http, public global: GlobalState) {
    }

    getPartOrderExpiredHomeSelect(tgl_awal, tgl_akhir, inputted_by_bass): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({ "no_po": '%%', "tgl_awal": tgl_awal, "tgl_akhir": tgl_akhir, "inputted_by_bass": inputted_by_bass }); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/getPartOrderExpiredHomeSelect/', bodyString, options)
            .toPromise()
            .then(response => this.smartTableData = response.json());
    }

    getBassList(kode_dealer): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/getBassList/' + kode_dealer, options).toPromise()
            .then(response => this.smartTableData = response.json());
    }

    getBassListUnderCabang(kode_dealer): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/getBassListUnderCabang/' + kode_dealer.options).toPromise()
            .then(response => this.smartTableData = response.json());
    }
}