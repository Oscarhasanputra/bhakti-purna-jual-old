import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { GlobalState } from '../../../../global.state';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class GeneralSettingService {
    // Resolve HTTP using the constructor
    constructor(private http: Http, public global: GlobalState) {
    }

    saveSetting(body: any): Promise<any> {
        let bodyString = JSON.stringify({
            web_title: body.web_title,
            report_server_path: body.report_server_path,
            expired_po_date: body.expired_po_date,
            bass_pusat: body.bass_pusat,
            email_port: body.email_port,
            email_smtp: body.email_smtp,
            email_username: body.email_username,
            email_password: body.email_password,
            email_service: body.email_service
        }); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.getGlobalUrl() + '/updategeneralsetting', bodyString, options) // ...using post request
            .toPromise()
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        // console.log(error);
        return Promise.reject(error);
    }

    getSystemParameter(): Promise<any> {
        // let bodyString = JSON.stringify({ kode_role: body }); // Stringify payload
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.getGlobalUrl() + '/get_systemparam', options) // ...using get request
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
}