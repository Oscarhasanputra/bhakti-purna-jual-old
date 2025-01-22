import { Component, ViewChild, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ModalDirective } from 'ng2-bootstrap';

import { BrowseCustomerListService } from './browsecustomerlist.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { GlobalState } from '../../../../../global.state';

@Component({
    selector: 'browsecustomerlist',
    encapsulation: ViewEncapsulation.None,
    styles: [require('./browsecustomerlist.component.scss')],
    template: require('./browsecustomerlist.component.html'),
})
export class browseCustomerList {

    public kode_dealer;
    public listCust: listCust[];
    public sKodeCust: any;
    data: Array<any> = [];
    listZona: SelectItem[] = [];
    public selectedListZona: string;
    sStorage: any;
    display: boolean = false;
    showPilihKodeCust: boolean = false;
    showPilihListZona: boolean = false;
    @Output() kodeCustomerChild = new EventEmitter<string>();
    private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

    showDialog() {
        this.display = true;
    }

    @ViewChild('childModal') childModal: ModalDirective;

    showChildModal(): void {
        this.childModal.show();
    }

    hideChildModal(): void {
        this.childModal.hide();
    }

    constructor(private browseCustomerListService: BrowseCustomerListService, protected router: Router, public global: GlobalState) {

        this.sStorage = this.global.Decrypt('mAuth');
        this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 25px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:34px"></i>{{message}}</div>'

        //bind zona
        if (this.sStorage.TYPE == "Cabang") {
            this.showPilihListZona = true;

            this.browseCustomerListService.getZonaList(this.sStorage.KODE_BASS).subscribe(
                data => {
                    this.data = data.json();
                    for (var i = 0; i < this.data.length; i++) {
                        if (this.data[i].ZONA === "ALL") {
                            this.listZona.push({ label: "PILIH ZONA", value: "PILIH ZONA" });
                        } else {
                            this.listZona.push({ label: this.data[i].NAMA_ZONA, value: this.data[i].ZONA });
                        }

                    }
                    for (var i = 0; i < this.listZona.length; i++) {
                        if (this.listZona[i].label === "JABODETABEK") {
                            this.selectedListZona = this.listZona[i].value;
                            this.bindListCustomer();
                            return;
                        } else {
                            this.selectedListZona = this.listZona[0].value;
                        }
                    }
                    this.bindListCustomer();
                },
                err => {
                    if (err._body == 'You are not authorized' || err.status == 500) {
                        alert("Your Token has expired, please login again !")
                        sessionStorage.clear();
                        this.router.navigate(['/login']);
                    }
                }
            );

        } else if (this.sStorage.KODE_BASS == this.global.Decrypt('mParameter').BASS_PUSAT) {
            this.showPilihListZona = true;

            this.browseCustomerListService.getZonaList(this.sStorage.KODE_BASS).subscribe(
                data => {
                    this.data = data.json();
                    for (var i = 0; i < this.data.length; i++) {
                        if (this.data[i].ZONA === "ALL") {
                            this.listZona.push({ label: "PILIH ZONA", value: "PILIH ZONA" });
                        } else {
                            this.listZona.push({ label: this.data[i].NAMA_ZONA, value: this.data[i].ZONA });
                        }

                    }

                    for (var i = 0; i < this.listZona.length; i++) {
                        if (this.listZona[i].label === "JABODETABEK") {
                            this.selectedListZona = this.listZona[i].value;
                            this.bindListCustomer();
                            return;
                        } else {
                            this.selectedListZona = this.listZona[0].value;
                        }
                    }
                    this.bindListCustomer();
                },
                err => {
                    if (err._body == 'You are not authorized' || err.status == 500) {
                        alert("Your Token has expired, please login again !")
                        sessionStorage.clear();
                        this.router.navigate(['/login']);
                    }
                }
            );
        } else {
            this.showPilihListZona = false;

            this.browseCustomerListService.getZonaList(this.sStorage.KODE_BASS).subscribe(
                data => {
                    this.data = data.json();
                    for (var i = 0; i < this.data.length; i++) {
                        if (this.data[i].ZONA === "ALL") {
                            this.listZona.push({ label: "PILIH ZONA", value: "PILIH ZONA" });
                        } else {
                            this.listZona.push({ label: this.data[i].NAMA_ZONA, value: this.data[i].ZONA });
                        }
                    }
                    for (var i = 0; i < this.listZona.length; i++) {
                        if (this.listZona[i].label === "JABODETABEK") {
                            this.selectedListZona = this.listZona[i].value;
                            this.bindListCustomer();
                            return;
                        } else {
                            this.selectedListZona = this.listZona[0].value;
                        }
                    }
                    this.bindListCustomer();
                },
                err => {
                    if (err._body == 'You are not authorized' || err.status == 500) {
                        alert("Your Token has expired, please login again !")
                        sessionStorage.clear();
                        this.router.navigate(['/login']);
                    }
                }
            );
        }

    }

    onBlurMethod() {
        this.execemit();
    }

    onRowSelect(event) {
        this.sKodeCust = event.data.KODE_CUSTOMER;
        this.display = false;
        this.execemit();
    }

    execemit() {
        this.kodeCustomerChild.emit(this.sKodeCust);
    }

    //bind list kustomer
    bindListCustomer() {
        if (this.sStorage.TYPE == "Cabang") {
            this.showPilihKodeCust = true;

            this.busyloadevent.busy = this.browseCustomerListService.getCustomerListPusat(this.selectedListZona).then(
                data => {
                    this.listCust = data;
                },
                err => {
                    if (err._body == 'You are not authorized' || err.status == 500) {
                        alert("Your Token has expired, please login again !")
                        sessionStorage.clear();
                        this.router.navigate(['/login']);
                    }
                }
            );
        } else if (this.sStorage.KODE_BASS == this.global.Decrypt('mParameter').BASS_PUSAT) {
            this.showPilihKodeCust = true;

            this.busyloadevent.busy = this.browseCustomerListService.getCustomerListPusat(this.selectedListZona).then(
                data => {
                    this.listCust = data;
                },
                err => {
                    if (err._body == 'You are not authorized' || err.status == 500) {
                        alert("Your Token has expired, please login again !")
                        sessionStorage.clear();
                        this.router.navigate(['/login']);
                    }
                }
            );
        } else {
            this.showPilihKodeCust = false;

            this.busyloadevent.busy = this.browseCustomerListService.getCustomerList(this.selectedListZona, this.sStorage.KODE_BASS).then(
                data => {
                    this.listCust = data;
                },
                err => {
                    if (err._body == 'You are not authorized' || err.status == 500) {
                        alert("Your Token has expired, please login again !")
                        sessionStorage.clear();
                        this.router.navigate(['/login']);
                    }
                }
            );
        }

    }

    onZonaChange(test) {
        this.bindListCustomer();
    }

}

export interface listCust {
    KODE_CUSTOMER;
    NAMA_CUSTOMER;
    TELP_CUSTOMER;
    ALAMAT_CUSTOMER;
    KOTA_CUSTOMER;
    NAMA_ZONA;
    HP_CUSTOMER;
}