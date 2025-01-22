import { Component, ViewEncapsulation, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { CustomerListService } from './customerlist.service';
import { Subject } from 'rxjs/Subject';
import { GlobalState } from '../../../../../../global.state';

@Component({
    selector: 'customerlist',
    encapsulation: ViewEncapsulation.None,
    styles: [require('./customerlist.scss')],
    template: require('./customerlist.html'),
})
export class CustomerListComponent implements OnInit {
    public zonaList: any;
    public customerList: any;
    public flagHidden: Boolean = false

    public gloKodeBass: any;
    public gloNamaBass: any;
    public gloUsername: any;
    public customer = { filter: "", zona: "" }

    private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

    @Output() onHiddenMain = new EventEmitter<Boolean>();
    @Output() onCancel = new EventEmitter<Boolean>();
    @Output() onRowSelected = new EventEmitter<Object>();

    constructor(public router: Router, private actroute: ActivatedRoute, private service: CustomerListService,
        public global: GlobalState) {

        this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 25px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:34px"></i>{{message}}</div>'

    }

    ngOnInit() {
        this.gloKodeBass = this.global.Decrypt('mAuth').KODE_BASS;
        this.gloNamaBass = this.global.Decrypt('mBass').NAMA_BASS;
        this.gloUsername = this.global.Decrypt('mAuth').USERNAME;
    }


    // event - event customer *
    public buttonCustomerBrowseClicked() {
        this.busyloadevent.busy = this.service.getZonaList(this.gloKodeBass).then(
            data => {
                this.zonaList = data;
                this.customer.zona = this.zonaList[0].ZONA

                this.getCustomer("", this.customer.zona)

                this.flagHidden = true
                this.onHiddenMain.emit(true)
            },
            err => {
                if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                    alert("Your Token has expired, please login again !")
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                } else {
                    alert(err._body.data);
                }
            });
    }

    // *
    public searchCustomerClicked(filter: String, zona: String) {
        if (zona == "ALL") {
            this.getCustomer(filter, "")
        } else {
            this.getCustomer(filter, zona)
        }
    }

    public onRowSelectCustomer(event) {
        this.flagHidden = false
        this.onRowSelected.emit(event)
    }

    //  button kembali customer
    public onCancelCustomerBrowse() {
        this.flagHidden = false
        this.onCancel.emit(false)
    }

    // search debounce customer
    public debounceSearchCustomer(kodeCustomer: string) {
        this.customer['filter'] = kodeCustomer
        this.getZona()
        this.searchCustomerClicked(kodeCustomer, "")

        this.flagHidden = true
        this.onHiddenMain.emit(true)
    }

    public searchCustomerEventOnBlur(filter: string) {
        if (filter !== '') {
            this.customer['filter'] = filter
            this.busyloadevent.busy = this.service.getCustomerService(filter, '', this.gloKodeBass).then(
                data => {
                    this.customerList = data
                    // console.log("jumlah row customer : ", this.customerList.length)
                    if (this.customerList.length == 1) {
                        let event = { data: data[0] }
                        this.onRowSelected.emit(event)
                    } else if (this.customerList.length > 1) {
                        this.flagHidden = true
                        this.onHiddenMain.emit(true)
                    } else {
                        alert("Customer Tidak ada dalam database")
                    }
                },
                err => {
                    if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                        alert("Your Token has expired, please login again !")
                        sessionStorage.clear();
                        this.router.navigate(['/login']);
                    } else {
                        alert(err._body.data);
                    }
                });
        }
    }

    public getZona() {
        this.busyloadevent.busy = this.service.getZonaList(this.gloKodeBass).then(
            data => {
                this.zonaList = data;
                this.customer.zona = this.zonaList[0].ZONA
            },
            err => {
                if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                    alert("Your Token has expired, please login again !")
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                } else {
                    alert(err._body.data);
                }
            });
    }

    public getCustomer(filter: String, zona: String) {
        this.busyloadevent.busy = this.service.getCustomerService(filter, zona, this.gloKodeBass).then(
            data => {
                this.customerList = data;
            },
            err => {
                if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                    alert("Your Token has expired, please login again !")
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                } else {
                    alert(err._body.data);
                }
            });
    }


}