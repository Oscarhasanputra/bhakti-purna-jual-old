import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import { GlobalState } from '../../../../global.state';


@Injectable()
export class MasterCustomerService {
    data:any;

    constructor(private http: Http, public global: GlobalState) {

    }

    getZonaList(kode_dealer){
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/getZonaList/' + kode_dealer, options);
    }

    getListMasterCustomer(kode_bass,kode_zona,nama_customer): Promise<any> {
        if(kode_zona == 'ALL')
        {
            kode_zona = '';
        }
        
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({"kode_bass":kode_bass,"kode_zona":kode_zona,"nama_customer":"%"+ nama_customer +"%"}); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json','x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/getListCustomer/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }

    deleteCustomer(kode_customer): Promise<any> {
        
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({"kode_customer":kode_customer}); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json','x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/deleteCustomer/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }

    massDeleteCustomer(kode_customer): Promise<any> {
        
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify(kode_customer); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json','x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/massDeleteCustomer/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }

    activateBass(kode_bass): Promise<any> {
        
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({"kode_bass":kode_bass}); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json','x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/activateBass/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }
}