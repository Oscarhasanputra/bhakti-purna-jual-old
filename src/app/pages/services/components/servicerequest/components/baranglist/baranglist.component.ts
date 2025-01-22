import { Component, ViewEncapsulation, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { BarangListService } from './baranglist.service';
import { Subject } from 'rxjs/Subject';
import { GlobalState } from '../../../../../../global.state';

@Component({
    selector: 'baranglist',
    encapsulation: ViewEncapsulation.None,
    styles: [require('./baranglist.scss')],
    template: require('./baranglist.html'),
})
export class BarangListComponent implements OnInit {
    public merkList: any;
    public jenisList: any;
    public barangList: any;
    public flagHidden: Boolean = false

    public gloKodeBass: any;
    public gloNamaBass: any;
    public gloUsername: any;
    public barangfilter = { kodeBarang: "", merk: "", jenis: "" }

    private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

    @Output() onHiddenMain = new EventEmitter<Boolean>();
    @Output() onCancel = new EventEmitter<Boolean>();
    @Output() onRowSelected = new EventEmitter<Object>();

    constructor(public router: Router, private actroute: ActivatedRoute, private service: BarangListService,
        public global: GlobalState) {
        this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 25px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:34px"></i>{{message}}</div>'
    }

    ngOnInit() {
        this.gloKodeBass = this.global.Decrypt('mAuth').KODE_BASS;
        this.gloNamaBass = this.global.Decrypt('mBass').NAMA_BASS;
        this.gloUsername = this.global.Decrypt('mAuth').USERNAME;
    }

    public buttonBarangBrowseClicked() {
        this.getMerk()
        this.getJenis()
        this.getBarang("", "", "")

        this.flagHidden = true
        this.onHiddenMain.emit(true)
    }

    // *
    public searchBarangClicked(kodeBarang: String, merk: String, jenis: String) {
        if (merk == "ALL" && jenis == "ALL") {
            this.getBarang(kodeBarang, "", "")
        } else if (merk == "ALL" && jenis !== "ALL") {
            this.getBarang(kodeBarang, "", jenis)
        } else if (merk !== "ALL" && jenis == "ALL") {
            this.getBarang(kodeBarang, merk, "")
        } else {
            this.getBarang(kodeBarang, merk, jenis)
        }
    }

    public onRowSelectBarang(event) {
        this.flagHidden = false
        this.onRowSelected.emit(event)
    }

    public onCancelBarangBrowse() {
        this.flagHidden = false
        this.onCancel.emit(false)
    }

    // search debounce barang
    public debounceSearchBarang(kodeBarang: string) {
        this.barangfilter['kodeBarang'] = kodeBarang
        this.getMerk()
        this.getJenis()
        this.searchBarangClicked(kodeBarang, "", "")
        this.flagHidden = true
        this.onHiddenMain.emit(true)
    }

    public searchBarangEventOnBlur(filter: string) {
        if (filter !== '') {
            this.barangfilter['kodeBarang'] = filter
            this.busyloadevent.busy = this.service.getBarang(filter, '', '').then(
                data => {
                    this.barangList = data

                    if (this.barangList.length == 1) {
                        let event = { data: data[0] }
                        this.onRowSelected.emit(event)
                    } else if (this.barangList.length > 1) {
                        this.flagHidden = true
                        this.onHiddenMain.emit(true)
                    } else {
                        alert("Barang Tidak ada dalam database")
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

    public getMerk() {
        this.busyloadevent.busy = this.service.getMerk().then(
            data => {
                this.merkList = data;
                this.barangfilter['merk'] = this.merkList[0].KODE_MEREK
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

    public getJenis() {
        this.busyloadevent.busy = this.service.getJenis().then(
            data => {
                this.jenisList = data;
                this.barangfilter['jenis'] = this.jenisList[0].KODE_JENIS
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

    public getBarang(kodeBarang: String, merk: String, jenis: String) {
        this.busyloadevent.busy = this.service.getBarang(kodeBarang, merk, jenis).then(
            data => {
                this.barangList = data;
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