import { Component, ViewEncapsulation, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { TeknisiListService } from './teknisilist.service';
import { Subject } from 'rxjs/Subject';
import { GlobalState } from '../../../../../../global.state';

@Component({
    selector: 'teknisilist',
    encapsulation: ViewEncapsulation.None,
    styles: [require('./teknisilist.scss')],
    template: require('./teknisilist.html'),
})
export class TeknisiListComponent implements OnInit {
    public teknisiList: any;
    public filterTeknisi = { kode_teknisi: "" }
    public flagHidden: Boolean = false

    public gloKodeBass: any;
    public gloNamaBass: any;
    public gloUsername: any;

    @Output() onHiddenMain = new EventEmitter<Boolean>();
    @Output() onCancel = new EventEmitter<Boolean>();
    @Output() onRowSelected = new EventEmitter<Object>();

    private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

    constructor(public router: Router, private actroute: ActivatedRoute, private service: TeknisiListService, public global: GlobalState) {
        this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 25px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:34px"></i>{{message}}</div>'

    }

    ngOnInit() {
        this.gloKodeBass = this.global.Decrypt('mAuth').KODE_BASS;
        this.gloNamaBass = this.global.Decrypt('mBass').NAMA_BASS;
        this.gloUsername = this.global.Decrypt('mAuth').USERNAME;
    }

    public buttonBrowseClicked() {
        this.getTeknisiList(this.gloKodeBass, "")
        this.flagHidden = true
        this.onHiddenMain.emit(true)
    }

    public buttonSearchClicked(kode) {
        this.getTeknisiList(this.gloKodeBass, kode)
    }

    public onRowSelect(event) {
        this.flagHidden = false
        this.onRowSelected.emit(event)
    }

    public onCancelBrowse() {
        this.flagHidden = false
        this.onCancel.emit(false)
    }

    // search debounce service
    public debounceSearch(kode: string) {
        this.filterTeknisi['kodeTeknisi'] = kode
        this.buttonSearchClicked(kode)
        this.flagHidden = true
        this.onHiddenMain.emit(true)
    }

    // searchTeknisiEventOnBlur
    public searchTeknisiEventOnBlur(filter: string) {
        if (filter !== '') {
            this.filterTeknisi['kode_teknisi'] = filter
            this.busyloadevent.busy = this.service.getTeknisiList(this.gloKodeBass, filter, 'A').then(
                data => {
                    this.teknisiList = data
                    // console.log("jumlah row teknisi : ", this.teknisiList.length)
                    if (this.teknisiList.length == 1) {
                        let event = { data: data[0] }
                        this.onRowSelected.emit(event)
                    } else if (this.teknisiList.length > 1) {
                        this.flagHidden = true
                        this.onHiddenMain.emit(true)
                    } else {
                        alert("Teknisi Tidak ada dalam database")
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
    public getTeknisiList(kodeBass: String, kodeTeknisi: String) {
        this.busyloadevent.busy = this.service.getTeknisiList(kodeBass, kodeTeknisi, "A").then(
            data => {
                this.teknisiList = data;
                // console.log(this.teknisiList)
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