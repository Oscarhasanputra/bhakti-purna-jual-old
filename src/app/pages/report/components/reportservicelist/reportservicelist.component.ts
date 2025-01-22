import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { ModalDirective } from 'ng2-bootstrap';

import { ReportServiceListService } from './reportservicelist.service';
import { ReportService } from '../../report.service';
import { Subscription } from 'rxjs';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'reportservicelist',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./reportservicelist.component.scss')],
  template: require('./reportservicelist.component.html'),
})
export class reportServiceList {

  public reportServiceLists: any;
  public kode_dealer;
  public tglAwal: any;
  public tglAkhir: any;
  public listBass: listBass[];
  public sKodeBass: any;
  busy: Subscription;
  status: Array<any>;
  selectedStatus: string;
  sStorage: any;
  sParameter: any;
  display: boolean = false;
  showPilihKodeBass: boolean = false;
  private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);
  appCode: any = "APPL00052";
  hakAkses: any;

  public handleEvent(childData: any) {
    this.showPilihKodeBass = childData;
  }

  public kodeBassEvent(childData: any) {
    this.sKodeBass = childData;
  }

  constructor(private reportServiceListService: ReportServiceListService, protected router: Router,
    public global: GlobalState) {
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

    this.hakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];


    this.sStorage = this.global.Decrypt('mAuth')

    if (!this.hakAkses.HAK_AKSES) {
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }

    this.status = [];
    // this.status.push({ label: 'Pilih Status', value: null });
    this.status.push({ label: 'Semua Service', value: '' });
    this.status.push({ label: 'Semua Service belum selesai', value: 0 });
    this.status.push({ label: 'Semua Service udah selesai', value: 1 });

    this.selectedStatus = this.status[0].value;
  }

  public proses(tglAwal, tglAkhir, selectedStatus) {

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
    if (selectedStatus == null) {
      selectedStatus = '';
    }

    if (this.showPilihKodeBass == false) {
      if (selectedStatus == '') {
        this.busyloadevent.busy = this.reportServiceListService.getReportServiceListALL('', tglAwal, tglAkhir).subscribe(
          data => {
            this.reportServiceLists = data.json()
          },
          err => {
            // console.log(err._body);
            if (err._body == 'You are not authorized' || err.status == 500) {
              alert("Your Token has expired, please login again !")
              sessionStorage.clear();
              this.router.navigate(['/login']);
            }
          }
        )
      } else {
        this.busyloadevent.busy = this.reportServiceListService.getReportServiceList('', tglAwal, tglAkhir, selectedStatus).subscribe(
          data => { this.reportServiceLists = data.json() },
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
    } else if (this.showPilihKodeBass == true) {
      if (selectedStatus == '') {
        this.busyloadevent.busy = this.reportServiceListService.getReportServiceListALL(this.sKodeBass, tglAwal, tglAkhir).subscribe(
          data => { this.reportServiceLists = data.json() },
          err => {
            // console.log(err._body);
            if (err._body == 'You are not authorized' || err.status == 500) {
              alert("Your Token has expired, please login again !")
              sessionStorage.clear();
              this.router.navigate(['/login']);
            }
          }
        )
      } else {
        this.busyloadevent.busy = this.reportServiceListService.getReportServiceList(this.sKodeBass, tglAwal, tglAkhir, selectedStatus).subscribe(
          data => { this.reportServiceLists = data.json() },
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
    }

  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
        <html>
          <head>
            <title>Report Service List</title>
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
