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
export class TeknisiListService {

    constructor(public http: Http, public global: GlobalState) {
    }
    
    // getservicelist         
    getTeknisiList(kode_bass: String, kode_teknisi:String, status:String): Promise<any> {
        let bodyString = JSON.stringify({kode_bass:kode_bass, kode_teknisi:kode_teknisi, status:status}); // Stringify payload
        // console.log(bodyString)
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getTeknisiList/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    }   

}