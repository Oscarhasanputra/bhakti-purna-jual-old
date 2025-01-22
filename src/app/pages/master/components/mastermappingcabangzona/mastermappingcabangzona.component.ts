import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { SelectItem, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { Router } from '@angular/router';
import { MasterMappingCabangZonaService } from './mastermappingcabangzona.service';
import { GlobalState } from '../../../../global.state'

@Component({
  selector: 'mastermappingcabangzona',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./mastermappingcabangzona.component.scss')],
  template: require('./mastermappingcabangzona.component.html'),
})
export class masterMappingCabangZona {
  appCode = "APPL00060";
  HakAkses: any;
  selectedStatus: string;
  data: Array<any> = [];
  sStorage: any;
  kata_kunci: any;
  kode_cabang: any;
  showPilihKodeCabang: boolean = false;
  public source: cabangZonaList[];
  private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

  constructor(private masterMappingCabangZonaService: MasterMappingCabangZonaService,
    protected router: Router, private confirmationService: ConfirmationService, public global: GlobalState) {

    this.kode_cabang = '';
    this.kata_kunci = '';

    this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 25px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:34px"></i>{{message}}</div>'

    this.sStorage = this.global.Decrypt('mAuth');
    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

    if (this.sStorage.TYPE == "Cabang") {
      this.showPilihKodeCabang = true;

    } else if (this.sStorage.KODE_BASS == this.global.Decrypt('mParameter').BASS_PUSAT) {
      this.showPilihKodeCabang = true;
    } else {
      this.showPilihKodeCabang = false;
    }
    if (this.HakAkses.HAK_AKSES) {
      this.loadData()
    } else {
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }
  }

  public kodeCabangEvent(childData: any) {
    this.kode_cabang = childData;
  }

  loadData() {
    this.busyloadevent.busy = this.masterMappingCabangZonaService.getListMasterMappingCabangZona(this.kode_cabang, this.kata_kunci).then(
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

  tambahMappingCabang() {
    this.router.navigate(['/pages/master/frmInputMasterMappingCabang']);
  }

  delete(kode_cabang, kode_zona) {
    if (this.HakAkses.HAK_DELETE) {
      this.confirmationService.confirm({
        message: 'Anda yakin ingin menghapus mapping ' + kode_cabang + ' ke ' + kode_zona + ' ?',
        accept: () => {
          //Actual logic to perform a confirmation
          this.masterMappingCabangZonaService.deleteMappingZona(kode_cabang, kode_zona).then(
            data => {
              this.loadData();
              alert('Mapping ' + kode_cabang + ' ke ' + kode_zona + ' berhasil di hapus');
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

export interface cabangZonaList {
  CABANG;
  NamaCabang;
  ZONA;
  NamaZona;
}