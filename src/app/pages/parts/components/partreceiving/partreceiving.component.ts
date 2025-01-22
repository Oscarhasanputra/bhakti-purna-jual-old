import { Component, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { PartReceivingService } from './partreceiving.service';
// import { ListPartReceivingService } from './components/listpartreceiving/listpartreceiving.service';
import * as _ from 'lodash';
import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'part-receiving',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './partreceiving.html',
  styleUrls: ['./partreceiving.scss']
})
export class PartReceiving {

  //header
  dataHeader: any = { NoPR: '' };
  invoiceListPRList: any = [];
  selectedInvoice: any = [];
  disableSave: boolean = true;
  browsePRFlag: boolean = false;

  authType: any;
  bassPusat: any;
  basslistFlag: any = false;
  tomboldeleteFlag: any;
  appCode = "APPL00015";
  HakAkses: any;

  constructor(protected service: PartReceivingService,
    private router: Router, public global: GlobalState
    // protected listpartreceiving: ListPartReceivingService
  ) {

    this.dataHeader.dateTrx = new Date();
    this.dataHeader.KodeBass = this.global.Decrypt('mAuth').KODE_BASS;
    this.dataHeader.NamaBass = this.global.Decrypt('mBass').NAMA_BASS
    this.dataHeader.KodeKaryawan = this.global.Decrypt('mAuth').USERNAME
    this.authType = this.global.Decrypt('mAuth').TYPE
    this.bassPusat = this.global.Decrypt('mParameter').BASS_PUSAT

    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];
    if (this.HakAkses.HAK_AKSES) {
      this.loadPR();
    } else {
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }
  }

  loadPR() {
    this.service.getInvoicePRList(this.dataHeader.KodeBass)
      .then(data => {
        this.invoiceListPRList = data
      }
      , err => { console.log(err); }
      )
  }

  new() {
    this.dataHeader = { NoPR: '', catatan: '' };
    this.dataHeader.dateTrx = new Date();
    this.dataHeader.KodeBass = this.global.Decrypt('mAuth').KODE_BASS;
    this.dataHeader.NamaBass = this.global.Decrypt('mBass').NAMA_BASS
    this.dataHeader.KodeKaryawan = this.global.Decrypt('mAuth').USERNAME
    this.invoiceListPRList = [];
    this.selectedInvoice = [];

    this.loadPR();

    this.disableSave = true;
    this.browsePRFlag = false;
  }

  onRowSelect(e) {
    if (this.selectedInvoice.length != 0) {
      if (this.browsePRFlag == true) {
        this.disableSave = true;
      } else {
        // if(this.bassPusat==this.dataHeader.KodeBass){
        if (this.HakAkses.HAK_INSERT) {
          this.disableSave = false;
        } else {
          this.disableSave = true;
        }
        // }else{
        //   this.disableSave = true;
        // }
      }

    }
  }

  onRowUnselect(e) {
    if (this.selectedInvoice.length == 0) {
      this.disableSave = true;
    }
  }

  handleEventHeader(e) {
    if (e == '') {
      this.new();
    } else {
      this.dataHeader = {
        NoPR: e.NO_PR,
        KodeBass: this.global.Decrypt('mAuth').KODE_BASS,
        NamaBass: this.global.Decrypt('mBass').NAMA_BASS,
        KodeKaryawan: this.global.Decrypt('mAuth').USERNAME,
        dateTrx: e.TANGGAL,
        catatan: e.CATATAN
      }

      this.invoiceListPRList = [];
      this.selectedInvoice = [];
      for (var i = 0; i < e.DETAILS.length; i++) {
        this.invoiceListPRList.push(e.DETAILS[i]);
        if (e.DETAILS[i].Select_CheckBox == 1) {
          this.selectedInvoice.push(e.DETAILS[i]);
        }
      }
      this.browsePRFlag = true;
      this.disableSave = true;
    }

  }

  save() {

    for (var i = 0; i < this.selectedInvoice.length; i++) {
      if (this.selectedInvoice[i].QUANTITY <= 0) {
        alert('Quantity harus lebih besar daripada 0')
        return;
      } else if (isNaN(this.selectedInvoice[i].QUANTITY) == true) {
        alert('Quantity harus angka')
        return;
      }
    }

    this.dataHeader['Details'] = this.selectedInvoice;

    this.service.save(JSON.stringify(this.dataHeader))
      .then(data => {
        alert('berhasil save');
        this.dataHeader.NoPR = data;
        this.disableSave = true;
      }
      , err => { console.log(err); }
      )
  }

}
