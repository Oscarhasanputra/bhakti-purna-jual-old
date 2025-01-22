import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { SelectItem } from 'primeng/primeng';

import { ReportPartOrderService, User } from './reportpartorder.service';
import { Subscription } from 'rxjs';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { Router } from '@angular/router';
import { GlobalState } from '../../../../global.state';

@Component({
    selector: 'reportpartorder',
    encapsulation: ViewEncapsulation.None,
    styles: [require('./reportpartorder.component.scss')],
    template: require('./reportpartorder.component.html'),
})
export class reportPartOrder {

    public reportPartOrders: any;
    public kode_dealer;
    public tglAwal: any;
    public tglAkhir: any;
    public sKodeBass: any;
    busy: Subscription;
    sStorage: any;
    display: boolean = false;
    data: Array<any> = [];
    listZona: SelectItem[] = [];
    selectedListZona: string;
    private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);
    appCode: any = "APPL00054";
    hakAkses: any;

    constructor(private reportPartOrderService: ReportPartOrderService, protected router: Router, public global: GlobalState) {
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = (month === 0) ? 11 : month - 1;
        let prevYear = (prevMonth === 11) ? year - 1 : year;
        this.tglAwal = new Date();
        this.tglAwal.setMonth(prevMonth);
        this.tglAwal.setFullYear(prevYear);

        this.tglAkhir = new Date();

        this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 15px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:24px"></i>{{message}}</div>'

        this.sStorage = this.global.Decrypt('mAuth');

        this.hakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

        if (this.hakAkses.HAK_AKSES) {
            this.reportPartOrderService.getZonaList(this.sStorage.KODE_BASS).subscribe(
                data => {
                    this.data = data.json();
                    for (var i = 0; i < this.data.length; i++) {
                        this.listZona.push({ label: this.data[i].NAMA_ZONA, value: this.data[i].ZONA });
                    }

                    this.selectedListZona = this.listZona[0].value;
                },
                err => {
                    // console.log(err._body);
                    if (err._body == 'You are not authorized' || err.status == 500) {
                        alert("Your Token has expired, please login again !")
                        sessionStorage.clear();
                        this.router.navigate(['/login']);
                    }
                }
            );
        } else {
            alert('Anda tidak berhak mengakses halaman ini!');
            this.router.navigate(['/pages/home']);
        }
    }

    public proses(tglAwal, tglAkhir, kode_zona) {
        if (tglAwal == '' || tglAkhir == '') {

        } else {
            let dayAwal = tglAwal.getDate();
            let monthAwal = tglAwal.getMonth() + 1; // add 1 because months are indexed from 0
            let yearAwal = tglAwal.getFullYear();

            let dayAkhir = tglAkhir.getDate();
            let monthAkhir = tglAkhir.getMonth() + 1; // add 1 because months are indexed from 0
            let yearAkhir = tglAkhir.getFullYear();

            tglAwal = monthAwal + '-' + dayAwal + '-' + yearAwal
            tglAkhir = monthAkhir + '-' + dayAkhir + '-' + yearAkhir
        }

        if (!kode_zona) {
            kode_zona = "ALL";
        }

        this.busyloadevent.busy = this.reportPartOrderService.getReportPartOrderServices(this.sStorage.KODE_BASS, kode_zona, tglAwal, tglAkhir).subscribe(
            data => { this.reportPartOrders = data.json() },
            err => {
                // console.log(err._body);
                if (err._body == 'You are not authorized' || err.status == 500) {
                    alert("Your Token has expired, please login again !")
                    sessionStorage.clear();
                    this.router.navigate(['/login']);
                }
            }
        )
    }

    print(): void {
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
          <title>Report Part Order</title>
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

export interface listBass {
    KODE_BASS;
    NAMA_BASS;
}
