import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { SelectItem, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { Router } from '@angular/router';
import { MasterTeknisiService } from './masterteknisi.service';
import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'masterteknisi',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./masterteknisi.component.scss')],
  template: require('./masterteknisi.component.html'),
})
export class masterTeknisi {

  status: Array<any>;
  selectedStatus: string;
  data: Array<any> = [];
  sStorage: any;
  kode_teknisi: any;
  kode_bass: any;
  showPilihKodeBass: boolean = false;
  public source: teknisiList[];
  private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

  constructor(private masterTeknisiService: MasterTeknisiService, protected router: Router,
    private confirmationService: ConfirmationService, public global: GlobalState) {

    this.status = [];
    this.status.push({ label: 'All', value: "" });
    this.status.push({ label: 'Active', value: "A" });
    this.status.push({ label: 'Inactive', value: "I" });

    this.kode_teknisi = '';

    this.selectedStatus = this.status[0].value;

    this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 25px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:34px"></i>{{message}}</div>'

    this.sStorage = this.global.Decrypt('mAuth')

    if (this.sStorage.TYPE == "Cabang") {
      this.showPilihKodeBass = true;
    } else if (this.sStorage.KODE_BASS == this.global.Decrypt('mParameter').BASS_PUSAT) {
      this.showPilihKodeBass = true;
    } else {
      this.showPilihKodeBass = false;
    }

    this.kode_bass = this.sStorage.KODE_BASS

    this.loadData()
  }

  public kodeBassEvent(childData: any) {
    this.kode_bass = childData;
  }

  loadData() {
    this.busyloadevent.busy = this.masterTeknisiService.getListMasterTeknisi(this.kode_bass, this.kode_teknisi, this.selectedStatus).then(
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

  tambahTeknisi() {
    this.router.navigate(['/pages/master/frmInputMasterTeknisi']);
  }

  edit(kode_bass, kode_teknisi) {
    this.router.navigate(['/pages/master/frmInputMasterTeknisi', kode_bass, kode_teknisi, 'edit']);
  }

  delete(kode_teknisi) {
    if (this.sStorage.KODE_ROLE == 'ROLEADMIN') {
      this.confirmationService.confirm({
        message: 'Anda yakin ingin menonaktifkan teknisi ' + kode_teknisi + ' di BASS ' + this.kode_bass + '?',
        accept: () => {
          //Actual logic to perform a confirmation
          this.masterTeknisiService.deleteTeknisi(this.kode_bass, kode_teknisi).then(
            data => {
              this.loadData();
              alert('Teknisi ' + kode_teknisi + ' di ' + this.kode_bass + ' berhasil dinonaktifkan');
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
    } else {
      this.confirmationService.confirm({
        message: 'Anda yakin ingin menonaktifkan teknisi ' + kode_teknisi + ' ?',
        accept: () => {
          //Actual logic to perform a confirmation
          this.masterTeknisiService.deleteTeknisi(this.sStorage.KODE_BASS, kode_teknisi).then(
            data => {
              this.loadData();
              alert('Teknisi ' + kode_teknisi + ' berhasil dinonaktifkan');
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

  activate(kode_teknisi) {
    if (this.sStorage.KODE_ROLE == 'ROLEADMIN') {
      this.confirmationService.confirm({
        message: 'Anda yakin ingin mengaktifkan teknisi ' + kode_teknisi + ' di BASS ' + this.kode_bass + '?',
        accept: () => {
          //Actual logic to perform a confirmation
          this.masterTeknisiService.activateTeknisi(this.kode_bass, kode_teknisi).then(
            data => {
              this.loadData();
              alert('Teknisi ' + kode_teknisi + ' di ' + this.kode_bass + ' berhasil diaktifkan');
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
    } else {
      this.confirmationService.confirm({
        message: 'Anda yakin ingin mengaktifkan teknisi ' + kode_teknisi + ' ?',
        accept: () => {
          //Actual logic to perform a confirmation
          this.masterTeknisiService.activateTeknisi(this.sStorage.KODE_BASS, kode_teknisi).then(
            data => {
              this.loadData();
              alert('Teknisi ' + kode_teknisi + ' berhasil diaktifkan');
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
}

export interface teknisiList {
  KODE_BASS;
  NAMA_BASS;
  KODE_TEKNISI;
  NAMA_TEKNISI;
  STATUS;
}