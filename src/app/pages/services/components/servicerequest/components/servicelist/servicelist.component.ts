import { Component, ViewEncapsulation, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { ServiceListService } from './servicelist.service';
import { Subject } from 'rxjs/Subject';
import { GlobalState } from '../../../../../../global.state';

@Component({
    selector: 'servicelist',
    encapsulation: ViewEncapsulation.None,
    styles: [require('./servicelist.scss')],
    template: require('./servicelist.html'),
})
export class ServiceListComponent implements OnInit {
    busyLoaderEvent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);
    public serviceList: any;
    public today: any = new Date();
    public dateFr: any;
    public dateTo: any;
    public filterService = { kodeService: "", nomorNota: "" }
    public flagByDate: Boolean = false
    public flagHidden: Boolean = false

    public gloKodeBass: any;
    public gloNamaBass: any;
    public gloUsername: any;

    @Output() onHiddenMain = new EventEmitter<Boolean>();
    @Output() onCancel = new EventEmitter<Boolean>();
    @Output() onRowSelected = new EventEmitter<Object>();

    private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

    constructor(public router: Router, private actroute: ActivatedRoute, private service: ServiceListService,
        public global: GlobalState) {
        // set tanggal dari dan sampai untuk filter browse service list
        let month = this.today.getMonth();
        let year = this.today.getFullYear();
        let prevMonth = (month === 0) ? 11 : month - 1;
        let prevYear = (prevMonth === 11) ? year - 1 : year;
        this.dateFr = new Date();
        this.dateFr.setMonth(prevMonth);
        this.dateFr.setFullYear(prevYear);
        this.dateTo = new Date();

        this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 25px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:34px"></i>{{message}}</div>'
    }

    ngOnInit() {
        this.gloKodeBass = this.global.Decrypt('mAuth').KODE_BASS;
        this.gloNamaBass = this.global.Decrypt('mBass').NAMA_BASS;
        this.gloUsername = this.global.Decrypt('mAuth').USERNAME;
    }

    // event panggil service
    public buttonServiceBrowseClicked() {
        if (this.flagByDate) {
            this.getServiceList("", this.gloKodeBass, this.dateFr.toISOString().substring(0, 10), this.dateTo.toISOString().substring(0, 10), "ServiceRequest", "")
        } else {
            this.getServiceList("", this.gloKodeBass, "", "", "ServiceRequest", "")
        }

        this.flagHidden = true
        this.onHiddenMain.emit(true)
    }

    public buttonSearchServiceClicked(kodeService: String, kodeNota: String) {
        if (this.flagByDate) {
            this.getServiceList(kodeService, this.gloKodeBass, this.dateFr, this.dateTo, "ServiceRequest", kodeNota)
        } else {
            this.getServiceList(kodeService, this.gloKodeBass, "", "", "ServiceRequest", kodeNota)
        }
    }

    public onRowSelect(event) {
        this.flagHidden = false
        this.onRowSelected.emit(event)
    }

    // button kembali service
    public onCancelServiceBrowse() {
        this.flagHidden = false
        this.onCancel.emit(false)
    }

    // search debounce service
    public debounceSearchService(kodeService: string) {
        this.filterService['kodeService'] = kodeService
        this.buttonSearchServiceClicked(kodeService, "")
        this.flagHidden = true
        this.onHiddenMain.emit(true)
    }

    public searchServiceEventOnBlur(kodeService: string) {
        if (kodeService !== '') {
            this.filterService['kodeService'] = kodeService
            this.busyloadevent.busy = this.service.getServiceList(kodeService, this.gloKodeBass, "", "", "ServiceRequest", "").then(
                data => {
                    this.serviceList = data
                    // console.log("jumlah row : ", this.serviceList.length)
                    if (this.serviceList.length == 1) {
                        let event = { data: data[0] }
                        this.onRowSelected.emit(event)
                    } else if (this.serviceList.length > 1) {
                        this.flagHidden = true
                        this.onHiddenMain.emit(true)
                    } else {
                        alert("Nomor Tidak ada dalam database")
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

    // get data in service
    public getServiceList(kodeService: String, kodeBass: String, dari: String, sampai: String, type: String, nomorNota: String) {
        this.busyloadevent.busy = this.service.getServiceList(kodeService, kodeBass, dari, sampai, type, nomorNota).then(
            data => {
                this.serviceList = data;
                // console.log(this.serviceList)
            },
            err => {
                console.log('status', err.status)
                console.log('token1', err._body.indexOf("TokenExpiredError"))
                // console.log('token2', err._body.data.indexOf("TokenExpiredError"))
                if (err._body.indexOf("TokenExpiredError") >= 0 && err.status == 500) {
                    alert("Your Token has expired, please login again !")
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                } else {
                    alert(err._body);
                }
            });
    }


}