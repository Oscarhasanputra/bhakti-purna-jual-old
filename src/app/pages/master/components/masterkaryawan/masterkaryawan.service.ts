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
export class MasterKaryawanService {
    private token = this.global.Decrypt('mAuth').TOKEN
    private headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': this.token });
    private options = new RequestOptions({ headers: this.headers });

    constructor(public http: Http, public global: GlobalState) {
    }

    getData(kodebass, status): Promise<any> {
        let bodyString = JSON.stringify({ kodebass: kodebass, status: status }); // Stringify payload // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/karyawan_list/', bodyString, this.options)
            .toPromise()
            .then(response => response.json())
    }

    getDataDetail(kodebass, username): Promise<any> {
        let bodyString = JSON.stringify({ kodebass: kodebass, username: username }); // Stringify payload // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/karyawan_listdetail/', bodyString, this.options)
            .toPromise()
            .then(response => response.json())
    }

    getKodeRole(type, role): Promise<any> {
        let bodyString = JSON.stringify({ type: type, role: role }); // Stringify payload // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/role_list/', bodyString, this.options)
            .toPromise()
            .then(response => response.json())
    }

    saveKaryawan(data): Promise<any> {
        //   let bodyString = {}; // Stringify payload // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/karyawan_insert/', data, this.options)
            .toPromise()
            .then(response => response.json())
    }

    deleteKaryawan(data): Promise<void> {
        // let bodyString = JSON.stringify({ zona: zona}); // Stringify payload // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/karyawan_delete/', data, this.options)
            .toPromise()
            .then(response => response.json())
    }

    aktifkanKaryawan(data): Promise<void> {
        // let bodyString = JSON.stringify({ zona: zona}); // Stringify payload // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/karyawan_aktif/', data, this.options)
            .toPromise()
            .then(response => response.json())
    }

    resetPassKaryawan(data): Promise<void> {
        // let bodyString = JSON.stringify({ zona: zona}); // Stringify payload // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/karyawan_resetPass/', data, this.options)
            .toPromise()
            .then(response => response.json())
    }

    editKaryawan(data): Promise<any> {
        //   let bodyString = {}; // Stringify payload // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/Karyawan_edit/', data, this.options)
            .toPromise()
            .then(response => response.json())
    }

    getBassListAll(kdbass): Promise<any> {
        let bodyString = JSON.stringify({ kdbass: kdbass }); // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/bassListAll/', bodyString, this.options)
            .toPromise()
            .then(response => response.json())
    }

    getBassList(kdbass): Promise<any> {
        let bodyString = JSON.stringify({ kdbass: kdbass }); // Stringify payload
        return this.http.post(this.global.GlobalUrl + '/bassList/', bodyString, this.options)
            .toPromise()
            .then(response => response.json())
    }
}
