import { Component, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ListPartReceivingService } from './listpartreceiving.service';
import { GlobalState } from '../../../../../../global.state';

@Component({
  selector: 'list-partreceiving',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './listpartreceiving.html',
  styleUrls: ['./listpartreceiving.scss']
})
export class ListPartReceiving {

  prlist: any;
  selectedPR: any;
  KodeBass: any;
  selectedPR2: any;
  display: boolean = false;
  data: any = [];
  dateFr: any;
  dateTo: any;

  @Output() modalheader = new EventEmitter<String>();
  @Output() noprkeypress = new EventEmitter<Boolean>();
  @Input() nopr;

  constructor(protected service: ListPartReceivingService,
    private _state: GlobalState,
    private route: ActivatedRoute,
    private router: Router, public global: GlobalState) {

    this.KodeBass = this.global.Decrypt('mAuth').KODE_BASS;

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    this.dateFr = new Date();
    this.dateFr.setMonth(prevMonth);
    this.dateFr.setFullYear(prevYear);

    this.dateTo = new Date();
  }

  onRowSelect(event) {
    this.service.getPRbyKode(this.selectedPR.NO_PR, this.KodeBass).then(
      data => {
        this.nopr.NoPR = data[0].NO_PR;
        this.modalheader.emit(data[0]);
      }
      , err => console.log(err)
    );
    this.display = false;
  }

  noprkeyup(e) {
    if (e == '') {
      this.noprkeypress.emit(false);
    } else {
      this.noprkeypress.emit(true);
    }

  }

  search() {
    this.service.getPRList(this.KodeBass, this.dateFr, this.dateTo).then(
      data => this.prlist = data
      , err => console.log(err)
    );
  }

  browsePRbyText() {
    this.service.getPRbyKode(this.nopr.NoPR, this.KodeBass).then(
      data => {
        if (data.length == 0) {
          if (this.nopr.NoPR != '') {
            alert('Data tidak ditemukan!');
          }
          this.nopr.NoPR = '';
          this.modalheader.emit('');
          this.noprkeypress.emit(false);
        } else {
          this.nopr.NoPR = data[0].NO_PR;
          this.modalheader.emit(data[0]);
          this.noprkeypress.emit(true);
        }
      }
      , err => {
        // console.log(err);
        this.nopr.NoPR = '';
      }
    );
  }

  browsePR() {
    this.service.getPRList(this.KodeBass, this.dateFr, this.dateTo).then(
      data => {
        this.prlist = data;
        this.noprkeypress.emit(true);
        this.selectedPR = [];
      }
      , err => console.log(err)
    );
    this.display = true;
  }

  Back() {
    this.display = false;
  }

}
