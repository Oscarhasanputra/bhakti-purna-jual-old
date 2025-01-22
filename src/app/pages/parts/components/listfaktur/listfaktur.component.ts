import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ListFakturService } from './listfaktur.service';
// import { ListBassService } from './components/listbass/listbass.service';
import { ConfirmationService } from 'primeng/primeng';
import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'list-faktur',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './listfaktur.html',
  styleUrls: ['./listfaktur.scss']
})
export class ListFaktur {
  //header
  dataHeader: any = {};
  dataModal: any = {};

  //combobox
  statusInvoices: any;

  //detail
  invoiceList: any = [];
  ModalinvoiceList: any = [];

  status: any;
  dateFr: any;
  dateTo: any;
  display: boolean = false;
  authType: any;
  bassPusat: any;
  basslistFlag: any = false;
  tomboldeleteFlag: any;
  appCode = "APPL00009";
  HakAkses: any;

  constructor(protected service: ListFakturService,
    // protected listbassservice: ListBassService,
    private router: Router,
    private confirmationService: ConfirmationService, 
    public global: GlobalState
  ) {

    this.dataHeader.dateTrx = new Date();
    this.dataHeader.KodeBass = this.global.Decrypt('mAuth').KODE_BASS
    this.dataHeader.NamaBass = this.global.Decrypt('mBass').NAMA_BASS
    this.dataHeader.KodeKaryawan = this.global.Decrypt('mAuth').USERNAME
    this.authType = this.global.Decrypt('mAuth').TYPE
    this.bassPusat = this.global.Decrypt('mParameter').BASS_PUSAT

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    this.dateFr = new Date();
    this.dateFr.setMonth(prevMonth);
    this.dateFr.setFullYear(prevYear);

    this.dateTo = new Date();

    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

    if (this.HakAkses.HAK_AKSES) {
      this.loadStatusInvoice();
      this.loadDataInvoice();
    } else {
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }

    // this.service.getInvoiceList('', this.status, this.dateFr, this.dateTo, this.dataHeader.KodeBass).then(data => {
    //   this.invoiceList = data;
    // }
    //   , err => { console.log(err); }
    // )
  }

  loadDataInvoice() {
    if (this.dataHeader.selectedStatusInvoice == 'All') {
      this.status = ''
    } else {
      this.status = this.dataHeader.selectedStatusInvoice
    }

    if (this.authType == "Bass") {
      if (this.bassPusat == this.dataHeader.KodeBass) {
        this.basslistFlag = false;

        this.service.getInvoiceList(this.dataHeader.kdBassTxt, this.status, this.dateFr, this.dateTo, this.dataHeader.KodeBass).then(data => {
          this.invoiceList = data;
        }
          , err => { console.log(err); }
        )
      } else {
        this.basslistFlag = true;

        this.service.getInvoiceList(this.dataHeader.KodeBass, this.status, this.dateFr, this.dateTo, this.dataHeader.KodeBass).then(data => {
          this.invoiceList = data;
        }
          , err => { console.log(err); }
        )
      }
      this.tomboldeleteFlag = true;
    } else {
      this.basslistFlag = false;
      this.tomboldeleteFlag = false;

      this.service.getInvoiceList(this.dataHeader.kdBassTxt, this.status, this.dateFr, this.dateTo, this.dataHeader.KodeBass).then(data => {
        this.invoiceList = data;
      }
        , err => { console.log(err); }
      )
    }
  }

  loadStatusInvoice() {
    this.statusInvoices = [
      { NAMA_STATUS_INVOICE: 'All' },
      { NAMA_STATUS_INVOICE: 'Waiting To be Received' },
      { NAMA_STATUS_INVOICE: 'Received' }
    ];
    this.dataHeader.selectedStatusInvoice = this.statusInvoices[0].NAMA_STATUS_INVOICE;
  }

  StatusChanged() {
    this.loadDataInvoice();
  }

  search() {
    this.loadDataInvoice();
  }

  handleEventHeader(e) {
    this.dataHeader.kdBassTxt = e.KODE_BASS;
  }

  view(value) {
    this.dataModal.NO_INVOICE = value.NO_INVOICE;
    this.dataModal.TANGGAL = value.TANGGAL;
    this.dataModal.STATUS = value.STATUS;
    this.service.getDetailInvoice(this.dataModal.NO_INVOICE).then(data => {
      this.ModalinvoiceList = data;
    }
      , err => { console.log(err); }
    )
    this.display = true;
  }

  delete(value) {
    if (value.STATUS != 'WAITING TO BE RECEIVED') {
      alert('Data yang dapat di hapus hanya data yang masih pending !')
      return;
    }
    this.confirmationService.confirm({
      message: 'Anda yakin untuk menghapus?',
      accept: () => {
        this.service.deleteFaktur(value.NO_INVOICE).then(data => {
          alert('Berhasil di delete, Faktur nomor: ' + data);

          this.loadDataInvoice();

        }
          , err => { console.log(err); }
        )
      }
    });
  }

  Back() {
    this.display = false;
  }

}
