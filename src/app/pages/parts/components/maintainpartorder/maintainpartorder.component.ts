import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MaintainPartOrderService } from './maintainpartorder.service';
// import { LookupService } from '../../lookup/lookup.service';
import { ConfirmationService } from 'primeng/primeng';
import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'maintainpart-order',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './maintainpartorder.html',
  styleUrls: ['./maintainpartorder.scss']
})
export class MaintainPartOrder {
  //header
  dataHeader: any = {};

  //combobox
  statusPOs: any;

  //detail
  poList: any = [];

  status: any;
  authType: any;
  bassPusat: any;
  basslistFlag: any = false;
  tomboldeleteFlag: any;
  appCode = "APPL00019";
  HakAkses: any;

  constructor(protected service: MaintainPartOrderService,
    // protected lookupservice: LookupService,
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

    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

    if (this.HakAkses.HAK_AKSES) {
      this.loadStatusPO();
      this.loadDataPartOrder();
    } else {
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }
  }

  loadStatusPO() {
    this.statusPOs = [
      { NAMA_STATUS_PO: 'All' },
      { NAMA_STATUS_PO: 'New' },
      { NAMA_STATUS_PO: 'Edited' },
      { NAMA_STATUS_PO: 'Deleted' },
      { NAMA_STATUS_PO: 'Processed' },
      { NAMA_STATUS_PO: 'Sent' }
    ];
    this.dataHeader.selectedStatusPO = this.statusPOs[1].NAMA_STATUS_PO;
  }

  loadDataPartOrder() {
    if (this.dataHeader.selectedStatusPO == 'All') {
      this.status = ''
    } else {
      this.status = this.dataHeader.selectedStatusPO
    }

    if (this.authType == "Bass") {
      if (this.bassPusat == this.dataHeader.KodeBass) {
        this.basslistFlag = false;

        this.service.getPOList(this.dataHeader.kdBassTxt, this.status).then(data => {
          this.poList = data;
        }
          , err => { console.log(err); }
        )

      } else {
        this.basslistFlag = true;

        this.service.getPOList(this.dataHeader.KodeBass, this.status).then(data => {
          this.poList = data;
        }
          , err => { console.log(err); }
        )
      }

      if (this.HakAkses.HAK_DELETE) {
        this.tomboldeleteFlag = false;
      } else {
        this.tomboldeleteFlag = true;
      }

    } else {
      this.basslistFlag = false;
      this.tomboldeleteFlag = true;

      this.service.getPOList(this.dataHeader.kdBassTxt, this.status).then(data => {
        this.poList = data;
      }
        , err => { console.log(err); }
      )
    }
  }

  search() {
    this.loadDataPartOrder();
  }

  StatusChanged() {
    this.loadDataPartOrder();
  }

  handleEventHeader(e) {
    this.dataHeader.kdBassTxt = e.KODE_BASS;
  }

  view(value) {
    this.router.navigate(['pages/part/partorder', value.NO_PO]);
  }

  delete(value) {
    this.confirmationService.confirm({
      message: 'Anda yakin untuk menghapus?',
      accept: () => {
        this.service.deletePO(value.NO_PO, 'Deleted').then(data => {
          alert('Berhasil di delete, PO nomor: ' + data);

          this.loadDataPartOrder();

        }
          , err => { console.log(err); }
        )
      }
    });

  }

}