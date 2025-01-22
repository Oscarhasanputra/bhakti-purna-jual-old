import { Component, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogModule, ConfirmationService, DialogModule } from 'primeng/primeng';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';

import { ReviewClaimServicesService } from './reviewclaimservices.service';

import { Claims } from './claim';

import { GlobalState } from '../../../../global.state';
import { MasterBass } from '../../../lookup/masterbass/masterbass.component';

@Component({
  selector: 'review-claim-service',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './reviewclaimservices.html',
  styleUrls: ['./reviewclaimservices.scss'],
  providers: [ConfirmationService]
})
export class ReviewClaimServices {
  busyLoaderEvent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);
  appCode = "APPL00061";
  HakAkses: any;
  claims: Claims[];
  dateFr: Date;
  dateTo: Date;
  statusClaim: Array<any>;
  selectedStatus: String = "";
  selectedClaim: String = "";
  kodeBassParam: String = "";
  display: boolean = false;
  selectedStatusClaim: String = "";

  constructor(protected service: ReviewClaimServicesService, protected router: Router, private confirmationService: ConfirmationService, public global: GlobalState) {
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

    this.statusClaim = [{ value: '0', desc: 'Belum di Review' },
    { value: '1', desc: 'Unpaid' },
    { value: '2', desc: 'Paid' },
    { value: '', desc: 'All' }];

    this.selectedStatus = this.statusClaim[0].value;

    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];
    if (this.HakAkses.HAK_AKSES) {
      if (this.global.Decrypt('mAuth').TYPE == "Cabang" ||
        this.global.Decrypt('mAuth').KODE_BASS == this.global.Decrypt('mParameter').BASS_PUSAT) {
        this.loadData();
      } else {
        alert('Anda tidak berhak mengakses halaman ini!');
        this.router.navigate(['/pages/home']);
      }
    } else {
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }
  }

  public handleModal(childData: any) {
    this.kodeBassParam = childData;
  }

  public handleModalView(modalData: any) {
    this.display = modalData;
  }

  loadData() {
    this.busyLoaderEvent.busy = this.service.getReviewClaimList(this.global.Decrypt('mParameter').KODE_BASS,
      this.kodeBassParam,
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

  viewClaim(claim: any) {
    this.display = true;
    this.selectedClaim = claim.KODE_CLAIM;
    this.selectedStatusClaim = claim.STATUS;
  }

  changeBgColor(rowData, rowIndex): string {
    switch (rowData.STATUS) {
      case 1: {
        return 'row-backgroundcolor-paid';
      }
      case 2: {
        return 'row-backgroundcolor-unpaid';
      }
      case 3: {
        return 'row-backgroundcolor-cannot';
      }
      default: {
        return '';
      }
    }
  }
}
