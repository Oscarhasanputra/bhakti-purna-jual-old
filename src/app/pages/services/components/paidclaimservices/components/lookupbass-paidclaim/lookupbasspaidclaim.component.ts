import { Component, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';

import { LookUpBassPaidClaimService } from './lookupbasspaidclaim.service';
import { GlobalState } from '../../../../../../global.state';

@Component({
    selector: 'lookupbass-paidclaim',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './lookupbasspaidclaim.html',
    styleUrls: ['./lookupbasspaidclaim.scss']
})
export class LookUpBassPaidClaim {
    busyLoaderEvent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);
    display: boolean = false;
    datas: any[];
    searchBass: String = "";
    selectedBass: any;

    @Output() modalData = new EventEmitter<String>();

    constructor(protected service: LookUpBassPaidClaimService, protected router: Router, public global: GlobalState) {
        this.busyLoaderEvent.template = `<div style="margin-top:150px; margin-left:550px; position: fixed; z-index:1000; text-align:center; font-size: 24px; ">
                                      <i class="fa fa-spinner fa-spin" style="font-size:36px;"></i>
                                      {{message}}
                                      </div>`;
    }

    showModal() {
        this.display = true;
        this.loadDataBass();
    }

    textChange() {
        // console.log(this.searchBass);
        this.modalData.emit(this.searchBass);
    }

    onRowSelect(event) {
        this.searchBass = event.data.KODE_BASS;
        this.modalData.emit(this.searchBass);
        this.display = false;
    }

    loadDataBass() {
        if (this.global.Decrypt('mAuth').TYPE == "Cabang") {
            this.busyLoaderEvent.busy = this.service.getBassListUnderCabang(this.global.Decrypt('mAuth').KODE_BASS)
                .then(
                data => {
                    this.datas = data;
                },
                err => {
                    if (err._body.indexOf("TokenExpiredError") && err.status == 500) {
                        alert("Your Token has expired, please login again !")
                        sessionStorage.clear();
                        this.router.navigate(['/login']);
                    }
                });
        } else {
            this.busyLoaderEvent.busy = this.service.getBassList("")
                .then(
                data => {
                    this.datas = data;
                },
                err => {
                    if (err._body.indexOf("TokenExpiredError") && err.status == 500) {
                        alert("Your Token has expired, please login again !")
                        sessionStorage.clear();
                        this.router.navigate(['/login']);
                    }
                });
        }
    }
}