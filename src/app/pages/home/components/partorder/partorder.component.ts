import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';

import { PartOrderService } from './partorder.service';
import { Subscription } from 'rxjs';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'partorder',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./partorder.component.scss')],
  template: require('./partorder.component.html'),
})
export class partOrder {

  kode_bass: any;
  tglAwal: any;
  tglAkhir: any;
  kode_zona: any;
  inputted_by_bass: any;
  source: any;
  selectedListZona: string;
  showPilihListZona: boolean = false;
  sStorage: any;
  data: Array<any> = [];
  listZona: SelectItem[] = [];
  showPilihKodeBass: boolean = false;
  listBass: listBass[];
  display: boolean = false;
  sKodeBass: any;
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

  constructor(private partOrderService: PartOrderService, protected router: Router, public global: GlobalState) {
    this.kode_bass = '';

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    this.tglAwal = new Date();
    this.tglAwal.setMonth(prevMonth);
    this.tglAwal.setFullYear(prevYear);

    this.tglAkhir = new Date();
    this.kode_zona = '';
    this.inputted_by_bass = ''

    this.sStorage = this.global.Decrypt('mAuth');
    this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 15px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:24px"></i>{{message}}</div>'

    //dropdown zona
    if (this.sStorage.TYPE == "Cabang") {
      this.showPilihListZona = true;

      this.partOrderService.getZonaList(this.sStorage.KODE_BASS).subscribe(
        data => {
          this.data = data.json();
          for (var i = 0; i < this.data.length; i++) {
            this.listZona.push({ label: this.data[i].NAMA_ZONA, value: this.data[i].ZONA });
          }

          this.selectedListZona = this.listZona[0].value;
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
      this.showPilihListZona = true;

      this.partOrderService.getZonaList(this.sStorage.KODE_BASS).subscribe(
        data => {
          this.data = data.json();
          for (var i = 0; i < this.data.length; i++) {
            this.listZona.push({ label: this.data[i].NAMA_ZONA, value: this.data[i].ZONA });
          }

          this.selectedListZona = this.listZona[0].value;
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
      this.showPilihListZona = false;

      this.partOrderService.getZonaList(this.sStorage.KODE_BASS).subscribe(
        data => {
          this.data = data.json();
          for (var i = 0; i < this.data.length; i++) {
            this.listZona.push({ label: this.data[i].NAMA_ZONA, value: this.data[i].ZONA });
          }

          this.selectedListZona = this.listZona[0].value;
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
    //end dropdown zona

    //browse kode bass
    if (this.sStorage.TYPE == "Cabang") {
      this.showPilihKodeBass = true;

      this.partOrderService.getBassListUnderCabang(this.sStorage.KODE_BASS).then(
        data => {
          this.listBass = data;
        },
        err => {
          console.log(err);
        }
      );
    } else if (this.sStorage.KODE_BASS == this.global.Decrypt('mParameter').BASS_PUSAT) {
      this.showPilihKodeBass = true;

      this.partOrderService.getBassList(this.sStorage.KODE_BASS).then(
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

      this.partOrderService.getBassList(this.sStorage.KODE_BASS).then(
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
    //end browse kode bass
  }

  loadData() {
    // console.log(this.kode_bass, this.tglAwal, this.tglAkhir, this.selectedListZona, this.sKodeBass);

    if (this.sKodeBass == '' || !this.sKodeBass) {
      this.sKodeBass = this.sStorage.KODE_BASS;
    }

    this.busyloadevent.busy = this.partOrderService.getPartOrder(this.kode_bass, this.tglAwal, this.tglAkhir, this.selectedListZona, this.sKodeBass).then(
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

  ZonaChanged(value) {
    this.sKodeBass = ''
    this.partOrderService.getBassSelectByZonaAndCabang(this.sStorage.KODE_BASS, value).then(
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

  onRowSelect(event) {
    this.sKodeBass = event.data.KODE_BASS;
    this.display = false;
  }

  tampil(kode_po) {
    this.router.navigate(['/pages/part/partorder', kode_po]);
  }

}

export interface listBass {
  KODE_BASS;
  NAMA_BASS;
}
