import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { SelectItem, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { Router } from '@angular/router';
import { MasterBassService } from './masterbass.service';
import { GlobalState } from '../../../../global.state'

@Component({
  selector: 'masterbass',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./masterbass.component.scss')],
  template: require('./masterbass.component.html'),
  providers: [ConfirmationService]
})
export class masterBass {
  HakAkses: any;
  appCode = "APPL00001";

  status: Array<any>;
  selectedStatus: string;
  listZona: SelectItem[] = [];
  data: Array<any> = [];
  sStorage: any;
  selectedListZona: string;
  public source: bassList[];
  private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

  constructor(private masterBassService: MasterBassService, protected router: Router,
    private confirmationService: ConfirmationService, public global: GlobalState) {
    this.status = [];
    this.status.push({ label: 'All', value: "" });
    this.status.push({ label: 'Active', value: "A" });
    this.status.push({ label: 'Inactive', value: "I" });

    this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 25px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:34px"></i>{{message}}</div>'

    this.selectedStatus = this.status[0].value;

    this.sStorage = this.global.Decrypt('mAuth');

    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

    if (this.HakAkses.HAK_AKSES) {
      this.masterBassService.getZonaList(this.sStorage.KODE_BASS).subscribe(
        data => {
          this.data = data.json();
          for (var i = 0; i < this.data.length; i++) {
            this.listZona.push({ label: this.data[i].NAMA_ZONA, value: this.data[i].ZONA });
          }
          this.selectedListZona = this.listZona[0].value;
          this.loadData();
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
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }
  }

  loadData() {
    this.busyloadevent.busy = this.masterBassService.getListMasterBass(this.selectedListZona, this.selectedStatus).then(
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

  tambahBass() {
    this.router.navigate(['/pages/master/frmInputMasterBass']);
  }

  edit(kode_bass) {
    this.router.navigate(['/pages/master/frmInputMasterBass', kode_bass, 'edit']);
  }

  delete(kode_bass) {
    if (this.HakAkses.HAK_DELETE) {
      this.confirmationService.confirm({
        header: 'Confirmation',
        message: 'Non-aktifkan Bass ' + kode_bass + '?',
        accept: () => {
          this.masterBassService.deleteBass(kode_bass).then(
            data => {
              alert('Bass ' + kode_bass + ' berhasil di non-aktif');
              this.loadData()
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
      alert("Anda tidak berhak menghapus data!")
    }
  }

  activate(kode_bass) {
    if (this.HakAkses.HAK_EDIT) {
      this.confirmationService.confirm({
        header: 'Confirmation',
        message: 'Aktifkan Bass ' + kode_bass + '?',
        accept: () => {
          this.masterBassService.activateBass(kode_bass).then(
            data => {
              alert('Bass ' + kode_bass + ' berhasil di aktifkan');
              this.loadData()
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
      alert("Anda tidak berhak mengganti data!")
    }
  }
}

export interface bassList {
  KODE_BASS;
  KODE_ZONA;
  NAMA_ZONA;
  NAMA_BASS;
  STATUS;
}