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
export class FinishingServiceRequestAllService {

    constructor(public http: Http, public global: GlobalState) {
    }

    // getteknisi
    getTeknisi(kode_bass: String, kode_teknisi: String, status: String): Promise<any> {
        let bodyString = JSON.stringify({ kode_bass: kode_bass, kode_teknisi: kode_teknisi, status: status }); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getTeknisiList/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    }     

    // getPerbaikan
    getPerbaikan(kodeBarang: String, namaKerusakan: String, namaPenyebab:String): Promise<any> {
        let bodyString = JSON.stringify({ kodeBarang: kodeBarang, namaKerusakan: namaKerusakan, namaPenyebab:namaPenyebab});
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getperbaikan/',bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    }  

    // getPenyebab
    getPenyebab(kodeBarang: String, namaKerusakan: String): Promise<any> {
        let bodyString = JSON.stringify({ kodeBarang: kodeBarang, namaKerusakan: namaKerusakan}); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getpenyebab/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    }  

    // getservicelist <== ada di module service request

    // getBiayaTransportasi     
    getBiayaTransportasi(): Promise<any> {
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getbiayatransportasi/', {}, options)
            .toPromise()
            .then(response =>  response.json())
    }    

    // invoiceServiceRequest  
    invoiceServiceRequest(kodeBass: String, kodeInvoice: String, kodeBarang: String, kodeFinishing: String): Promise<any> {
        let bodyString = JSON.stringify({ kodeBass: kodeBass, kodeInvoice: kodeInvoice, kodeBarang: kodeBarang, kodeFinishing: kodeFinishing}); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getpenyebab/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    }

    // getReviewClainService
    getReviewClaimService(kodeService: String): Promise<any> {
        let bodyString = JSON.stringify({ kodeService: kodeService}); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getReviewClaimService/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    } 

    // GET_HARGA <== ada di service request

    // getTransportasi
    getTransportasi(kodeTransportasi: String): Promise<any> {
        let bodyString = JSON.stringify({ kodeTransportasi: kodeTransportasi}); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/gettransportasi/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    }  

    // calculatePPN
    calculatePPN(hargaSukuCadang: number, hargaService: number, hargaTransport: number): Promise<any> {
        let bodyString = JSON.stringify({ hargaSukuCadang: hargaSukuCadang, hargaService: hargaService, hargaTransport: hargaTransport}); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/calculateppn/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    }    

    // KERUSAKAN_SORT_SELECT <== udah ada di service request

    // getDetailServiceRequest
    getDetailServiceRequest(kodeService: String): Promise<any> {
        let bodyString = JSON.stringify({ kodeService: kodeService}); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getdetailservicerequest/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    } 

    // getStokInvoiceSelectByKodePartAndInvoice
    getStokInvoiceSelectByKodePartAndInvoice(kodeBass: String, kodePart: String, noInvoice: String): Promise<any> {
        let bodyString = JSON.stringify({ kodeBass: kodeBass, kodePart: kodePart, noInvoice: noInvoice}); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getStokInvoiceselectbykodepartandinvoice/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    }

    // getDetailServiceRequestReceived  
    getDetailServiceRequestReceived(kodeService: String): Promise<any> {
        let bodyString = JSON.stringify({ kodeService: kodeService}); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getdetailservicerequestreceived/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    } 

    // getSparepart
    getSparepart(kodeBass: String, kodeBarang: String, nomorInvoice: String, kodeSparepart:String, jenisService:String, kodeFinishing:String): Promise<any> {
        let bodyString = JSON.stringify({ kodeBass: kodeBass, kodeBarang: kodeBarang, nomorInvoice: nomorInvoice, kodeSparepart:kodeSparepart, jenisService:jenisService, kodeFinishing:kodeFinishing}); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/getsparepart/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    }   

    // saveServiceFinishing
    saveServiceFinishingAll(data): Promise<any> {
        let bodyString = JSON.stringify(data); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/saveservicefinishingall/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    } 

    // serviceInsertDetail
    serviceInsertDetail(data): Promise<any> {
        let bodyString = JSON.stringify(data); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/serviceinsertdetail/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    }

    // reject
    reject(data): Promise<any> {
        let bodyString = JSON.stringify(data); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/reject/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    }   

    // updatestatus  
    updatestatus(kodeService:String, status:String): Promise<any> {
        let bodyString = JSON.stringify({kodeService:kodeService, status:status}); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/updatestatus/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    }  

    // stokInsert  
    stokInsert(kodeBass:String, partID:String, noInvoice:String, tanggal:String, description:String, qty:number, kodeFinishing:String): Promise<any> {
        let bodyString = JSON.stringify({kodeBass:kodeBass, partID:partID, noInvoice:noInvoice, tanggal:tanggal, description:description, qty:qty, kodeFinishing:kodeFinishing}); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/stokInsert/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    }    

    // updateStatusBeforeClaimService       
    updateStatusBeforeClaimService(kodeService:String): Promise<any> {
        let bodyString = JSON.stringify({kodeService:kodeService}); // Stringify payload
        // get token in localstorage
        let token = this.global.Decrypt('mAuth').TOKEN
        let headers = new Headers({ 'Content-Type': 'application/json', 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.global.GlobalUrl + '/updateStatusBeforeClaimService/', bodyString, options)
            .toPromise()
            .then(response =>  response.json())
    }     
}