import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import { GlobalState } from '../../../../../../global.state';


@Injectable()
export class FrmInputMasterMappingCabangService {
    public data: any;

    constructor(private http: Http, public global: GlobalState) {
    }

    getCabangList() {
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/getCabang/', options);
    }

    getZonaList() {
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.global.GlobalUrl + '/getZonaMapping/', options);
    }

    saveTambahMappingZona(registerMappingZona): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        registerMappingZona["inputted_by"] = this.global.Decrypt('mAuth').USERNAME
        registerMappingZona["inputted_by_bass"] = this.global.Decrypt('mAuth').KODE_BASS
        let bodyString = JSON.stringify(registerMappingZona);

        // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/saveMappingZona/', bodyString, options) // ...using post request
            .toPromise()
            .then(response => this.data = response.json());
    }

    getTeknisiSingle(kode_bass, kode_teknisi) {
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({ "kode_bass": kode_bass, "kode_teknisi": kode_teknisi });
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/getTeknisiSingle/', bodyString, options);
    }

    editTeknisi(registerTeknisi, kode_bass, kode_teknisi): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        registerTeknisi["kode_teknisi"] = kode_teknisi;
        registerTeknisi["kode_bass"] = kode_bass;

        let bodyString = JSON.stringify(registerTeknisi);

        // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/updateTeknisi/', bodyString, options) // ...using post request
            .toPromise()
            .then(response => this.data = response.json());
    }

}