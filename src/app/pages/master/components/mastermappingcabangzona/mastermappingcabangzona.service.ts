import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'
import { GlobalState } from '../../../../global.state';


@Injectable()
export class MasterMappingCabangZonaService {
    data: any;

    constructor(private http: Http, public global: GlobalState) {
    }

    getListMasterMappingCabangZona(kode_bass, kata_kunci): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({ "kode_cabang": kode_bass, "kata_kunci": kata_kunci }); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/mappingCabangZonaGet/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }

    deleteMappingZona(kode_cabang, kode_zona): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({ "kode_cabang": kode_cabang, "kode_zona": kode_zona }); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/deleteMappingZona/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }

    deleteTeknisi(kode_bass, kode_teknisi): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({ "kode_bass": kode_bass, "kode_teknisi": kode_teknisi }); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/deleteTeknisi/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }

    activateTeknisi(kode_bass, kode_teknisi): Promise<any> {
        let token = this.global.Decrypt('mAuth').TOKEN
        let bodyString = JSON.stringify({ "kode_bass": kode_bass, "kode_teknisi": kode_teknisi }); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.global.GlobalUrl + '/activateTeknisi/', bodyString, options)
            .toPromise()
            .then(response => this.data = response.json());
    }
}