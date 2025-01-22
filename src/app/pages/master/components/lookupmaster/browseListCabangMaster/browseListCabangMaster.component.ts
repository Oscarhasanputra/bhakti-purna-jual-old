import { Component, ViewChild, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ModalDirective } from 'ng2-bootstrap';

import { BrowseListCabangMasterService } from './browseListCabangMaster.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { GlobalState } from '../../../../../global.state';

@Component({
  selector: 'browselistcabangmaster',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./browseListCabangMaster.component.scss')],
  template: require('./browseListCabangMaster.component.html'),
})
export class browseListCabangMaster {

  public kode_dealer;
  public listCabang: listCabang[];
  public sKodeCabang: any;
  sStorage: any;
  display: boolean = false;
  showPilihKodeCabang: boolean = false;
  @Output() kodeCabangChild = new EventEmitter<string>();
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

  constructor(private browseListCabangMasterService: BrowseListCabangMasterService, protected router: Router
    , public global: GlobalState) {
    this.sStorage = this.global.Decrypt('mAuth');

    if (this.sStorage.TYPE == "Cabang") {
      this.showPilihKodeCabang = true;

      this.busyloadevent.busy = this.browseListCabangMasterService.getBassListUnderCabang(this.sStorage.KODE_BASS).then(
        data => {
          this.listCabang = data;
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
      this.showPilihKodeCabang = true;

      this.busyloadevent.busy = this.browseListCabangMasterService.getCabangList(this.sStorage.KODE_BASS).then(
        data => {
          this.listCabang = data;
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
      this.showPilihKodeCabang = false;

      this.busyloadevent.busy = this.browseListCabangMasterService.getCabangList(this.sStorage.KODE_BASS).then(
        data => {
          this.listCabang = data;
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
    this.sKodeCabang = event.data.KODE_BASS;
    this.display = false;
    this.execemit();
  }

  execemit() {
    this.kodeCabangChild.emit(this.sKodeCabang);
  }

}

export interface listCabang {
  KODE_BASS;
  NAMA_BASS;
}
