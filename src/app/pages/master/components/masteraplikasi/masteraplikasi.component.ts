import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { SelectItem, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { Router } from '@angular/router';
import { MasterAplikasiService } from './masteraplikasi.service';
import { GlobalState } from '../../../../global.state'

@Component({
  selector: 'masteraplikasi',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./masteraplikasi.component.scss')],
  template: require('./masteraplikasi.component.html'),
})
export class masterAplikasi {
  HakAkses: any;
  appCode = "APPL00004";

  data: Array<any> = [];
  sStorage: any;
  kode_aplikasi: any;
  public source: aplikasiList[];
  private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

  constructor(private masterAplikasiService: MasterAplikasiService, protected router: Router, public global: GlobalState) {
    this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 25px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:34px"></i>{{message}}</div>'

    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

    this.kode_aplikasi = '';
    this.sStorage = this.global.Decrypt('mAuth');

    if (this.HakAkses.HAK_AKSES) {
      this.loadData();
    } else {
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }
  }

  loadData() {
    this.busyloadevent.busy = this.masterAplikasiService.getListMasterAplikasi(this.kode_aplikasi).then(
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
}

export interface aplikasiList {
  KODE_APLIKASI;
  NAMA_APLIKASI;
}