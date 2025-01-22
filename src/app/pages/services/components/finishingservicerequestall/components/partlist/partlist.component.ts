import { Component, ViewEncapsulation, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { PartlistService } from './partlist.service';
import { Subject } from 'rxjs/Subject';
import { GlobalState } from '../../../../../../global.state';

@Component({
    selector: 'partlist',
    encapsulation: ViewEncapsulation.None,
    styles: [require('./partlist.scss')],
    template: require('./partlist.html'),
})
export class PartListComponent implements OnInit {
    public partList: any;
    public filterPart = { part: "", kodeBarang: "", kodeInvoice: "", jenisService: "", kodeFinishing: "" }
    public flagHidden: Boolean = false

    public gloKodeBass: any;
    public gloNamaBass: any;
    public gloUsername: any;
    public selectedParts: any;

    @Output() onHiddenMain = new EventEmitter<Boolean>();
    @Output() onCancel = new EventEmitter<Boolean>();
    @Output() onRowSelected = new EventEmitter<Object>();

    constructor(public router: Router, private actroute: ActivatedRoute, private service: PartlistService, public global: GlobalState) {

    }

    ngOnInit() {
        this.gloKodeBass = this.global.Decrypt('mAuth').KODE_BASS;
        this.gloNamaBass = this.global.Decrypt('mBass').NAMA_BASS;
        this.gloUsername = this.global.Decrypt('mAuth').USERNAME;
    }

    public buttonBrowseClicked(kodeBarang: string, kodeInvoice: string, jenisService: string, kodeFinishing: string) {
        this.selectedParts = []

        this.filterPart['kodeBarang'] = kodeBarang;
        this.filterPart['kodeInvoice'] = kodeInvoice;
        this.filterPart['jenisService'] = jenisService;
        this.filterPart['kodeFinishing'] = kodeFinishing;
        this.getSparepart(this.gloKodeBass, kodeBarang, kodeInvoice, "", jenisService, kodeFinishing)
        this.flagHidden = true
        this.onHiddenMain.emit(true)
    }

    public buttonSearchClicked(kodePart: String) {
        this.getSparepart(this.gloKodeBass, this.filterPart.kodeBarang, this.filterPart.kodeInvoice, kodePart, this.filterPart.jenisService, this.filterPart.kodeFinishing)
    }

    public onSelected(data) {

        // console.log("onSelected part list : " + data)

        for (let i = 0; i < data.length; i++) {
            data[i].QTY = 1
        }

        this.flagHidden = false
        this.onRowSelected.emit(data)
    }

    public onCancelBrowse() {
        this.flagHidden = false
        this.onCancel.emit(false)
    }

    // search debounce service
    public debounceSearch(kodeBass: string, kodeBarang: string, kodeInvoice: string, kodePart: string, jenisService: string, kodeFinishing: string) {
        this.selectedParts = []
        this.filterPart['part'] = kodePart
        this.filterPart['kodeBarang'] = kodeBarang;
        this.filterPart['kodeInvoice'] = kodeInvoice;
        this.filterPart['jenisService'] = jenisService;
        this.filterPart['kodeFinishing'] = kodeFinishing;
        this.buttonSearchClicked(kodePart)
        this.flagHidden = true
        this.onHiddenMain.emit(true)
    }

    // get data in service
    public getSparepart(kodeBass: String, kodeBarang: String, kodeInvoice: String, kodePart: String, jenisService: String, kodeFinishing: String) {
        this.service.getSparepart(kodeBass, kodeBarang, kodeInvoice, kodePart, jenisService, kodeFinishing).then(
            data => {
                this.partList = data;
                // console.log(this.partList)
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