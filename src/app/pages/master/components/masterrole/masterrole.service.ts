import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import { GlobalState } from '../../../../global.state';

@Injectable()
export class MasterRoleService {
    data:any;

    constructor(private http: Http, public global: GlobalState) {

    }

    getListMasterRole(kode_role): Promise<any> {
        
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({"kode_role":kode_role}); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json','x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/getRoleList/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }

    deleteRole(kode_role): Promise<any> {
        
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({"kode_role":kode_role}); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json','x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/deleteRole/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }

}