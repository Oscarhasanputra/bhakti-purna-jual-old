import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MasterKotaService } from './masterkota.service';
import { MasterZonaService } from '../masterzona/masterzona.service';
import { ConfirmationService } from 'primeng/primeng';
import { GlobalState } from '../../../../global.state'

@Component({
  selector: 'masterkota',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './masterkota.html',
  styleUrls: ['./masterkota.scss']
})
export class MasterKota {

  //header
  dataHeader: any = {};
  dataModal: any = {};

  //detail
  kotalist: any = [];

  zonaCombobox: any;

  zonaselected: any;
  display: boolean = false;
  newOrEditFlag: any;
  active = true;

  authType: any;
  bassPusat: any;
  appCode = "APPL00057";
  HakAkses: any;

  constructor(protected servicekota: MasterKotaService, private router: Router,
    protected servicezona: MasterZonaService, private confirmationService: ConfirmationService,
    public global: GlobalState) {
    this.dataHeader.KodeBass = this.global.Decrypt('mAuth').KODE_BASS;
    this.dataHeader.NamaBass = this.global.Decrypt('mBass').NAMA_BASS;
    this.dataHeader.KodeKaryawan = this.global.Decrypt('mAuth').USERNAME;
    this.dataHeader.dateTrx = new Date();
    this.authType = this.global.Decrypt('mAuth').TYPE;
    this.bassPusat = this.global.Decrypt('mParameter').BASS_PUSAT;

    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

    if (this.HakAkses.HAK_AKSES) {
      this.loadDataKota();
    } else {
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }
  }

  loadDataKota() {
    this.servicekota.getDatas().then((data) => {
      this.kotalist = data;
    });
  }

  view(value) {
    this.servicezona.getData().then(response => this.zonaCombobox = response)

    if (value == '') {
      this.dataHeader.PROVINSI = ''
      this.dataHeader.KOTA = ''
      this.newOrEditFlag = true;
    } else {
      this.dataHeader.PROVINSI = value.PROVINSI;
      this.dataHeader.KOTA = value.KOTA;
      this.servicekota.getData(this.dataHeader.KOTA).then(response => this.dataHeader.zonaselected = response[0].ZONA)
      this.newOrEditFlag = false;
    }
    this.display = true;
  }

  save(form): void {
    this.servicekota.saveKota(this.dataHeader).then(
      () => {
        form.resetForm();
        this.display = false;;

        this.loadDataKota();
      }
      , err => {
        alert('Gagal update kota');
        // console.log(err); 
      }
    )
  }

  update(form): void {
    this.dataHeader.INPUTTED_BY = this.dataHeader.KodeKaryawan
    this.dataHeader.INPUTTED_BY_BASS = this.dataHeader.KodeBass
    this.dataHeader.INPUTTED_DATE = this.dataHeader.dateTrx

    this.servicekota.editKota(this.dataHeader).then(
      () => {
        form.resetForm();
        this.display = false;;

        this.loadDataKota();
      }
      , err => {
        alert('Gagal update kota');
        // console.log(err);
      }
    )
  }

  Back(form) {
    form.resetForm();
    this.display = false;
  }

}
