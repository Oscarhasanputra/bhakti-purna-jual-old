import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { ServiceRequestService } from './servicerequest.service';
import { Subject } from 'rxjs/Subject';
import { DatePipe } from '@angular/common';
import { GlobalState } from '../../../../global.state';

@Component({
    selector: 'servicerequest',
    encapsulation: ViewEncapsulation.None,
    styles: [require('./servicerequest.scss')],
    template: require('./servicerequest.html'),
    providers: [DatePipe, ConfirmationService]
})
export class ServiceRequestComponent implements OnInit {
    busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);
    // testing flag lookup
    public flaghidenMain: Boolean = false
    public flaghidenInputCustomer: Boolean = false

    public appCode: String = "APPL00011";
    public hakAkses: any;
    public data: any;
    public ongkos: any;

    // list
    public assignBassList: any;
    public kerusakanList: any;
    public status_brg: any = ['Warranty', 'NonWarranty', 'ServiceWarranty'];

    public today: any = new Date();
    public gloKodeBass: any;
    public gloNamaBass: any;
    public gloUsername: any;
    public flagButtonInsert: Boolean = false;
    public flagButtonUpdate: Boolean = false;
    public flagAssignToBass: Boolean = false;
    public flagTanggalDisable: Boolean = false;
    public flagInput: Boolean = true;
    public statusReviewNotValid: Boolean = false;

    constructor(public router: Router, private actroute: ActivatedRoute, private service: ServiceRequestService,
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
            }
            if (this.hakAkses.HAK_EDIT) {
                this.flagButtonUpdate = true
            }
            // this.today.setMinutes(2)
            this.newData()

        } else {
            alert('Anda tidak berhak mengakses halaman ini!');
            this.router.navigate(['/pages/home']);
        }
    }

    public newData() {
        this.today = new Date();
        this.data = {
            kodeService: "",
            tanggal: this.today,
            jamMasuk: this.datepipe.transform(this.today, 'HH:mm'),
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
            emailAssignToBass: ""
        }
        this.flagTanggalDisable = false
        this.assignToBass("")
    }

    // assign to bass *
    public assignToBass(kodeCustomer: String) {

        if (this.global.Decrypt('mAuth').TYPE == "Cabang" ||
            this.global.Decrypt('mAuth').KODE_BASS == this.global.Decrypt('mParameter').BASS_PUSAT) {
            this.flagAssignToBass = true;
            this.service.getNearestBass(kodeCustomer, this.gloKodeBass, 1).then(
                data => {
                    this.assignBassList = data;
                    if (this.data.assignToBass == "") {
                        this.data.assignToBass = this.assignBassList[0].KODE_BASS
                        this.data.alamatAssignToBass = this.assignBassList[0].ALAMAT_BASS
                        this.data.kotaAssignToBass = this.assignBassList[0].KOTA
                        this.data.emailAssignToBass = this.assignBassList[0].EMAIL
                    } else {
                        this.data.alamatAssignToBass = this.assignBassList[0].ALAMAT_BASS
                    }
                },
                err => {
                    // console.log(err._body.data)
                    if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                        alert("Your Token has expired, please login again !")
                        sessionStorage.clear();
                        this.router.navigate(['/login']);
                    } else {
                        alert(err._body.data);
                    }
                });
        } else {
            this.flagAssignToBass = false;
            this.service.getNearestBass(kodeCustomer, this.gloKodeBass, 0).then(
                data => {
                    this.assignBassList = data;
                    if (this.data.assignToBass == "") {
                        this.data.assignToBass = this.assignBassList[0].KODE_BASS
                        this.data.alamatAssignToBass = this.assignBassList[0].ALAMAT_BASS
                        this.data.kotaAssignToBass = this.assignBassList[0].KOTA
                        this.data.emailAssignToBass = this.assignBassList[0].EMAIL
                    } else {
                        this.data.alamatAssignToBass = this.assignBassList[0].ALAMAT_BASS
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

    // event combobox assign to bass change
    public onChange(assignToBass: String) {
        for (let i = 0; i < this.assignBassList.length; i++) {
            if (this.assignBassList[i].KODE_BASS == assignToBass) {
                this.data.kodeBass = this.assignBassList[i].KODE_BASS
                this.data.alamatAssignToBass = this.assignBassList[i].ALAMAT_BASS
                this.data.kotaAssignToBass = this.assignBassList[i].KOTA
                this.data.emailAssignToBass = this.assignBassList[0].EMAIL
            }
        }
    }

    // Pengaduan *
    public pengaduan(kodeBarang: String) {
        this.service.getKerusakan(kodeBarang).then(
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

    public onChangeStatusBarang(status: String) {
        this.ongkosService(status, this.data.kodeBarang, this.data.merk, this.data.jenis)
    }

    public ongkosService(status: String, kodeBarang: String, merk: String, jenis: String) {
        if (status == "NonWarranty") {
            this.service.getHarga(kodeBarang, merk, jenis).then(
                data => {
                    this.data['biaya'] = data[0].ongkos;
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
        }
    }

    public Disable_Enable_Detail(flag) {
        if (!this.hakAkses.HAK_INSERT) {
            flag = false
        }
        this.flagInput = flag
    }

    public validation(data): Boolean {
        if (data.kodeCustomer == "") {
            alert("Kode Customer harus diisi")
            return false;
        } else if (data.kodeBarang == "") {
            alert("Kode Barang harus diisi")
            return false;
        } else if (data.tanggalBeli == "") {
            alert("Tanggal Beli harus diisi")
            return false;
        } else {
            return true;
        }
    }

    cekCustomer(kodeCustomer: String) {
        return this.service.getCustomer(kodeCustomer).then(
            data => {
                if (data.length > 0) {
                    return true
                } else {
                    alert("Customer tidak ada dalam database")
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

    cekBarang(kodeBarang: String) {
        return this.service.getBarangByKode(kodeBarang).then(
            data => {
                if (data.length > 0) {
                    return true;
                } else {
                    alert("kode barang ini tidak ada dalam database")
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
    // event event simpan or edit
    public save() {
        this.confirmationService.confirm({
            header: 'Confirmation',
            message: 'Selesaikan claim service ini?',
            accept: () => {
                if (this.validation(this.data)) {
                    //  validasi cek customer di database
                    this.cekCustomer(this.data.kodeCustomer).then(
                        result => {
                            if (result) {
                                // validasi cek barang di database
                                this.cekBarang(this.data.kodeProduk).then(
                                    result => {
                                        if (result) {
                                            if (this.data.kodeService == "") {
                                                // insert ke database
                                                this.busyloadevent.busy = this.service.serviceInsert(this.data).then(
                                                    data => {
                                                        this.data['kodeService'] = data.kode_service
                                                        let bassPusat = this.global.Decrypt('mParameter').BASS_PUSAT
                                                        if (this.gloKodeBass == bassPusat && this.gloKodeBass !== this.data.assignToBass) {
                                                            // masuk sini
                                                            this.sendMail()
                                                        }
                                                        alert(data.kode_service + "\n Berhasil Disimpan")
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
                                                // update ke database
                                                console.log(this.data)
                                                this.service.serviceUpdate(this.data).then(
                                                    data => {
                                                        let bassPusat = this.global.Decrypt('mParameter').BASS_PUSAT
                                                        if (this.gloKodeBass == bassPusat && this.gloKodeBass !== this.data.assignToBass) {
                                                            // masuk sini
                                                            this.sendMail()
                                                        }
                                                        alert(data.kode_service + "\n Berhasil Diubah")
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
                                    }
                                )
                            }
                        }
                    )
                }
            }
        });
    }

    // sendmail after save
    public sendMail() {
        let body: string = "Hello  <br><br>" +
            "A Service Request  has been routed to you with detail below <br>" +
            "<table>" +
            "<tr>" +
            "    <td>No Service</td>" +
            "    <td>:</td>" +
            "    <td>" + this.data.kodeService + "</td>" +
            "</tr>" +
            "<tr>" +
            "    <td>Tanggal</td>" +
            "    <td>:</td>" +
            "    <td>" + this.data.tanggal + "</td>" +
            "</tr>" +
            "<tr>" +
            "    <td>Jenis Service</td>" +
            "    <td>:</td>" +
            "    <td>" + this.data.jenisService + "</td>" +
            "</tr>" +
            "<tr>" +
            "    <td>Status Barang</td>" +
            "    <td>:</td>" +
            "    <td>" + this.data.status + "</td>" +
            "</tr>" +
            "<tr>" +
            "    <td>Nama Customer</td>" +
            "    <td>:</td>" +
            "    <td>" + this.data.namaCustomer + "</td>" +
            "</tr>" +
            "<tr>" +
            "    <td>Alamat</td>" +
            "    <td>:</td>" +
            "    <td>" + this.data.alamatCustomer + "</td>" +
            "</tr>" +
            "<tr>" +
            "    <td>No Telp/HP</td>" +
            "    <td>:</td>" +
            "    <td>" + this.data.telpCustomer + "/" + this.data.hpCustomer + "</td>" +
            "</tr>" +
            "<tr>" +
            "    <td>Catatan</td>" +
            "    <td>:</td>" +
            "    <td>" + this.data.catatan + "</td>" +
            "</tr>" +
            "</table>" +
            "<br><br>" +
            "<br>Best Regards," +
            "<br><br><br><br>BIT Web System"

        this.service.sendMail({
            Email_SMTP: this.global.Decrypt('mParameter').EMAIL_SMTP,
            Email_Port: 465, // this.global.Decrypt('mParameter').EMAIL_PORT,
            Email_Username: "edvin.megantara8@gmail.com", //this.global.Decrypt('mParameter').EMAIL_USERNAME,
            Email_Password: "1991megantara", // this.global.Decrypt('mParameter').EMAIL_PASSWORD, 
            mailTo: "edvin.megantara9@gmail.com", // this.data.emailAssignToBass,
            mailSubject: "Service Request (" + this.gloUsername + "/" + this.gloNamaBass + "/" + this.today.toISOString().substring(0, 10) + ")",
            mailBody: body
        }).then(
            data => {
                // console.log(data)
            },
            err => {
                if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                    alert("Your Token has expired, please login again !")
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                } else {
                    if (err._body.status == "failed") {
                        alert("Gagal mengirim email")
                    } else {
                        alert(err._body);
                    }
                }
            });
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
                    if (data[0].ISVALID = 0) {
                        this.statusReviewNotValid = true
                    }
                }

                if (this.statusReviewNotValid) {
                    this.Disable_Enable_Detail(true)
                } else {
                    this.Disable_Enable_Detail(false)
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

    // event - event service list
    public onRowSelectedLookupService(event) {

        // console.log(event)

        if (this.global.Decrypt('mAuth').TYPE == "Cabang") {
            this.Disable_Enable_Detail(false)
        } else if (event.data.status == "Rejected") {
            this.Disable_Enable_Detail(false)
        } else {
            if (event.data.status == "Done" || event.data.status == "Closed") {
                this.getReviewClaimService(this.data.kodeService)
            } else {
                this.Disable_Enable_Detail(true)
            }
        }

        this.pengaduan(event.data.KODE_PRODUK)
        this.assignToBass(event.data.KODE_CUSTOMER)

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

        this.data.assignToBass = event.data.KODE_BASS
        this.data.alamatAssignToBass = event.data.ALAMAT_BASS
        this.data.kotaAssignToBass = event.data.KOTA
        this.data.emailAssignToBass = event.data.EMAIL

        this.flagTanggalDisable = true
        this.flaghidenMain = false
    }

    public onCancelLookupService(flag) {
        this.flaghidenMain = false
    }
    // event - event service list

    // event - event customer add new
    public buttonCustomerTambahClicked() {
        this.flaghidenMain = true
        this.flaghidenInputCustomer = true
    }

    public onSavedCustomer(value) {
        this.data['kodeCustomer'] = value.kode_customer
        this.data['namaCustomer'] = value.nama_customer
        this.data['alamatCustomer'] = value.alamat_customer
        this.data['kotaCustomer'] = value.kota
        this.data['hpCustomer'] = value.nomor_hp
        this.data['zonaCustomer'] = value.zona
        this.data['telpCustomer'] = value.nomor_telepon

        this.assignToBass(value.kode_customer)

        this.flaghidenMain = false
        this.flaghidenInputCustomer = false
    }

    public onCancel(flag) {
        this.flaghidenMain = false
        this.flaghidenInputCustomer = false
    }
    // event - event customer add new

    // event - event customer list
    public onRowSelectedLookupCustomer(event) {
        this.data['kodeCustomer'] = event.data.KODE_CUSTOMER
        this.data['namaCustomer'] = event.data.NAMA_CUSTOMER
        this.data['alamatCustomer'] = event.data.ALAMAT_CUSTOMER
        this.data['kotaCustomer'] = event.data.KOTA_CUSTOMER
        this.data['hpCustomer'] = event.data.HP_CUSTOMER
        this.data['zonaCustomer'] = event.data.NAMA_ZONA
        this.data['telpCustomer'] = event.data.TELP_CUSTOMER

        this.assignToBass(event.data.KODE_CUSTOMER)
        this.flaghidenMain = false
    }

    public onCancelLookupCustomer(flag) {
        this.flaghidenMain = false
    }
    // event - event customer list

    // event - event barang list
    public onRowSelectedLookupBarang(event) {
        this.data['kodeProduk'] = event.data.Kode_Barang
        this.data['namaProduk'] = event.data.Nama_Barang
        this.data['merk'] = event.data.Merek
        this.data['jenis'] = event.data.Jenis

        this.ongkosService(this.data.statusProduk, event.data.Kode_Barang, event.data.Merek, event.data.Jenis)
        this.pengaduan(event.data.Kode_Barang)
        this.flaghidenMain = false
    }

    public onCancelLookupBarang(flag) {
        this.flaghidenMain = false
    }
    // event - event barang list

    public backToMain() {
        this.router.navigate(['/home']);
    }

    public onHiddenMain(flag) {
        this.flaghidenMain = flag
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