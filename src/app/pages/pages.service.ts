import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { GlobalState } from '../global.state';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class PagesService {
    // Resolve HTTP using the constructor
    constructor(private http: Http, public global: GlobalState) {
    }

    getMenu(body: String): Promise<any> {
        let bodyString = JSON.stringify({ kode_role: body }); // Stringify payload
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.getGlobalUrl() + '/get_menu', bodyString, options) // ...using post request
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        return Promise.reject(error);
    }

}