import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { GlobalState } from '../../global.state';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class PasswordService {
    // Resolve HTTP using the constructor
    constructor(private http: Http, public global: GlobalState) {
    }

    changePassword(body: any): Promise<any> {
        let bodyString = JSON.stringify({
            kode_bass: this.global.Decrypt('mAuth').KODE_BASS,
            username: this.global.Decrypt('mAuth').USERNAME,
            oldpassword: body.oldpassword,
            newpassword: body.password
        }); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.getGlobalUrl() + '/changepassword', bodyString, options) // ...using post request
            .toPromise()
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        // console.log(error);
        return Promise.reject(error);
    }
}