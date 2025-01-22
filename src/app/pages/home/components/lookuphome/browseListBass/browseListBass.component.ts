import { Component, ViewChild, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ModalDirective } from 'ng2-bootstrap';

import { BrowseListBassService } from './browseListBass.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { GlobalState } from '../../../../../global.state';

@Component({
  selector: 'browselistbass',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./browseListBass.component.scss')],
  template: require('./browseListBass.component.html'),
})
export class browseListBass {

  public kode_dealer;
  public listBass: listBass[];
  public sKodeBass: any;
  sStorage: any;
  display: boolean = false;
  showPilihKodeBass: boolean = false;
  @Output() kodeBassChild = new EventEmitter<string>();
  private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

  showDialog() {
    this.display = true;
  }

  @ViewChild('childModal') childModal: ModalDirective;

  showChildModal(): void {
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  constructor(private browseListBassService: BrowseListBassService, protected router: Router, public global: GlobalState) {

    this.sStorage = this.global.Decrypt('mAuth');

    this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 25px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:34px"></i>{{message}}</div>'

    if (this.sStorage.TYPE == "Cabang") {
      this.showPilihKodeBass = true;

      this.busyloadevent.busy = this.browseListBassService.getBassListUnderCabang(this.sStorage.KODE_BASS).then(
        data => {
          this.listBass = data;
        },
        err => {
          if (err._body == 'You are not authorized' || err.status == 500) {
            alert("Your Token has expired, please login again !")
            sessionStorage.clear();
            this.router.navigate(['/login']);
          }
        }
      );
    } else if (this.sStorage.KODE_BASS == this.global.Decrypt('mParameter').BASS_PUSAT) {
      this.showPilihKodeBass = true;

      this.busyloadevent.busy = this.browseListBassService.getBassList(this.sStorage.KODE_BASS).then(
        data => {
          this.listBass = data;
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
      this.showPilihKodeBass = false;

      this.busyloadevent.busy = this.browseListBassService.getBassList(this.sStorage.KODE_BASS).then(
        data => {
          this.listBass = data;
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
  }

  onBlurMethod() {
    this.execemit();
  }

  onRowSelect(event) {
    this.sKodeBass = event.data.KODE_BASS;
    this.display = false;
    this.execemit();
  }

  execemit() {
    this.kodeBassChild.emit(this.sKodeBass);
  }

}

export interface listBass {
  KODE_BASS;
  NAMA_BASS;
}
