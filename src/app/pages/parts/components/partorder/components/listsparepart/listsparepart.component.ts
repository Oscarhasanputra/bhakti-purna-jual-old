import { Component, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ListSparepartService } from './listsparepart.service';
import { GlobalState } from '../../../../../../global.state';

@Component({
  selector: 'list-sparepart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './listsparepart.html',
  styleUrls: ['./listsparepart.scss']
})
export class ListSparepart {

  sparepartlist: any;
  selectedSparepart: any;
  KodeBass: any;
  selectedSparepart2: any;
  display: boolean = false;
  kodesparepart: any = '';
  data: any = [];

  @Output() SparepartdataOutput = new EventEmitter<String>();
  @Input() componentDisableSparepart = false;

  constructor(protected service: ListSparepartService,
    private _state: GlobalState,
    private route: ActivatedRoute,
    private router: Router, public global: GlobalState) {

    this.KodeBass = this.global.Decrypt('mAuth').KODE_BASS
  }

  onRowSelect(event) {
    this.selectedSparepart2 = [];
    this.selectedSparepart['PartID'] = this.selectedSparepart.Part_ID;
    this.data.push(this.selectedSparepart)
    this.service.getStockSelect(this.data, this.KodeBass.trim())
      .then((detail) => {
        this.selectedSparepart2.push({ Part_ID: detail[0].Part_ID, Part_Name: this.selectedSparepart.Part_Name, QUANTITY: 1, STOCK_CABANG: detail[0].Stock_Cabang, STOCK_PUSAT: detail[0].Stock_Pusat, Harga: this.selectedSparepart.Harga });
        // this.service.pushData(this.selectedSparepart2[0])
        this.SparepartdataOutput.emit(this.selectedSparepart2[0])

        this.selectedSparepart = [];
        this.selectedSparepart2 = [];
        this.data = [];
      })

    this.display = false;
  }

  browseSparepart() {
    if (this.kodesparepart == '') {
      this.service.getSparepartList().then(
        data => this.sparepartlist = data
        , err => console.log(err)
      );
      this.display = true;
    } else {
      this.service.getSparepartListbyKode(this.kodesparepart).then(
        data => {
          if (data.length == 0) {
            alert('Data tidak ditemukan!');
            this.kodesparepart = '';
          } else {
            this.selectedSparepart2 = [];
            data[0]['PartID'] = data[0].Part_ID;
            this.selectedSparepart = data[0];
            this.service.getStockSelect(data, this.KodeBass.trim())
              .then((detail) => {

                this.selectedSparepart2.push({ Part_ID: detail[0].Part_ID, Part_Name: this.selectedSparepart.Part_Name, QUANTITY: 0, STOCK_CABANG: detail[0].Stock_Cabang, STOCK_PUSAT: detail[0].Stock_Pusat, Harga: this.selectedSparepart.Harga });
                // this.service.pushData(this.selectedSparepart2[0])
                this.SparepartdataOutput.emit(this.selectedSparepart2[0])

                this.kodesparepart = '';
                this.selectedSparepart = [];
                this.selectedSparepart2 = [];
              })
          }

        }
        , err => {
          // console.log(err); 
          this.kodesparepart = '';
        }
      );
    }
  }

  Back() {
    this.display = false;
  }

}
