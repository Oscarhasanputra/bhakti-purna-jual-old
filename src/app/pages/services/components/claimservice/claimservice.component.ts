import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import * as _ from 'lodash';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';

import { ClaimServiceService } from './claimservice.service';

import { Services } from './service';
import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'claim-service',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './claimservice.html',
  styleUrls: ['./claimservice.scss'],
  providers: [ConfirmationService]
})
export class ClaimService {
  busyLoaderEvent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);
  appCode = "APPL00010";
  HakAkses: any;
  services: Services[];
  selectedServices: any;
  dateFr: Date;
  dateTo: Date;
  dateTrx: Date;
  KodeBass: String;
  NamaBass: String;
  NoClaim: String;

  constructor(protected service: ClaimServiceService, protected router: Router,
    private confirmationService: ConfirmationService, public global: GlobalState) {
    this.busyLoaderEvent.template = `<div style="margin-top:150px; margin-left:450px; position: fixed; z-index:1000; text-align:center; font-size: 24px; ">
                                      <i class="fa fa-spinner fa-spin" style="font-size:36px;"></i>
                                      {{message}}
                                      </div>`;
    this.NoClaim = ""
    this.KodeBass = this.global.Decrypt('mAuth').KODE_BASS;
    this.NamaBass = this.global.Decrypt('mBass').NAMA_BASS;
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    this.dateFr = new Date();
    this.dateFr.setMonth(prevMonth);
    this.dateFr.setFullYear(prevYear);

    this.dateTo = new Date();
    this.dateTrx = new Date();

    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];
    if (this.HakAkses.HAK_AKSES) {
      this.loadData();
    } else {
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }
  }
  loadData() {
    this.busyLoaderEvent.busy = this.service.getDataClaim(this.KodeBass, this.dateFr.toISOString().substring(0, 10), this.dateTo.toISOString().substring(0, 10)).then(
      data => {
        this.services = data;
        this.selectedServices = _.cloneDeep(data);
      },
      err => {
        if (err._body.indexOf("TokenExpiredError") == 1 && err.status == 500) {
          alert("Your Token has expired, please login again !")
          sessionStorage.clear();
          this.router.navigate(['/login']);
        } else {
          alert(err._body);
        }
      }
    );
  }

  saveData(selectedClaim: Array<Services>) {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Simpan claim service?',
      accept: () => {
        //Actual logic to perform a confirmation
        if (typeof selectedClaim === "undefined") {
          alert("Harap memilih service yang ingin di claim !");
        }
        else {
          if (selectedClaim.length == 0) {
            alert("Harap memilih service yang ingin di claim !");
          } else {
            this.busyLoaderEvent.busy = this.service.saveDataClaim(this.dateTrx, this.KodeBass, this.global.Decrypt('mAuth').USERNAME, selectedClaim).then(
              data => {
                alert("Nomor Claim anda adalah : " + data);
                this.loadData();
                this.selectedServices = [];
                // this.NoClaim = data;
              },
              err => {
                if (err._body.indexOf("TokenExpiredError") == 1 && err.status == 500) {
                  alert("Your Token has expired, please login again !")
                  sessionStorage.clear();
                  this.router.navigate(['/login']);
                } else {
                  alert(err._body);
                }
              });
          }
        }
      }
    });
  }


}
