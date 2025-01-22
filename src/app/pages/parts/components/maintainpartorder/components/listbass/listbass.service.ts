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
export class ListBassMaintainPOService {

    public PageData:any=[];
    public coba:any = true;

    private token = this.global.Decrypt('mAuth').TOKEN;
    private headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    private options = new RequestOptions({ headers: this.headers });
    
    constructor(public http: Http, public global: GlobalState) {
    }

    getBassList(kdbass): Promise<any> {
        let bodyString = JSON.stringify({ kdbass:kdbass }); // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/bassList/',bodyString, this.options)
            .toPromise()
            .then(response => response.json())
    }
    
     getBassListUnderCabang(KodeBass: String, kodebasstxt: String): Promise<any> {
        let bodyString = JSON.stringify({ kode_bass: KodeBass, kodebasstxt: kodebasstxt }); // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/basslistbycabang/', bodyString, this.options)
            .toPromise()
            .then(response => response.json())
    }

    getBassListAll(kdbass): Promise<any> {
        let bodyString = JSON.stringify({ kdbass:kdbass }); // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/bassListAll/',bodyString, this.options)
            .toPromise()
            .then(response => response.json())
    }
}
