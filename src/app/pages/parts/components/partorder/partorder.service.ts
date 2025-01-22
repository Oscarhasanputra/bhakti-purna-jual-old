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
export class PartOrderService {

    private token = this.global.Decrypt('mAuth').TOKEN;
    private headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    private options = new RequestOptions({ headers: this.headers });

    constructor(public http: Http, public global: GlobalState) {
    }

    getTipePO(): Promise<any> {
        return this.http.get(this.global.GlobalUrl + '/tipePO/', this.options)
            .toPromise()
            .then(response => response.json())
    }

    getAutonumberNoPO(tgl, kodebass): Promise<any> {
        let bodyString = JSON.stringify({ tgl:tgl,kodebass:kodebass }); // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/autonumberNoPO/', bodyString, this.options)
            .toPromise()
            .then(response => response.json())
    }

    save(data): Promise<any> {
        return this.http.post(this.global.GlobalUrl + '/savePO/', data, this.options)
            .toPromise()
            .then(response => response.json())
    }

    sendEmail(basspusat, kodekaryawan, kodebass, nopo, tgl, details): Promise<any> {
        let bodyString = JSON.stringify({ basspusat:basspusat, kodekaryawan:kodekaryawan, kodebass:kodebass, nopo:nopo, tgl:tgl, details:details }); // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/sendEmail/', bodyString, this.options)
            .toPromise()
            .then(response => response.json())
    }

}