import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { SelectItem, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { Router } from '@angular/router';
import { MasterTransportasiService } from './mastertransportasi.service';

@Component({
  selector: 'mastertransportasi',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./mastertransportasi.component.scss')],
  template: require('./mastertransportasi.component.html'),
})
export class masterTransportasi {

  selectedStatus: string;
  data: Array<any> = [];
  sStorage: any;
  kode_transportasi: any;
  kode_bass: any;
  public source: transportasiList[];
  private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

  constructor(private masterTransportasiService: MasterTransportasiService, protected router: Router, private confirmationService: ConfirmationService) {

    this.kode_transportasi = '';

    this.sStorage = sessionStorage.getItem('mAuth');
    this.sStorage = JSON.parse(this.sStorage);
    this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 25px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:34px"></i>{{message}}</div>'

    this.loadData()
  }

  loadData() {
    this.sStorage = sessionStorage.getItem('mAuth');
    this.sStorage = JSON.parse(this.sStorage);

    this.busyloadevent.busy = this.masterTransportasiService.getListMasterTransportasi(this.kode_transportasi).then(
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

  tambahTransportasi() {
    this.router.navigate(['/pages/master/frmInputMasterTransportasi']);
  }

  edit(kode_transportasi) {
    this.router.navigate(['/pages/master/frmInputMasterTransportasi', kode_transportasi, 'edit']);
  }

  delete(kode_transportasi) {

    this.sStorage = sessionStorage.getItem('mAuth');
    this.sStorage = JSON.parse(this.sStorage);

    this.confirmationService.confirm({
      message: 'Anda yakin ingin menghapus transportasi ini?',
      accept: () => {
        //Actual logic to perform a confirmation
        this.masterTransportasiService.deleteTransportasi(kode_transportasi).then(
          data => {
            this.loadData();
            alert('Transportasi berhasil di hapus');
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
    });
  }
}

export interface transportasiList {
  KODE_TRANS;
  JARAK;
  BIAYA;
}