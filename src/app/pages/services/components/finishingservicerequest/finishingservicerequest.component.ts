import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { FinishingServiceRequestService } from './finishingservicerequest.service';
import { ServiceRequestService } from '../servicerequest/servicerequest.service';
import { Subject } from 'rxjs/Subject';
import { DatePipe } from '@angular/common';
import { GlobalState } from '../../../../global.state';

@Component({
    selector: 'finishingservicerequest',
    encapsulation: ViewEncapsulation.None,
    styles: [require('./finishingservicerequest.scss')],
    template: require('./finishingservicerequest.html'),
    providers: [DatePipe, ConfirmationService]
})
export class FinishingServiceRequestComponent implements OnInit {
    busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

    kodePart: string = ""
    public appCode: String = "APPL00012";
    public hakAkses: any;
    public data: any;

    public today: any = new Date();
    public gloKodeBass: any;
    public gloNamaBass: any;
    public gloUsername: any;

    public flagButtonInsert: Boolean = false;
    public flagButtonUpdate: Boolean = false;
    public flagButtonClose: Boolean = false;
    public flagButtonReject: Boolean = false;
    public flagButtonReOpen: Boolean = false;
    public flagEdit: Boolean = false;
    public flaghidenMain: Boolean = false;
    public flagRejected: Boolean = false;
    public statusReviewNotValid: Boolean = false;

    // flag for property 
    public flagTanggalSelesaiTextbox: Boolean = true;
    public flagTanggalKembaliTextbox: Boolean = true;
    public flagDiambilOlehCustomerTextbox: Boolean = true;
    public flagPerbaikanCombo: Boolean = true;
    public flagPenyebabCombo: Boolean = true;
    public flagTeknisi: Boolean = true;
    public flagBiayaTransportCombo: Boolean = true;
    public flagSparepartsQty: Boolean = true;
    public flagNomorInoviceTextbox: Boolean = true;
    public flagNomorInvoiceButton: Boolean = true;
    public flagKodeSparepartTextbox: Boolean = true;
    public flagNomorSeriTextbox: Boolean = true;
    public flagTanggalBeliTextbox: Boolean = true;
    public flagPengaduanCombo: Boolean = true;
    public flagNomorNotaTexboxt: Boolean = true;
    public flagStatusBarang: Boolean = true;
    public flagAddSparepartButton: Boolean = true;
    public flagRemoveSparepartButton: Boolean = true;
    public LblNotificationPO: Boolean = true;

    // list
    public status_brg: any = ['Warranty', 'NonWarranty', 'ServiceWarranty'];
    public assignBassList: any;
    public kerusakanList: any;
    public perbaikanList: any;
    public penyebabList: any;
    public biayaTransportList: any;
    public detailServiceRequestReceivedList: any;

    // variable biaya2
    public hargaTotalSukuCadang: number = 0
    public biayaService: number = 0
    public subTotal: number = 0
    public ppn: number = 0
    public totalBiayaService: number = 0
    public biayaTransportasi: any = [{ KODE_TRANS: "", JARAK: "", BIAYA_TRANSPORTASI: 0 }]

    constructor(public router: Router, private actroute: ActivatedRoute, private servicerequest: ServiceRequestService, private service: FinishingServiceRequestService,
        private datepipe: DatePipe, private confirmationService: ConfirmationService, public global: GlobalState) {
        this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 25px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:34px"></i>{{message}}</div>'
    }

    ngOnInit() {
        this.gloKodeBass = this.global.Decrypt('mAuth').KODE_BASS;
        this.gloNamaBass = this.global.Decrypt('mBass').NAMA_BASS;
        this.gloUsername = this.global.Decrypt('mAuth').USERNAME;

        // cek hak akses 
        this.hakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

        if (this.hakAkses.HAK_AKSES) {
            // validasi tombol insert dan edit
            if (this.hakAkses.HAK_INSERT) {
                this.flagButtonInsert = true
                this.flagButtonClose = true
                this.flagButtonReject = true
                this.flagButtonReOpen = true
            }
            if (this.hakAkses.HAK_AKSES) {
                this.flagEdit = true
            }
            this.newData()

            if (this.actroute.snapshot.params['no_service']) {
                let kodeService = this.actroute.snapshot.params['no_service']
                this.busyloadevent.busy = this.service.getService(kodeService).then(
                    data => {
                        // console.log('ambil data by param: ', data)
                        let event = { data: data[0] }
                        this.onRowSelectedLookupService(event);
                    },
                    err => {
                        console.log(err)
                    }
                )
            };

        } else {
            alert('Anda tidak berhak mengakses halaman ini!');
            this.router.navigate(['/pages/home']);
        }
    }

    public newData() {
        // console.log("load new data")
        this.data = {
            kodeService: "",
            // tanggal: this.today,
            // jamMasuk: this.today.getHours() + ":" + this.today.getMinutes(),
            tanggal: "",
            jamMasuk: "",
            kodeCustomer: "",
            namaCustomer: "",
            alamatCustomer: "",
            telpCustomer: "",
            hpCustomer: "",
            kotaCustomer: "",
            zonaCustomer: "",
            kodeProduk: "",
            namaProduk: "",
            merk: "",
            jenis: "",
            nomorSeri: "",
            tanggalBeli: "",
            kodeBass: this.gloKodeBass,
            jenisService: "Internal",
            statusProduk: this.status_brg[0],
            kodePengaduan: "",
            kelengkapan: "",
            catatan: "",
            biaya: "",
            status: "New",
            inputtedby: this.gloUsername,
            inputtedbyBass: this.gloKodeBass,
            inputtedDate: this.today,
            nomorNota: "",
            assignToBass: "",
            alamatAssignToBass: "",
            kotaAssignToBass: "",
            emailAssignToBass: "",
            // property data detail {kodeSparepart, namaSparepart, noInvoice, harga, qty}
            dataDetail: [],

            // tambah propertu keperluan finishing service
            tanggalSelesai: "",
            tanggalKembali: "",
            kodeTeknisi: "",
            diambilOleh: "",
            penyebab: "",
            perbaikan: "",
            kodeInvoice: ""
        }

        this.biayaTransport()
    }

    // fungsi enable disable detail
    public Disable_Enable_Detail(flag: Boolean, data) {
        this.hakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];
        if (!this.hakAkses.HAK_INSERT) {
            flag = false
        }

        this.flagTanggalSelesaiTextbox = flag;
        this.flagTanggalKembaliTextbox = flag;
        this.flagDiambilOlehCustomerTextbox = flag;
        this.flagTeknisi = flag;
        this.flagPerbaikanCombo = flag;
        this.flagPenyebabCombo = flag;

        if (flag == false) {
            this.flagAddSparepartButton = flag;
            this.flagKodeSparepartTextbox = flag;
            this.flagTanggalSelesaiTextbox = flag;
            this.flagTanggalKembaliTextbox = flag;
            this.flagTeknisi = flag;
        } else {
            this.flagTanggalSelesaiTextbox = flag;
            this.flagTanggalKembaliTextbox = flag;
            this.flagTeknisi = flag;
        }
        this.flagRemoveSparepartButton = flag;
        this.flagBiayaTransportCombo = flag;
        this.flagSparepartsQty = flag;
        this.flagButtonInsert = flag;

        // Jika service tersebut bukan dibuat oleh bass pusat maka tidak boleh direject
        if (this.data.inputtedbyBass == this.global.Decrypt('mParameter').BASS_PUSAT && this.data.kodeBass != this.global.Decrypt('mParameter').BASS_PUSAT) {
            this.flagButtonReject = flag;
        } else {
            this.flagButtonReject = false;
        }

        this.flagButtonClose = flag;
        this.flagNomorInvoiceButton = flag;
        this.flagNomorSeriTextbox = flag;
        this.flagTanggalBeliTextbox = flag;
        this.flagAddSparepartButton = flag;
        this.flagPengaduanCombo = flag;
        this.flagNomorNotaTexboxt = flag;
        this.flagStatusBarang = flag;
    }

    //event event service list
    public onRowSelectedLookupService(event) {
        // console.log(event)

        // console.log("on row selectd lookup service : " + JSON.stringify(event.data))

        // Redirect if central bass want to edit rejected service to finishing service all
        if (this.gloKodeBass == this.global.Decrypt('mParameter').BASS_PUSAT
            && event.data.STATUS == "Rejected") {
            this.router.navigate(['pages/service/finishingservicerequestall']);
        }

        // label rejected nilainya false
        this.flagRejected = false;

        if (this.global.Decrypt('mAuth').TYPE == "Cabang") {
            // panggil fungsi disable enable detail nilain false
            this.Disable_Enable_Detail(false, this.data)
        } else if (event.data.STATUS == "Rejected") {
            // panggil fungsi disable enable detail nilai false
            // reject2an nilannya true
            this.Disable_Enable_Detail(false, this.data)
            this.flagRejected = true
        } else if (event.data.STATUS == "Closed" && event.data.Rejection_Comment !== "") {
            // panggil fungsi disable enable detail nilain false
            // reject2an nilannya true
            this.Disable_Enable_Detail(false, this.data)
            this.flagRejected = true
        } else {
            if (event.data.STATUS == "Closed" || event.data.STATUS == "Done") {
                // jika ada di table review dan statusnya 0 maka diaktifkan lagi untuk pengeditannya
                // panggil review GET_REVIEW_CLAIM_SERVICE
                this.getReviewClaimService(event.data.KODE_SERVICE)
            } else {
                if (event.data.KODE_CLAIM == "" || event.data.KODE_CLAIM == undefined) {
                    // disable enable detail true
                    this.Disable_Enable_Detail(true, this.data)
                }
            }
        }

        // Visible of close and reopen button
        this.flagButtonReOpen = false;
        this.flagButtonClose = false;

        if (event.data.STATUS != "Closed" && (event.data.KODE_CLAIM == "" || event.data.KODE_CLAIM == undefined)) {
            // close button = true
            this.flagButtonClose = true
        } else {
            // if status review not valid = true 
            // maka close button true
            if (this.statusReviewNotValid) {
                this.flagButtonClose = true
            }
        }

        if (event.data.STATUS == "New" && this.gloKodeBass == this.global.Decrypt('mParameter').BASS_PUSAT) {
            // update status jadi opened
            this.service.updatestatus(event.data.KODE_SERVICE, 'Opened').then(
                data => {
                    // console.log("Update status : " + event.data)
                },
                err => {
                    if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                        alert("Your Token has expired, please login again !")
                        sessionStorage.clear();
                        this.router.navigate(['/login']);
                    } else {
                        alert(err._body.data);
                    }
                }
            )
        }

        // property data detail {kodeSparepart, namaSparepart, noInvoice, harga, qty}
        this.data.dataDetail = []

        this.pengaduan(event.data.KODE_PRODUK)
        this.penyebab(event.data.KODE_PRODUK, event.data.KODE_PENGADUAN)
        this.getDetailServiceRequest(event.data.KODE_SERVICE)
        this.getDetailServiceRequestReceived(event.data.KODE_SERVICE)

        this.data['kodeService'] = event.data.KODE_SERVICE
        this.data['tanggal'] = new Date(event.data.TANGGAL)
        this.data['jamMasuk'] = event.data.JAM_MASUK
        this.data['kodeCustomer'] = event.data.KODE_CUSTOMER
        this.data['namaCustomer'] = event.data.NAMA_CUSTOMER
        this.data['alamatCustomer'] = event.data.ALAMAT_CUSTOMER
        this.data['telpCustomer'] = event.data.TELP_CUSTOMER
        this.data['hpCustomer'] = event.data.HP_CUSTOMER
        this.data['kotaCustomer'] = event.data.KOTA_CUSTOMER
        this.data['zonaCustomer'] = event.data.NAMA_ZONA
        this.data['kodeProduk'] = event.data.KODE_PRODUK
        this.data['namaProduk'] = event.data.NM_BRG
        this.data['merk'] = event.data.MERK
        this.data['jenis'] = event.data.JNS_BRG
        this.data['nomorSeri'] = event.data.NOMOR_SERI
        this.data['tanggalBeli'] = new Date(event.data.TANGGAL_BELI)
        this.data['kodeBass'] = event.data.KODE_BASS
        this.data['jenisService'] = event.data.JENIS_SERVICE
        this.data['statusProduk'] = event.data.STATUS_PRODUK
        this.data['kodePengaduan'] = event.data.KODE_PENGADUAN
        this.data['kelengkapan'] = event.data.KELENGKAPAN
        this.data['catatan'] = event.data.CATATAN
        this.data['biaya'] = event.data.BIAYA
        this.data['status'] = event.data.STATUS
        this.data['nomorNota'] = event.data.NOMOR_NOTA

        // tambah propertu keperluan finishing service
        if (!event.data.TANGGAL_SELESAI) {
            this.data['tanggalSelesai'] = ""
        } else {
            this.data['tanggalSelesai'] = new Date(event.data.TANGGAL_SELESAI)
        }

        if (!event.data.TANGGAL_KEMBALI) {
            this.data['tanggalKembali'] = ""
        } else {
            this.data['tanggalKembali'] = new Date(event.data.TANGGAL_KEMBALI)
        }

        if (!event.data.KODE_TEKNISI) {
            this.data['kodeTeknisi'] = ""
        } else {
            this.data['kodeTeknisi'] = event.data.KODE_TEKNISI
        }

        if (!event.data.DIAMBIL_OLEH) {
            this.data['diambilOleh'] = ""
        } else {
            this.data['diambilOleh'] = event.data.DIAMBIL_OLEH
        }

        this.calculate()
        this.flaghidenMain = false
    }

    public onCancelLookupService(flag) {
        this.flaghidenMain = flag
    }

    public onCancelLookupTeknisi(flag) {
        this.flaghidenMain = flag
    }

    public onCancelLookupPart(flag) {
        this.flaghidenMain = flag
    }

    public onCancelLookupFaktur(flag) {
        this.flaghidenMain = flag
    }

    public backToMain() {
        this.router.navigate(['/home']);
    }

    // ambil data teknisi
    public onRowSelectedLookupTeknisi(event) {
        this.data['kodeTeknisi'] = event.data.KODE_TEKNISI
        this.flaghidenMain = false
    }

    // ambil data part
    public onRowSelectedLookupPart(data) {
        // console.log("onRowSelectedLookUpPart : " + data)

        for (let i = 0; i < data.length; i++) {
            let flagEqual = false;
            for (let ii = 0; ii < this.data.dataDetail.length; ii++) {
                // stok2an blom beres
                this.getStokInvoiceSelectByKodePartAndInvoice(this.gloKodeBass, this.data.dataDetail[ii].KD_SPAREPART, this.data.dataDetail[ii].NO_INVOICE)
                if (data[i].KD_SPAREPART == this.data.dataDetail[ii].KD_SPAREPART) {
                    flagEqual = true
                    break;
                }
            }

            if (!flagEqual) {
                this.data.dataDetail.push(data[i])
            }
        }

        this.flaghidenMain = false
        this.calculate()
    }

    public onRowSelectedFaktur(data) {
        // console.log("onRowSelectedFaktur : " + data)

        for (let i = 0; i < data.length; i++) {
            let flagEqual = false;
            for (let ii = 0; ii < this.data.dataDetail.length; ii++) {
                // stok2an blom beres
                this.getStokInvoiceSelectByKodePartAndInvoice(this.gloKodeBass, this.data.dataDetail[ii].KD_SPAREPART, this.data.dataDetail[ii].NO_INVOICE)
                if (data[i].KD_SPAREPART == this.data.dataDetail[ii].KD_SPAREPART) {
                    flagEqual = true
                    break;
                }
            }

            if (!flagEqual) {
                this.data.dataDetail.push(data[i])
            }
        }

        this.flaghidenMain = false
        this.calculate()
        // alert(this.flagButtonInsert)
    }

    public onChangeComboBiayaTransport() {
        this.calculate()
    }

    public onChangeQtySparepart() {
        this.calculate()
    }

    public onDeletedDetail(index) {
        this.data.dataDetail.splice(index, 1)
        this.calculate()
    }

    // event onchange combobox status barang
    public onChangeStatusBarang(status: String) {
        this.ongkosService(status, this.data.kodeBarang, this.data.merk, this.data.jenis)
    }

    // event onchange combobox penyebab
    public onChangeComboPenyebab(penyebab) {
        this.perbaikan(this.data.kodeProduk, this.data.kodePengaduan, penyebab)
    }

    // event onchange combobox pengaduan
    public onChangeComboPengaduan(pengaduan) {
        this.penyebab(this.data.kodeProduk, pengaduan)
    }

    // fungsi buat panggil api
    public getDetailServiceRequest(kodeService: String) {
        this.service.getDetailServiceRequest(kodeService).then(
            data => {
                this.data.dataDetail = data
                // console.log("get detail : " + this.data.dataDetail)
            },
            err => {
                if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                    alert("Your Token has expired, please login again !")
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                } else {
                    alert(err._body.data);
                }
            }
        )
    }

    public getReviewClaimService(kodeService: String) {
        this.service.getReviewClaimService(kodeService).then(
            data => {
                // console.log("get review claim service : " + data)
                /*  
                    belum berfungsi
                    jika row nya > 0
                    jika row = 0 maka status review not valid 
                    jika status review not valid = true mka disable enable true dan sebaliknya
                */
                if (data.length > 0) {
                    if (data[0].ISVALID == 0) {
                        this.statusReviewNotValid = true
                    }
                }

                if (this.statusReviewNotValid) {
                    this.Disable_Enable_Detail(true, this.data)
                } else {
                    this.Disable_Enable_Detail(false, this.data)
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
            }
        )
    }

    public getStokInvoiceSelectByKodePartAndInvoice(kodeBass: String, kodePart: String, kodeInvoice: String) {
        this.service.getStokInvoiceSelectByKodePartAndInvoice(kodeBass, kodePart, kodeInvoice).then(
            data => {
                // console.log("stok :" + data)
            },
            err => {
                if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                    alert("Your Token has expired, please login again !")
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                } else {
                    alert(err._body.data);
                }
            }
        )
    }

    public getDetailServiceRequestReceived(kodeService: String) {
        this.service.getDetailServiceRequestReceived(kodeService).then(
            data => {
                this.detailServiceRequestReceivedList = data
                // console.log(this.detailServiceRequestReceivedList)
                if (this.detailServiceRequestReceivedList.length > 0) {
                    this.LblNotificationPO = false
                } else {
                    this.LblNotificationPO = true
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
            }
        )
    }

    public ongkosService(status: String, kodeBarang: String, merk: String, jenis: String) {
        if (status == "NonWarranty") {
            this.servicerequest.getHarga(kodeBarang, merk, jenis).then(
                data => {
                    this.data['biaya'] = data[0].ongkos;
                    this.calculate()
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
        } else {
            this.data['biaya'] = 0
            this.calculate()
        }
    }

    // ppn
    public hitungPPN(hargaSukuCadang: number, hargaService: number, hargaTransport: number) {
        // console.log("ambil biaya ppn")
        this.service.calculatePPN(hargaSukuCadang, hargaService, hargaTransport).then(
            data => {
                this.ppn = data[0].ppn
                // console.log("ini ppn : " + this.ppn)
                // total biaya service
                this.totalBiayaService = hargaSukuCadang + hargaService + hargaTransport + this.ppn
            },
            err => {
                if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                    alert("Your Token has expired, please login again !")
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                } else {
                    alert(err._body.data);
                }
                // console.log(err)
            }
        )
    }

    // biaya transport
    public biayaTransport() {
        // console.log("fect biaya transport")
        this.service.getBiayaTransportasi().then(
            data => {
                this.biayaTransportList = data
                this.biayaTransportasi = this.biayaTransportList[0]
            },
            err => {
                if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                    alert("Your Token has expired, please login again !")
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                } else {
                    alert(err._body.data);
                }
                // console.log(err)
            }
        )
    }

    public pengaduan(kodeBarang: String) {
        // console.log("fect data pengaduan")
        this.servicerequest.getKerusakan(kodeBarang).then(
            data => {
                this.kerusakanList = data;
                if (this.data['kodePengaduan'] == "") {
                    this.data['kodePengaduan'] = this.kerusakanList[0].Nama_Kerusakan
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

    public perbaikan(kodeBarang: String, namaKerusakan: String, namaPenyebab: String) {
        // console.log("fect data perbaikan")
        this.service.getPerbaikan(kodeBarang, namaKerusakan, namaPenyebab).then(
            data => {
                this.perbaikanList = data;
                // console.log(this.perbaikanList)
                if (this.perbaikanList.length > 0) {
                    this.data['perbaikan'] = this.perbaikanList[0].NAMA_PERBAIKAN
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

    public penyebab(kodeBarang: String, namaKerusakan: String) {
        // console.log("fect data penyebab")
        // console.log(kodeBarang + " " + namaKerusakan)
        this.service.getPenyebab(kodeBarang, namaKerusakan).then(
            data => {
                this.penyebabList = data;
                if (this.penyebabList.length > 0) {
                    this.data['penyebab'] = this.penyebabList[0].Nama_Penyebab
                    this.perbaikan(kodeBarang, namaKerusakan, this.penyebabList[0].Nama_Penyebab)
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

    // fungsi lain lain
    public onHiddenMain(flag) {
        this.flaghidenMain = flag
    }

    // fungsi menghitung biaya service
    public calculate() {
        let totalSukuCadang: number = 0
        // hitung total suku cadang
        if (this.data.dataDetail.length > 0) {
            for (let i = 0; i < this.data.dataDetail.length; i++) {
                totalSukuCadang += Number(this.data.dataDetail[i].QTY) * Number(this.data.dataDetail[i].HARGA)
            }
        }

        // cek garansi jika status waranty makan total suku cadang dan biaya service = 0
        if (this.data.statusProduk == "Warranty") {
            this.hargaTotalSukuCadang = 0
            this.biayaService = 0
        } else {
            this.hargaTotalSukuCadang = totalSukuCadang
            this.biayaService = this.data.biaya
        }

        this.subTotal = this.hargaTotalSukuCadang + this.biayaService + this.biayaTransportasi.BIAYA_TRANSPORTASI

        // // hitung ppn 
        this.hitungPPN(this.hargaTotalSukuCadang, this.biayaService, this.biayaTransportasi.BIAYA_TRANSPORTASI)
    }

    // crud button
    public save() {
        // validasi 
        this.confirmationService.confirm({
            header: 'Confirmation',
            message: 'Selesaikan claim service ini?',
            accept: () => {
                if (this.validation(this.data)) {
                    this.cekTeknisi(this.data.kodeTeknisi).then(
                        result => {
                            if (result) {
                                this.data.status = "Done";
                                this.data.biayaPPN = this.ppn;
                                this.data.biayaTotal = this.totalBiayaService;
                                this.data.biayaTransport = this.biayaTransportasi.BIAYA_TRANSPORTASI
                                this.data.kodeTransportasi = this.biayaTransportasi.KODE_TRANS

                                // console.log(this.data)
                                this.busyloadevent.busy = this.service.saveServiceFinishing(this.data).then(
                                    data => {
                                        //stok di comment karena belom terpakai
                                        this.service.getDetailServiceRequestReceived(this.data.kodeService).then(
                                            data => {
                                                if (data.length > 0) {
                                                    // for (let i = 0; i < data.length; i++) {
                                                    //     let kodeSparepart = this.data.dataDetail[i].KD_SPAREPART;
                                                    //     let noInvoice = this.data.dataDetail[i].NO_INVOICE;
                                                    //     let harga = this.data.dataDetail[i].HARGA;
                                                    //     let qty = this.data.dataDetail[i].QTY;
                                                    //     let descripsi = "Penambahan Stock karena pengeditan service request = " + kodeSparepart;

                                                    //     this.service.stokInsert(this.gloKodeBass, kodeSparepart, noInvoice, this.today, descripsi, Number(qty) * 1, this.data.kodeService).then(
                                                    //         data => {
                                                    //             // console.log(data.result)
                                                    //         },
                                                    //         err => {
                                                    //             if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                                                    //                 alert("Your Token has expired, please login again !")
                                                    //                 sessionStorage.clear();
                                                    //                 this.router.navigate(['/login']);
                                                    //             } else {
                                                    //                 alert(err._body.data);
                                                    //             }
                                                    //         }
                                                    //     )
                                                    // }
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
                                            }
                                        )
                                        // for (let i = 0; i < this.data.dataDetail.length; i++) {
                                        //     if (this.data.dataDetail[i].NO_INVOICE != "") {

                                        //         let kodeSparepart = this.data.dataDetail[i].KD_SPAREPART;
                                        //         let noInvoice = this.data.dataDetail[i].NO_INVOICE;
                                        //         let harga = this.data.dataDetail[i].HARGA;
                                        //         let qty = this.data.dataDetail[i].QTY;
                                        //         let descripsi = "Pengurangan karena Finishing Service dengan Nomor Service = " + kodeSparepart;

                                        //         this.service.stokInsert(this.gloKodeBass, kodeSparepart, noInvoice, this.today, descripsi, Number(qty) * -1, this.data.kodeService).then(
                                        //             data => {
                                        //                 // console.log(data.result)
                                        //             },
                                        //             err => {
                                        //                 if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                                        //                     alert("Your Token has expired, please login again !")
                                        //                     sessionStorage.clear();
                                        //                     this.router.navigate(['/login']);
                                        //                 } else {
                                        //                     alert(err._body.data);
                                        //                 }
                                        //             }
                                        //         )
                                        //     }
                                        // }

                                        // jika ada di table review dan statusnya 0 maka delete dari table claim service dan buat claim servicenya ''
                                        this.service.getReviewClaimService(this.data.kodeService).then(
                                            data => {
                                                if (data.length > 0) {
                                                    if (data[0].ISVALID == 0) {
                                                        this.service.updateStatusBeforeClaimService(this.data.kodeService).then(
                                                            data => {
                                                                // console.log("update status before claim sevice : " + data.result)
                                                            },
                                                            err => {
                                                                if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                                                                    alert("Your Token has expired, please login again !")
                                                                    sessionStorage.clear();
                                                                    this.router.navigate(['/login']);
                                                                } else {
                                                                    alert(err._body.data);
                                                                }
                                                            }
                                                        )
                                                    }
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
                                            }
                                        )

                                        alert(data.result)
                                        this.Disable_Enable_Detail(false, this.data)
                                    },
                                    err => {
                                        if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                                            alert("Your Token has expired, please login again !")
                                            sessionStorage.clear();
                                            this.router.navigate(['/login']);
                                        } else {
                                            alert(err._body.data);
                                        }
                                    }
                                )
                            }
                        }
                    )
                }
            }
        });
    }

    public close() {
        this.confirmationService.confirm({
            header: 'Confirmation',
            message: 'Close claim service ini?',
            accept: () => {
                if (this.data.kodeService !== "") {
                    this.service.updatestatus(this.data.kodeService, "Closed").then(
                        data => {
                            // jika ada di table review dan statusnya 0 maka delete dari table claim service dan buat claim servicenya ''
                            this.service.getReviewClaimService(this.data.kodeService).then(
                                data => {
                                    if (data.length > 0) {
                                        if (data[0].ISVALID == 0) {
                                            this.service.updateStatusBeforeClaimService(this.data.kodeService).then(
                                                data => {
                                                    // console.log("update status before claim sevice : " + data.result)
                                                },
                                                err => {
                                                    if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                                                        alert("Your Token has expired, please login again !")
                                                        sessionStorage.clear();
                                                        this.router.navigate(['/login']);
                                                    } else {
                                                        alert(err._body.data);
                                                    }
                                                }
                                            )
                                        }
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
                                }
                            )

                            //comment stok dulu
                            // if (this.data.dataDetail.length > 0) {
                            //     for (let i = 0; i < this.data.dataDetail.length; i++) {
                            //         if (this.data.dataDetail[i].this.data.dataDetail[i].QTY !== "") {

                            //             let kodeSparepart = this.data.dataDetail[i].KD_SPAREPART;
                            //             let noInvoice = this.data.dataDetail[i].NO_INVOICE;
                            //             let harga = this.data.dataDetail[i].HARGA;
                            //             let qty = this.data.dataDetail[i].QTY;
                            //             let descripsi = "Penambahan Stock karena Closing service request dengan Nomor Service : " + kodeSparepart;

                            //             this.service.stokInsert(this.gloKodeBass, kodeSparepart, noInvoice, this.today, descripsi, Number(qty), this.data.kodeService).then(
                            //                 data => {
                            //                     // console.log(data.result)
                            //                 },
                            //                 err => {
                            //                     if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                            //                         alert("Your Token has expired, please login again !")
                            //                         sessionStorage.clear();
                            //                         this.router.navigate(['/login']);
                            //                     } else {
                            //                         alert(err._body.data);
                            //                     }
                            //                 }
                            //             )
                            //         }
                            //     }
                            // }

                            alert("Sukses menyimpan data")

                            let kodeService = this.data.kodeService
                            this.service.getServiceList(kodeService, this.gloKodeBass, '', '', 'ServiceRequest', '').then(
                                data => {
                                    // console.log('ambil data by param: ', data)
                                    let event = { data: data[0] }
                                    this.onRowSelectedLookupService(event);
                                },
                                err => {
                                    console.log(err)
                                }
                            )
                            // let event: any = [];
                            // event.push(this.data)
                            // console.log('data', this.data)
                            // let event = { data: "" }
                            // let event = {}
                            // event.data = this.data
                            // console.log('event', event)
                            // this.onRowSelectedLookupService(event);
                        },
                        err => {
                            if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                                alert("Your Token has expired, please login again !")
                                sessionStorage.clear();
                                this.router.navigate(['/login']);
                            } else {
                                alert(err._body.data);
                            }
                        }
                    )
                } else {
                    alert("Terjadi kesalahan data")
                }
            }
        });
    }

    public reOpen() {
        this.confirmationService.confirm({
            header: 'Confirmation',
            message: 'Reopen claim service ini?',
            accept: () => {
                if (this.data.kodeService !== "") {
                    this.service.updatestatus(this.data.kodeService, "Opened").then(
                        data => {
                            // console.log("update data reopen : " + data.result)
                            alert("Sukses menyimpan data")
                            let kodeService = this.data.kodeService
                            this.service.getServiceList(kodeService, this.gloKodeBass, '', '', 'ServiceRequest', '').then(
                                data => {
                                    // console.log('ambil data by param: ', data)
                                    let event = { data: data[0] }
                                    this.onRowSelectedLookupService(event);
                                },
                                err => {
                                    console.log(err)
                                }
                            )
                        },
                        err => {
                            if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                                alert("Your Token has expired, please login again !")
                                sessionStorage.clear();
                                this.router.navigate(['/login']);
                            } else {
                                alert(err._body.data);
                            }
                        }
                    )
                } else {
                    alert("Terjadi kesalahan data")
                }
            }
        });
    }

    public validation(data): Boolean {
        let aTanggalSelesai = new Date(this.datepipe.transform(data.tanggalSelesai, 'yyyy-MM-dd'))
        let aTanggal = new Date(this.datepipe.transform(data.tanggal, 'yyyy-MM-dd'))
        let aTanggalKembali = new Date(this.datepipe.transform(data.tanggalKembali, 'yyyy-MM-dd'))

        if (data.tanggalSelesai == "") {
            alert("Tanggal selesai harus diisi")
            return false;
        } else if (data.nomorNota == "") {
            alert("Nomor Nota harus diisi")
            return false;
        } else if (data.kodeTeknisi == "") {
            alert("Teknisi harus diisi")
            return false;
        } else if (aTanggalSelesai < aTanggal) {
            alert("Tanggal Selesai harus lebih besar daripada Tanggal Service")
            return false;
        } else {
            if (data.tanggalKembali != "") {
                if (aTanggalKembali < aTanggalSelesai) {
                    alert("Tanggal Kembali harus lebih besar daripada Tanggal Selesai")
                    return false;
                }
            }
            if (this.data.dataDetail.length > 0) {
                for (let i = 0; i < this.data.dataDetail.length; i++) {
                    if (this.data.dataDetail[i].QTY <= 0) {
                        alert("Qty pada kode part : " + this.data.dataDetail[i].KD_SPAREPART + ", harus lebih besar dari 0")
                        return false;
                    } else {
                        // belum berfungsi cek stok
                        // if (this.data.dataDetail[i].QTY > stok) {
                        //     alert("Quantity Melebihi Stock untuk part "+ this.data.dataDetail[i].KD_SParepart + "dan invoice "+ this.data.dataDetail[i].NO_INVOICE)
                        // }
                        return true;
                    }
                }
            }
            else {
                return true;
            }
        }
    }

    public cekTeknisi(kodeTeknisi: String) {
        return this.service.getTeknisi(this.gloKodeBass, kodeTeknisi, 'A').then(
            data => {
                if (data.length > 0) {
                    return true
                } else {
                    alert("Teknisi tidak ada dalam database")
                    return false;
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
                return false;
            });
    }

    public newRequest() {
        this.router.navigate(['pages/service/servicerequest']);
    }

    // tombol reject
    display: boolean = false;
    rejectComent: String = ""

    reject(data) {
        this.confirmationService.confirm({
            header: 'Confirmation',
            message: 'Reject claim service ini?',
            accept: () => {
                if (data !== "") {
                    this.service.reject({ kodeService: this.data.kodeService, status: "Rejected", rejectionComment: data }).then(
                        data => {
                            // console.log(data)
                            alert("Sukses menyimpan data")
                            this.display = false;
                            this.Disable_Enable_Detail(false, this.data)
                            this.flagRejected = true
                        },
                        err => {
                            if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                                alert("Your Token has expired, please login again !")
                                sessionStorage.clear();
                                this.router.navigate(['/login']);
                            } else {
                                alert(err._body.data);
                            }
                        }
                    )
                } else {
                    alert("Terjadi kesalahan data")
                }
            }
        });
    }

    showDialog() {
        this.display = true;
    }

    cancel() {
        this.display = false;
    }

    public print(): void {
        if (this.data.kodeService !== "") {
            let printContents, popupWin;
            printContents = document.getElementById('print-section').innerHTML;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
                    <html>
                    <head>
                        <title>Service Reuest</title>
                        <style>

                        .mytable { 
                            border-collapse: collapse; 
                            margin-top:10px;
                            margin-bottom:40px;
                            table-layout: fixed;
                            width: 100%;
                        }
                        /* Zebra striping */
                        .mytable tr:nth-of-type(odd) { 
                            background: #eee; 
                            }
                        .mytable th { 
                            background: #3498db; 
                            color: white; 
                            }
                        .mytable td, th { 
                            padding: 7px; 
                            border: 1px solid #ccc; 
                            text-align: center;
                            font-size: 10px;
                            }
                        .mytable .nourut {
                            width:30px;
                        }

                        .kodeclaim {
                            font-weight: bold;
                            font-size: 14px;
                        }

                        .div-jarak {
                            margin:10px 0px 10px 0px;
                        }
                        </style>
                    </head>
                <body onload="window.print();window.close()">
                    ${printContents}
                </body>
                    </html>`
            );
            popupWin.document.close();
        }
    }

}