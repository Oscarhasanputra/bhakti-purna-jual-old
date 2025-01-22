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
export class ServiceRequestService {

    constructor(public http: Http, public global: GlobalState) {
    }

    // getNearestBass
    getNearestBass(kodeCustomer: String, kodeBass: String, isAdmin: Number): Promise<any> {
        let bodyString = JSON.stringify({ kodeCustomer: kodeCustomer, kodeBass: kodeBass, isAdmin: isAdmin }); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getnearestbass/', bodyString, options)
            .toPromise()
            .then(response => response.json())
    }

    // getKerusakan  
    getKerusakan(kodeBarang: String): Promise<any> {
        // console.log(kodeBarang)
        let bodyString = JSON.stringify({ kodeBarang: kodeBarang }); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getkerusakan/', bodyString, options)
            .toPromise()
            .then(response => response.json())
    }

    // getCustomer
    getCustomer(kodeCustomer: String): Promise<any> {
        let bodyString = JSON.stringify({ kodeCustomer: kodeCustomer }); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getcustomer/', bodyString, options)
            .toPromise()
            .then(response => response.json())
    }

    // getBarangByKode
    getBarangByKode(kodeBarang: String): Promise<any> {
        let bodyString = JSON.stringify({ kodeBarang: kodeBarang }); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getbarangbykode/', bodyString, options)
            .toPromise()
            .then(response => response.json())
    }

    // getHarga
    getHarga(kodeBarang: String, merk: String, jenis: String): Promise<any> {
        let bodyString = JSON.stringify({ kodeBarang: kodeBarang, merk: merk, jenis: jenis }); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getharga/', bodyString, options)
            .toPromise()
            .then(response => response.json())
    }

    // serviceUpdate
    serviceUpdate(data): Promise<any> {
        let bodyString = JSON.stringify(data); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/serviceupdate/', bodyString, options)
            .toPromise()
            .then(response => response.json())
    }

    //  serviceInsert
    serviceInsert(data): Promise<any> {
        let bodyString = JSON.stringify(data); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/serviceinsert/', bodyString, options)
            .toPromise()
            .then(response => response.json())
    }


    // insert customer
    customerInsert(data): Promise<any> {
        let bodyString = JSON.stringify(data); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/saveTambahCustomer/', bodyString, options)
            .toPromise()
            .then(response => response.json())
    }

    // insert customer
    sendMail(data): Promise<any> {
        let bodyString = JSON.stringify(data); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/sendmail/', bodyString, options)
            .toPromise()
            .then(response => response.json())
    }

    // getReviewClainService
    getReviewClaimService(kodeService: String): Promise<any> {
        let bodyString = JSON.stringify({ kodeService: kodeService }); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getReviewClaimService/', bodyString, options)
            .toPromise()
            .then(response => response.json())
    }
}