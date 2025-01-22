import { Component, ViewEncapsulation, Input, EventEmitter, Output, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import * as _ from 'lodash';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';

import { EditClaimService } from './editclaim.service';

import { Services } from './service';
import { GlobalState } from '../../../../../../global.state';

@Component({
  selector: 'edit-claim',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './editclaim.html',
  styleUrls: ['./editclaim.scss'],
  providers: [ConfirmationService]
})
export class EditClaim implements DoCheck {

  @Input() NoClaim: String;
  @Input() TglClaim: Date;
  @Output() viewState = new EventEmitter<boolean>();

  busyLoaderEvent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);
  services: Services[];
  selectedServices: any;
  dateTrx: Date;
  KodeBass: String;
  oldNoClaim: String = '';
  timeZone: any;

  constructor(protected service: EditClaimService, protected router: Router,
    private confirmationService: ConfirmationService, public global: GlobalState) {
    this.KodeBass = this.global.Decrypt('mAuth').KODE_BASS
    this.busyLoaderEvent.template = `<div style="margin-top:150px; margin-left:550px; position: fixed; z-index:1000; text-align:center; font-size: 24px; ">
                                      <i class="fa fa-spinner fa-spin" style="font-size:36px;"></i>
                                      {{message}}
                                      </div>`;
  }

  ngDoCheck() {
    if (this.NoClaim !== this.oldNoClaim) {
      this.services = [];
      this.selectedServices = [];
      this.oldNoClaim = this.NoClaim;
      this.loadData(this.NoClaim);
    }
  }

  loadData(noClaim: String) {
    this.timeZone = this.TglClaim.getTimezoneOffset
    this.busyLoaderEvent.busy = this.service.getClaimDetail(noClaim).then(
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

  cancel() {
    this.viewState.emit(false);
  }

  saveData(selectedClaim: Array<any>) {
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
            let removedClaim = this.services.filter(claim => {
              for (let count in selectedClaim) {
                if (_.isEqual(claim, selectedClaim[count])) {
                  return false;
                }
              }
              return true;
            });

            this.busyLoaderEvent.busy = this.service.removeDataClaim(this.NoClaim, removedClaim).then(
              data => {
                alert(data);
                this.loadData(this.NoClaim);
                this.viewState.emit(false);
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
