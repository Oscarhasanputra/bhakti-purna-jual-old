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
export class PaidClaimServicesService {
    constructor(public http: Http, public global: GlobalState) {
    }

    private smartTableData: any;

    getReviewClaimList(KodeBass: String, KodeParam: String, dateFr: String, dateTo: String, Status: String): Promise<any> {
        let bodyString = JSON.stringify({
            tgl_awal: dateFr, tgl_akhir: dateTo,
            kode_bass: KodeBass, param_kode_bass: KodeParam,
            status: Status
        }); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/claimreviewlist/', bodyString, options)
            .toPromise()
            .then(response => this.smartTableData = response.json())
    }

    insertPaidClaim(kodeClaim: String, inputtedBy: String, inputtedByBass: String, inputtedDate: Date): Promise<any> {
        let result: any;
        let bodyString = JSON.stringify({
            kode_claim: kodeClaim, input_by: inputtedBy,
            kode_bass: inputtedByBass, tgl_trx: inputtedDate
        }); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/insertpaidclaim/', bodyString, options)
            .toPromise()
            .then(response => result = response.json())
    }
}
