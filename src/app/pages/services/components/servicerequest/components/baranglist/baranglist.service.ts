import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// set global url 
import { GlobalState } from '../../../../../../global.state';

// Import RxJs required methods
// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class BarangListService {

    constructor(public http: Http, public global: GlobalState) {
    }
        
    // fecth merk
    getMerk(): Promise<any> {
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.global.GlobalUrl + '/getmerek/', options)
            .toPromise()
            .then(response => response.json())
    }

    // fecth jenis
    getJenis(): Promise<any> {
        // console.log("saprol")
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.global.GlobalUrl + '/getjenis/', options)
            .toPromise()
            .then(response => response.json())
    }

    // fecth barang
    getBarang(kodeBarang: String, merk: String, jenis: String): Promise<any> {
        let bodyString = JSON.stringify({ kodeBarang: kodeBarang, merk: merk, jenis: jenis }); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getbarang/', bodyString, options)
            .toPromise()
            .then(response => response.json())
    }        

}