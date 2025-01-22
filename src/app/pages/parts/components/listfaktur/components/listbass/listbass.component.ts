import { Component, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ListBassListFakturService } from './listbass.service';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { GlobalState } from '../../../../../../global.state';

@Component({
  selector: 'list-bass-LF',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './listbass.html',
  styleUrls: ['./listbass.scss']
})
export class ListBassListFaktur {
  busyLoaderEvent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);
  basslist: any;
  selectedBass: any;
  KodeBass: any;
  selectedBass2: any;
  display: boolean = false;
  data: any = [];
  dateFr: any;
  dateTo: any;

  @Output() BassdataOutput = new EventEmitter<String>();
  @Input() kodebass;
  // @Input() hiddencomponent;
  // @Input() bassclass;
  @Input() bassAll;
  // @Input() edit: any;

  constructor(protected service: ListBassListFakturService,
    private route: ActivatedRoute,
    private router: Router,
    public global: GlobalState) {

    this.busyLoaderEvent.template = `<div style="margin-top:150px; margin-left:550px; position: fixed; z-index:1000; text-align:center; font-size: 24px; ">
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

    // if(this.bassclass==undefined){
    //   this.bassclass = "form-control with-danger-addon"
    // }
  }

  onRowSelect(event) {
    this.service.getBassList(this.selectedBass.KODE_BASS).then(
      data => {
        this.kodebass.kdBass = data[0].KODE_BASS;
        this.BassdataOutput.emit(data[0]);
      }
      , err => console.log(err)
    );
    this.display = false;
  }


  browseBassbyText() {
    if (this.bassAll == 'ALL') {
      this.busyLoaderEvent.busy = this.service.getBassListAll(this.kodebass.kdBass).then(
        data => {
          if (data.length == 0) {
            if (this.kodebass.kdBass != '') {
              alert('Data tidak ditemukan!');
            }
            this.kodebass.kdBass = '';
            this.BassdataOutput.emit('');
          } else if (data.length > 1) {
            this.kodebass.kdBass = '';
            this.BassdataOutput.emit('');
          } else {
            this.kodebass.kdBass = data[0].KODE_BASS;
            this.BassdataOutput.emit(data[0]);
          }
        },
        err => {
          if (err._body.indexOf("TokenExpiredError") && err.status == 500) {
            alert("Your Token has expired, please login again !")
            sessionStorage.clear();
            this.router.navigate(['/login']);
          }
        });
    } else {
      if (this.global.Decrypt('mAuth').TYPE == "Cabang") {
        this.busyLoaderEvent.busy = this.service.getBassListUnderCabang(this.global.Decrypt('mAuth').KODE_BASS, this.kodebass.kdBass)
          .then(
          data => {
            if (data.length == 0) {
              if (this.kodebass.kdBass != '') {
                alert('Data tidak ditemukan!');
              }
              this.kodebass.kdBass = '';
              this.BassdataOutput.emit('');
            } else if (data.length > 1) {
              this.kodebass.kdBass = '';
              this.BassdataOutput.emit('');
            } else {
              this.kodebass.kdBass = data[0].KODE_BASS;
              this.BassdataOutput.emit(data[0]);
            }
          },
          err => {
            if (err._body.indexOf("TokenExpiredError") && err.status == 500) {
              alert("Your Token has expired, please login again !")
              sessionStorage.clear();
              this.router.navigate(['/login']);
            }
          });
      } else {
        this.busyLoaderEvent.busy = this.service.getBassList(this.kodebass.kdBass).then(
          data => {
            if (data.length == 0) {
              if (this.kodebass.kdBass != '') {
                alert('Data tidak ditemukan!');
              }
              this.kodebass.kdBass = '';
              this.BassdataOutput.emit('');
            } else if (data.length > 1) {
              this.kodebass.kdBass = '';
              this.BassdataOutput.emit('');
            } else {
              this.kodebass.kdBass = data[0].KODE_BASS;
              this.BassdataOutput.emit(data[0]);
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
    }


    // this.service.getBassList(this.kodebass.kdBass).then(
    //   data => {
    //     if (data.length == 0) {
    //       if(this.kodebass.kdBass != ''){
    //         alert('Data tidak ditemukan!');
    //       }
    //       this.kodebass.kdBass = '';
    //       this.modalheader.emit('');
    //     } else if(data.length>1){
    //       this.kodebass.kdBass = '';
    //       this.modalheader.emit('');
    //     } else {
    //       this.kodebass.kdBass = data[0].KODE_BASS;
    //       this.modalheader.emit(data[0]);
    //     }
    //   }
    //   , err => { console.log(err); this.kodebass.kdBass = ''; }
    // );
  }

  browseBass() {
    if (this.bassAll == 'ALL') {
      this.busyLoaderEvent.busy = this.service.getBassListAll("")
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
    } else {
      if (this.global.Decrypt('mAuth').TYPE == "Cabang") {
        this.busyLoaderEvent.busy = this.service.getBassListUnderCabang(this.global.Decrypt('mAuth').KODE_BASS, '')
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
      } else {
        this.busyLoaderEvent.busy = this.service.getBassList("")
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
      }
    }


    // this.service.getBassList('').then(
    //   data => {
    //     this.basslist = data;
    //     this.selectedBass = [];
    //   }
    //   , err => console.log(err)
    // );
    this.display = true;
  }

  Back() {
    this.display = false;
  }

}
