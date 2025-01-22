import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { Router } from '@angular/router';

import { BarangDalamperJalananService } from './barangdalamperjalanan.service';
import { Subscription } from 'rxjs';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'barangdalamperjalanan',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./barangdalamperjalanan.component.scss')],
  template: require('./barangdalamperjalanan.component.html'),
})
export class barangDalamPerjalanan {
  kode_bass: any;
  source: any;
  sStorage: any;
  private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

  public kodeBassEvent(childData: any) {
    this.kode_bass = childData;
  }

  constructor(private barangDalamperJalananService: BarangDalamperJalananService, protected router: Router, public global: GlobalState) {
    this.sStorage = this.global.Decrypt('mAuth');

    this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 15px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:24px"></i>{{message}}</div>'
  }

  loadData() {

    if (!this.kode_bass) {
      this.kode_bass = this.sStorage.KODE_BASS;
    }

    this.busyloadevent.busy = this.barangDalamperJalananService.getBarangDalamPerjalanan(this.kode_bass).then(
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

  onRowSelect(event) {
    this.kode_bass = event.data.KODE_BASS;
  }

}