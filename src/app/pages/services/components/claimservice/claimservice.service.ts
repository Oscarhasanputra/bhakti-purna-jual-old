import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// set global url 
import { GlobalState } from '../../../../global.state';

// Import RxJs required methods
// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ClaimServiceService {
    constructor(public http: Http, public global: GlobalState) {
    }

    private smartTableData: any;

    getDataClaim(KodeBass: String, dateFr: String, dateTo: String): Promise<any> {
        let bodyString = JSON.stringify({ kode_bass: KodeBass, tgl_awal: dateFr, tgl_akhir: dateTo }); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/claimservicelist/', bodyString, options)
            .toPromise()
            .then(response => this.smartTableData = response.json())
    }

    saveDataClaim(dateTr: Date, KodeBass: String, InputBy: String, dataDetail: Array<any>): Promise<any> {
        let result: any;

        let bodyString = JSON.stringify({ tgl_trx: dateTr, kode_bass: KodeBass, input_by: InputBy, data: dataDetail }); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/claimservicesave/', bodyString, options)
            .toPromise()
            .then(response => result = response.json())

    }
}
