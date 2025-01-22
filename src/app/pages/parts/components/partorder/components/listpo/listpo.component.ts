import { Component, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { ListPoService } from './listpo.service';
import { GlobalState } from '../../../../../../global.state';

@Component({
  selector: 'list-po',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './listpo.html',
  styleUrls: ['./listpo.scss']
})
export class ListPO {

  polist: any;
  selectedPO: any;
  KodeBass: any;
  display: boolean = false;
  data: any = [];
  dateFr: any;
  dateTo: any;

  @Output() POdataOutput = new EventEmitter<String>();
  @Output() NoPOkeypress = new EventEmitter<Boolean>();
  @Input() POdataInput;
  @Input() componentDisablePO;

  constructor(protected service: ListPoService, public global: GlobalState) {

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
    this.service.getPObyKode(this.selectedPO.NO_PO).then(
      data => {
        this.POdataInput.NoPO = data[0].NO_PO;
        this.POdataOutput.emit(data[0]);
      }
      , err => console.log(err)
    );
    this.display = false;
  }

  nopokeyup(e) {
    // if (e == '') {
    //   this.nopokeypress.emit(false);
    // } else {
    this.NoPOkeypress.emit(true);
    // }

  }

  search() {
    this.service.getPOList(this.KodeBass, this.dateFr, this.dateTo).then(
      data => this.polist = data
      , err => console.log(err)
    );
  }

  browsePObyText() {
    this.service.getPObyKode(this.POdataInput.NoPO).then(
      data => {
        if (data.length == 0) {
          if (this.POdataInput.NoPO != '') {
            alert('Data tidak ditemukan!');
          }
          this.POdataInput.NoPO = '';
          this.POdataOutput.emit('');
          this.NoPOkeypress.emit(true);
        } else {
          this.POdataInput.NoPO = data[0].NO_PO;
          this.POdataOutput.emit(data[0]);
          this.NoPOkeypress.emit(true);
        }
      }
      , err => {
        // console.log(err); 
        this.POdataInput.NoPO = '';
      }
    );
  }

  browsePO() {
    this.service.getPOList(this.KodeBass, this.dateFr, this.dateTo).then(
      data => {

        this.polist = data;
        this.NoPOkeypress.emit(true);
        this.selectedPO = [];
      }
      , err => console.log(err)
    );
    this.display = true;
  }

  Back() {
    this.display = false;
  }

}
