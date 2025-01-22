import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MasterKaryawanService } from './masterkaryawan.service';
import { ConfirmationService } from 'primeng/primeng';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { GlobalState } from '../../../../global.state'

@Component({
  selector: 'masterkaryawan',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './masterkaryawan.html',
  styleUrls: ['./masterkaryawan.scss']
})
export class MasterKaryawan {
  busyLoaderEvent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

  //header
  dataHeader: any = {};
  dataModal: any = {};

  //detail
  karyawanlist: any = [];
  karyawanlistdetail: any = [];

  basslist: any = [];
  selectedBass: any;

  //combobox
  kodeRoles: any;

  //combobox
  statusKaryawans: any;

  display: boolean = false;
  display2: boolean = false;
  newOrEditFlag: any;
  active = true;
  basslistFlag: any = false;

  authRole: any;
  authType: any;
  bassPusat: any;
  appCode = "APPL00006";
  HakAkses: any;

  bass: any;
  bassFilter: any;

  constructor(protected servicekaryawan: MasterKaryawanService, private router: Router,
    private confirmationService: ConfirmationService, public global: GlobalState) {
    this.dataHeader.KodeBassLoggedin = this.global.Decrypt('mAuth').KODE_BASS;
    this.dataHeader.NamaBass = this.global.Decrypt('mBass').NAMA_BASS;
    this.dataHeader.KodeKaryawan = this.global.Decrypt('mAuth').USERNAME;
    this.dataHeader.dateTrx = new Date();
    this.authType = this.global.Decrypt('mAuth').TYPE
    this.authRole = this.global.Decrypt('mAuth').KODE_ROLE
    this.bassPusat = this.global.Decrypt('mParameter').BASS_PUSAT

    this.bassFilter = "ALL";

    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

    if (this.HakAkses.HAK_AKSES) {
      this.loadKodeRole();
      this.loadStatusKaryawan();
      this.loadDataKaryawan();
    } else {
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }
  }

  loadDataKaryawan() {
    if (this.dataHeader.selectedStatusKaryawan == 'All') {
      this.dataHeader.selectedKodeStatusKaryawan = ''
    } else if (this.dataHeader.selectedStatusKaryawan == 'Active') {
      this.dataHeader.selectedKodeStatusKaryawan = 'A'
    } else {
      this.dataHeader.selectedKodeStatusKaryawan = 'I'
    }

    if (this.bassPusat == this.dataHeader.KodeBassLoggedin) {
      this.basslistFlag = false;

      this.servicekaryawan.getData("", this.dataHeader.selectedKodeStatusKaryawan).then((data) => {
        this.karyawanlist = data;
      });
    } else {
      this.basslistFlag = true;
      this.servicekaryawan.getData(this.dataHeader.KodeBassLoggedin, this.dataHeader.selectedKodeStatusKaryawan).then(
        (data) => {
          this.karyawanlist = data;
        });
    }
  }

  loadStatusKaryawan() {
    this.statusKaryawans = [
      { NAMA_STATUS_KARYAWAN: 'All' },
      { NAMA_STATUS_KARYAWAN: 'Active' },
      { NAMA_STATUS_KARYAWAN: 'Inactive' }
    ];
    this.dataHeader.selectedStatusKaryawan = this.statusKaryawans[0].NAMA_STATUS_KARYAWAN;
  }

  StatusChanged() {
    this.loadDataKaryawan();
  }

  loadKodeRole() {
    this.servicekaryawan.getKodeRole(this.authType, this.authRole).then(
      data => {
        this.kodeRoles = data;
        this.dataHeader.selectedKodeRole = this.kodeRoles[0].KODE_ROLE;
      },
      err => {
        console.log(err);
      }
    );
  }

  handleEventHeader(e) {
    this.dataHeader.kdBasstxt = e.KODE_BASS;
  }

  view(value) {
    if (value == '') {
      this.dataHeader.kdBasstxt = ''
      this.dataHeader.USERNAME = ''
      this.dataHeader.EMAIL = ''
      this.dataHeader.selectedKodeRole = this.kodeRoles[0].KODE_ROLE
      this.newOrEditFlag = true;
      this.display = true;
    } else {
      if (this.HakAkses.HAK_EDIT) {
        this.servicekaryawan.getDataDetail(value.KODE_BASS, value.USERNAME).then((data) => {
          this.karyawanlistdetail = data;

          this.dataHeader.kdBasstxt = this.karyawanlistdetail[0].KODE_BASS;
          this.dataHeader.USERNAME = this.karyawanlistdetail[0].USERNAME;
          this.dataHeader.EMAIL = this.karyawanlistdetail[0].EMAIL;
          this.dataHeader.selectedKodeRole = this.karyawanlistdetail[0].KODE_ROLE
          this.newOrEditFlag = false;
          this.display = true;
        });
      }
    }
  }

  activate(value) {
    if (this.HakAkses.HAK_EDIT) {
      this.confirmationService.confirm({
        message: 'Anda yakin untuk mengaktifkan?',
        accept: () => {

          this.servicekaryawan.aktifkanKaryawan(value).then(
            data => {
              alert('Berhasil di aktifkan, Username: ' + data);

              this.loadDataKaryawan();
            }
            , err => {
              alert('Gagal aktifkan karyawan');
              // console.log(err);
            }
          )

        }
      });
    }
  }

  delete(value) {
    if (this.HakAkses.HAK_DELETE) {
      this.confirmationService.confirm({
        message: 'Anda yakin untuk menghapus?',
        accept: () => {
          this.servicekaryawan.deleteKaryawan(value).then(
            data => {
              alert('Berhasil di delete, Username: ' + data);
              this.loadDataKaryawan();
            }
            , err => {
              alert('Gagal delete karyawan');
              // console.log(err);
            }
          )

        }
      });
    }
  }

  reset(value) {
    if (this.HakAkses.HAK_EDIT) {
      this.confirmationService.confirm({
        message: 'Anda yakin untuk reset password?',
        accept: () => {
          this.servicekaryawan.resetPassKaryawan(value).then(
            data => {
              alert('Berhasil di reset password, password anda sudah direset menjadi: ' + data);
              this.loadDataKaryawan();
            }
            , err => {
              alert('Gagal reset password karyawan');
              // console.log(err); 
            }
          )
        }
      });
    }
  }

  save(form): void {
    this.dataHeader.INPUTTED_BY = this.dataHeader.KodeKaryawan
    this.dataHeader.INPUTTED_BY_BASS = this.dataHeader.KodeBassLoggedin
    this.dataHeader.INPUTTED_DATE = this.dataHeader.dateTrx
    this.dataHeader.authtype = this.authType
    this.servicekaryawan.saveKaryawan(this.dataHeader).then(
      () => {
        form.resetForm();
        this.display = false;
        this.loadDataKaryawan();
      }
      , err => {
        alert('Gagal save karyawan');
        // console.log(err); 
      }
    )
  }

  update(form): void {
    this.servicekaryawan.editKaryawan(this.dataHeader).then(
      () => {
        form.resetForm();
        this.display = false;;

        this.loadDataKaryawan();
      }
      , err => {
        alert('Gagal update karyawan');
        // console.log(err); 
      }
    )
  }

  Back(form) {
    this.dataHeader.kdBass = ''
    form.resetForm();
    this.display = false;
  }


  onRowSelect(event) {
    this.servicekaryawan.getBassList(this.selectedBass.KODE_BASS).then(
      data => {
        this.dataHeader.kdBasstxt = data[0].KODE_BASS;
      }
      , err => console.log(err)
    );
    this.display2 = false;
  }


  browseBassbyText() {
    this.busyLoaderEvent.busy = this.servicekaryawan.getBassListAll(this.dataHeader.kdBasstxt).then(
      data => {
        if (data.length == 0) {
          if (this.dataHeader.kdBasstxt != '') {
            alert('Data tidak ditemukan!');
          }
          this.dataHeader.kdBasstxt = '';
        } else if (data.length > 1) {
          this.dataHeader.kdBasstxt = '';
        } else {
          this.dataHeader.kdBasstxt = data[0].KODE_BASS;
        }
      },
      err => {
        if (err._body.indexOf("TokenExpiredError") && err.status == 500) {
          alert("Your Token has expired, please login again !")
          sessionStorage.clear();
          this.router.navigate(['/login']);
        }
      });
  }

  browseBass() {
    this.busyLoaderEvent.busy = this.servicekaryawan.getBassListAll("")
      .then(
      data => {
        this.basslist = data;
        this.selectedBass = [];
      },
      err => {
        if (err._body.indexOf("TokenExpiredError") && err.status == 500) {
          alert("Your Token has expired, please login again !")
          sessionStorage.clear();
          this.router.navigate(['/login']);
        }
      });

    this.display2 = true;
  }

  close() {
    this.display2 = false;
  }
}
