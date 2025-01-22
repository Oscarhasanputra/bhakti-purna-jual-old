import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import { GlobalState } from '../../../../../../global.state';


@Injectable()
export class FrmInputMasterCustomerService {
    public data: any;

    constructor(private http: Http, public global: GlobalState) {
    }

    getKotaList() {
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/getKotaSelect/', options);
    }

    saveTambahCustomer(registerCustomer): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        registerCustomer["inputted_by"] = this.global.Decrypt('mAuth').USERNAME;
        registerCustomer["inputted_by_bass"] = this.global.Decrypt('mAuth').KODE_BASS;
        let bodyString = JSON.stringify(registerCustomer);

        // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/saveTambahCustomer/', bodyString, options) // ...using post request
            .toPromise()
            .then(response => this.data = response.json());
    }

    getCustomerSingle(kode_customer) {
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({ "kode_customer": kode_customer });
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/getCustomerSingle/', bodyString, options);
    }

    editCustomer(registerCustomer, kode_customer): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        registerCustomer["kode_customer"] = kode_customer;
        let bodyString = JSON.stringify(registerCustomer);

        // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/updateCustomer/', bodyString, options) // ...using post request
            .toPromise()
            .then(response => this.data = response.json());
    }

}