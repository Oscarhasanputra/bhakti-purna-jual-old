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

    constructor(public router: Router, private actroute: ActivatedRoute, private service: TeknisiListService, public global: GlobalState) {

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

    // get data in service
    public getTeknisiList(kodeBass: String, kodeTeknisi: String) {
        this.service.getTeknisiList(kodeBass, kodeTeknisi, "A").then(
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