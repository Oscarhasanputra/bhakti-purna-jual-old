import { Component, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogModule, ConfirmationService, DialogModule } from 'primeng/primeng';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';

import { ClaimListService } from './claimlist.service';

import { Claims } from './claim';
import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'claim-list',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './claimlist.html',
  styleUrls: ['./claimlist.scss'],
  providers: [ConfirmationService]
})
export class ClaimList {
  busyLoaderEvent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);
  appCode = "APPL00008";
  HakAkses: any;
  claims: Claims[];
  dateFr: Date;
  dateTo: Date;
  statusClaim: Array<any>;
  selectedStatus: String;
  selectedClaim: String;
  selectedDate: Date;
  searchClaim: String;
  display: boolean = false;

  constructor(protected service: ClaimListService, protected router: Router,
    private confirmationService: ConfirmationService, public global: GlobalState) {
    this.busyLoaderEvent.template = `<div style="margin-top:150px; margin-left:450px; position: fixed; z-index:1000; text-align:center; font-size: 24px; ">
                                      <i class="fa fa-spinner fa-spin" style="font-size:36px;"></i>
                                      {{message}}
                                      </div>`;
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    this.dateFr = new Date();
    this.dateFr.setMonth(prevMonth);
    this.dateFr.setFullYear(prevYear);

    this.dateTo = new Date();

    this.searchClaim = "";
    this.selectedClaim = "";
    this.selectedDate = new Date();

    this.statusClaim = [];
    this.statusClaim.push({ value: '0', desc: 'Belum di Review' });
    this.statusClaim.push({ value: '1', desc: 'Unpaid' });
    this.statusClaim.push({ value: '2', desc: 'Paid' });
    this.statusClaim.push({ value: '3', desc: 'Cannot be Paid' });
    this.statusClaim.push({ value: '', desc: 'All' });

    this.selectedStatus = this.statusClaim[0].value;

    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

    if (this.HakAkses.HAK_AKSES) {
      this.loadData();
    } else {
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }
  }

  public handleModal(modalData: any) {
    this.display = modalData;
  }

  loadData() {
    let kodebass = this.global.Decrypt('mAuth').KODE_BASS;
    if (this.global.Decrypt('mAuth').KODE_BASS == this.global.Decrypt('mParameter').BASS_PUSAT) {
      kodebass = "PUSAT"
    }
    this.busyLoaderEvent.busy = this.service.getDataClaimList(kodebass, this.searchClaim,
      this.dateFr.toISOString().substring(0, 10), this.dateTo.toISOString().substring(0, 10), this.selectedStatus)
      .then(
      data => {
        this.claims = data;
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


  deleteClaim(claim: any) {
    this.confirmationService.confirm({
      header: "Confirmation",
      message: "Hapus " + claim.KODE_CLAIM + "?",
      accept: () => {
        if (claim.STATUS == '1' || claim.STATUS == '2' || claim.STATUS == '3') {
          alert("Claim ini sudah di review");
        } else {
          this.busyLoaderEvent.busy = this.service.deleteDataClaimList(claim.KODE_CLAIM).then(
            data => {
              alert(data);
              this.loadData();
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
    });
  }

  editClaim(claim: any) {
    this.display = true;
    this.selectedClaim = claim.KODE_CLAIM
    this.selectedDate = claim.TANGGAL
  }
}
