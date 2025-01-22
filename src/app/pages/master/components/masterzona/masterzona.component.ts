import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MasterZonaService } from './masterzona.service';
import { ConfirmationService } from 'primeng/primeng';
import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'masterzona',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './masterzona.html',
  styleUrls: ['./masterzona.scss']
})
export class MasterZona {

  //header
  dataHeader: any = {};
  dataModal: any = {};

  //detail
  zonalist: any = [];

  display: boolean = false;
  newOrEditFlag: any;
  btnInsertFlag: any = false;
  btnDeleteFlag: any;
  btnEditFlag: any;
  active = true;

  authType: any;
  bassPusat: any;
  appCode = "APPL00007";
  HakAkses: any;

  constructor(protected servicezona: MasterZonaService, private router: Router,
    private confirmationService: ConfirmationService, public global: GlobalState) {
    this.dataHeader.KodeBassLoggedin = this.global.Decrypt('mAuth').KODE_BASS
    this.dataHeader.NamaBass = this.global.Decrypt('mBass').NAMA_BASS
    this.dataHeader.KodeKaryawan = this.global.Decrypt('mAuth').USERNAME
    this.dataHeader.dateTrx = new Date();
    this.authType = this.global.Decrypt('mAuth').TYPE
    this.bassPusat = this.global.Decrypt('mParameter').BASS_PUSAT

    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

    if (this.HakAkses.HAK_AKSES) {
      this.loadDataZona();
    } else {
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }
  }

  loadDataZona() {
    if (this.bassPusat == this.dataHeader.KodeBassLoggedin) {
      if (this.HakAkses.HAK_INSERT) {
        this.btnInsertFlag = false;
      } else {
        this.btnInsertFlag = true;
      }

      if (this.HakAkses.HAK_DELETE) {
        this.btnDeleteFlag = false;
      } else {
        this.btnDeleteFlag = true;
      }

      if (this.HakAkses.HAK_EDIT) {
        this.btnEditFlag = false;
      } else {
        this.btnEditFlag = true;
      }

    } else {
      this.btnInsertFlag = true;
      this.btnDeleteFlag = true;
      this.btnEditFlag = true;
    }

    this.servicezona.getData().then((data) => {
      this.zonalist = data;
    });

  }

  view(value) {
    if (value == '') {
      this.dataHeader.NAMA_ZONA = ''
      this.dataHeader.ZONA = '< Auto Generated >'
      this.newOrEditFlag = true;
    } else {
      this.dataHeader.NAMA_ZONA = value.NAMA_ZONA;
      this.dataHeader.ZONA = value.ZONA;
      this.newOrEditFlag = false;
    }
    this.display = true;
  }

  delete(value) {
    this.confirmationService.confirm({
      message: 'Anda yakin untuk menghapus?',
      accept: () => {

        this.servicezona.deleteZona(value.ZONA).then(
          data => {
            alert('Berhasil di delete, Zona: ' + data);

            this.loadDataZona();
          }
          , err => {
            alert('Gagal delete zona');
            // console.log(err); 
          }
        )

      }
    });
  }

  save(form): void {
    this.dataHeader.INPUTTED_BY = this.dataHeader.KodeKaryawan
    this.dataHeader.INPUTTED_BY_BASS = this.dataHeader.KodeBassLoggedin
    this.dataHeader.INPUTTED_DATE = this.dataHeader.dateTrx

    this.servicezona.saveZona(this.dataHeader).then(
      () => {
        form.resetForm();
        this.display = false;

        this.loadDataZona();
      }
      , err => {
        alert('Gagal save zona');
        //  console.log(err); 
      }
    )
  }

  update(form): void {
    this.servicezona.editZona(this.dataHeader).then(
      () => {
        form.resetForm();
        this.display = false;

        this.loadDataZona();
      }
      , err => {
        alert('Gagal update zona');
        //  console.log(err);
      }
    )
  }

  Back(form) {
    form.resetForm();
    this.display = false;
  }

}
