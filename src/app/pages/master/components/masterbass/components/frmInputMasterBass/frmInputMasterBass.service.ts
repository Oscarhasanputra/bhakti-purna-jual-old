import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import { GlobalState } from '../../../../../../global.state';


@Injectable()
export class FrmInputMasterBassService {
    public data: any;

    constructor(private http: Http, public global: GlobalState) {
    }

    getKotaList() {
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/getKotaSelect/', options);
    }

    saveTambahBass(registerBass): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        //let bodyString = JSON.stringify({"kode_bass":kode_bass,"nama_bass":nama_bass,"alamat_bass":alamat_bass,"nomor_telp":nomor_telp,"kota":kota,"contact_person":contact_person,"email":email,"inputted_by":inputted_by,"inputted_by_bass":inputted_by_bass,"inputted_date":inputted_date,"type":type}); 
        registerBass["inputted_by"] = this.global.Decrypt('mAuth').USERNAME
        registerBass["inputted_by_bass"] = this.global.Decrypt('mAuth').KODE_BASS
        let bodyString = JSON.stringify(registerBass);

        // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/saveTambahBass/', bodyString, options) // ...using post request
            .toPromise()
            .then(response => this.data = response.json());
    }

    getBassSingle(kode_bass) {
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/getBassSingle/' + kode_bass, options);
    }

    editBass(registerBass, kode_bass): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN

        registerBass["kode_bass"] = kode_bass;
        let bodyString = JSON.stringify(registerBass);
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/updateBass/', bodyString, options) // ...using post request
            .toPromise()
            .then(response => this.data = response.json());
    }

}