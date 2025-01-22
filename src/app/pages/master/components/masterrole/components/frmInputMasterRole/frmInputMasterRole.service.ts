import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import { GlobalState } from '../../../../../../global.state';


@Injectable()
export class FrmInputMasterRoleService {
    public data:any;

    constructor(private http: Http, public global: GlobalState) {

    }

    getListRoleDetail(kode_role): Promise<any> {
        
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({"kode_role":kode_role}); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json','x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/getRoleDetailList/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }

    saveTambahRole(payload): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN

        let bodyString = JSON.stringify(payload);
        
        
        // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/saveTambahRole/', bodyString, options) // ...using post request
            .toPromise()
            .then(response => this.data = response.json());
    }

    getRoleHeader(kode_role): Promise<any> {
        
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({"kode_role":kode_role}); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json','x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/getRoleList/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }

    updateRole(payload): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN

        let bodyString = JSON.stringify(payload);
        
        
        // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/updateRole/', bodyString, options) // ...using post request
            .toPromise()
            .then(response => this.data = response.json());
    }

}