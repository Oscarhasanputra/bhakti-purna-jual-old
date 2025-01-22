import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { SelectItem } from 'primeng/primeng';

import { ServiceListService } from './servicelist.service';
import { Subscription } from 'rxjs';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'servicelist',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./servicelist.component.scss')],
  template: require('./servicelist.component.html'),
})
export class serviceList {

  public sKodeBass: any = "";
  public sKodeCust: any = "";
  status: Array<any>;
  selectedStatus: string;
  public source: serviceListDT[];
  tglAwal: any = "";
  tglAkhir: any = "";
  private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

  public kodeBassEvent(childData: any) {
    this.sKodeBass = childData;
  }

  public kodeCustomerEvent(childData: any) {
    this.sKodeCust = childData;
  }

  constructor(private _state: GlobalState, private serviceListService: ServiceListService, protected router: Router) {

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    this.tglAwal = new Date();
    this.tglAwal.setMonth(prevMonth);
    this.tglAwal.setFullYear(prevYear);

    this.tglAkhir = new Date();

    this.status = [];
    this.status.push({ label: 'Waiting For Finishing', value: "WF" });
    this.status.push({ label: 'Waiting For Returned to Customer', value: "WC" });
    this.status.push({ label: 'Rejected', value: "RJ" });
    this.status.push({ label: 'Rejected and Assigned', value: "RC" });

    this.selectedStatus = this.status[0].value;
    this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 15px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:24px"></i>{{message}}</div>'

    if (this._state.Decrypt('mAuth').KODE_BASS == this._state.Decrypt('mParameter').BASS_PUSAT) {
      this.sKodeBass = "";
    } else {
      this.sKodeBass = this._state.Decrypt('mAuth').KODE_BASS;
    }
  }

  loadData() {
    this.busyloadevent.busy = this.serviceListService.getServiceListHome(this.sKodeBass, this.sKodeCust, this.selectedStatus, this.tglAwal, this.tglAkhir).then(
      data => {
        this.source = data;
      },
      err => {
        if (err._body == 'You are not authorized' || err.status == 500) {
          alert("Your Token has expired, please login again !")
          sessionStorage.clear();
          this.router.navigate(['/login']);
        }
      }
    );
  }

  onRowSelect(event) {
    this.sKodeBass = event.data.KODE_BASS;
  }

  tampil(kode_service) {
    this.router.navigate(['/pages/service/finishingservicerequest', kode_service]);
  }

}

export interface serviceListDT {
  KODE_BASS;
  KODE_SERVICE;
  TANGGAL;
  NAMA_CUSTOMER;
  NAMA_BASS;
  STATUS;
}