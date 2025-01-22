import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';

import { ReportPartReceivingService, User } from './reportpartreceiving.service';
import { ReportService } from '../../report.service';
import { Subscription } from 'rxjs';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { Router } from '@angular/router';
import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'reportpartreceiving',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./reportpartreceiving.component.scss')],
  template: require('./reportpartreceiving.component.html'),
})
export class reportPartReceivings {

  public reportPartReceivings: any;
  public listBass: listBass[];
  public kode_dealer;
  public tglAwal: any;
  public tglAkhir: any;
  public sKodeBass: any = '';
  busy: Subscription;
  sStorage: any;
  sParam: any;
  display: boolean = false;
  showPilihKodeBass: boolean = false;
  private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);
  appCode: any = "APPL00055";
  hakAkses: any;

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

  constructor(private reportPartReceivingService: ReportPartReceivingService, protected router: Router, public global: GlobalState) {
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
    this.sParam = this.global.Decrypt('mParameter');

    this.hakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

    if (!this.hakAkses.HAK_AKSES) {
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }

    if (this.sStorage.TYPE == "Cabang") {
      this.showPilihKodeBass = false;

    } else if (this.sStorage.KODE_BASS == this.sParam.BASS_PUSAT) {
      this.showPilihKodeBass = true;

      this.reportPartReceivingService.getBassList(this.sStorage.KODE_BASS).then(
        data => {
          this.listBass = data;
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
      this.showPilihKodeBass = false;

    }
  }

  public proses(tglAwal, tglAkhir) {
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

    if (this.showPilihKodeBass == false) {
      this.busyloadevent.busy = this.reportPartReceivingService.getReportPartReceivingService(this.sStorage.KODE_BASS, tglAwal, tglAkhir).subscribe(
        data => { this.reportPartReceivings = data.json() },
        err => {
          if (err._body == 'You are not authorized' || err.status == 500) {
            alert("Your Token has expired, please login again !")
            sessionStorage.clear();
            this.router.navigate(['/login']);
          }
        }
      )
    } else if (this.showPilihKodeBass == true) {
      if (this.sKodeBass == '') {
        this.sKodeBass = this.sStorage.KODE_BASS;
      }

      this.busyloadevent.busy = this.reportPartReceivingService.getReportPartReceivingService(this.sKodeBass, tglAwal, tglAkhir).subscribe(
        data => { this.reportPartReceivings = data.json() },
        err => {
          if (err._body == 'You are not authorized' || err.status == 500) {
            alert("Your Token has expired, please login again !")
            sessionStorage.clear();
            this.router.navigate(['/login']);
          }
        }
      )
    }
  }

  onRowSelect(event) {
    this.sKodeBass = event.data.KODE_BASS;
    this.display = false;
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Report Part Receiving</title>
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
