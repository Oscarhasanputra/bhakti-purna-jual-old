import { Component, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { PartOrderService } from './partorder.service';
import { ListPoService } from './components/listpo/listpo.service';
import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'part-order',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './partorder.html',
  styleUrls: ['./partorder.scss']
})
export class PartOrder {
  //header
  dataHeader: any = { NoPO: '', KODE_SERVICE: '' };

  //combobox
  tipePOs: any;

  //detail
  selectedPart: any = 0;
  sparepartList: any = [];

  //lain-lain
  display: boolean = false;
  disableSparepartcomponent: any;
  disableBarangcomponent: any;
  disableSavebtn: boolean = true;
  disableServicecomponent: any;
  disableRemovebtn: any = true;
  disablePOcomponent: any = false;
  disableHeaderComp: any = false;
  hiddenBackbtn: any = true;
  hiddenNewbtn: any = false;

  authType: any;
  bassPusat: any;
  appCode = "APPL00014";
  HakAkses: any;

  constructor(protected service: PartOrderService,
    protected listposervice: ListPoService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location, public global: GlobalState
  ) {

    this.route.params.forEach((params: Params) => {

      let id = params['id'];
      if (id == undefined) {
        this.dataHeader.dateTrx = new Date();
        this.dataHeader.KodeBass = this.global.Decrypt('mAuth').KODE_BASS;
        this.dataHeader.NamaBass = this.global.Decrypt('mBass').NAMA_BASS
        this.dataHeader.KodeKaryawan = this.global.Decrypt('mAuth').USERNAME
        this.authType = this.global.Decrypt('mAuth').TYPE
        this.bassPusat = this.global.Decrypt('mParameter').BASS_PUSAT

        this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

        if (this.HakAkses.HAK_AKSES) {
          this.loadTipePO();

          this.disablePOcomponent = false;
          this.hiddenBackbtn = true;
          this.hiddenNewbtn = false;
        } else {
          alert('Anda tidak berhak mengakses halaman ini!');
          this.router.navigate(['/pages/home']);
        }

      } else {
        this.listposervice.getPObyKode(id).then(
          data => {
            this.loadTipePO();
            this.loadFromPOcomponent(data[0])
            this.disablePOcomponent = true;
            this.hiddenBackbtn = false;
            this.hiddenNewbtn = true;
          }
          , err => console.log(err)
        );
      }

    });
  }

  loadTipePO() {
    this.service.getTipePO().then(
      data => {
        this.tipePOs = data;
        this.dataHeader.selectedTipePO = this.tipePOs[0].KODE_TIPE_PO;
      },
      err => {
        console.log(err);
      }
    );
  }

  new() {
    //header
    this.dataHeader = { NoPO: '', KODE_SERVICE: '' };
    this.dataHeader.dateTrx = new Date();

    this.dataHeader.KodeBass = this.global.Decrypt('mAuth').KODE_BASS;
    this.dataHeader.NamaBass = this.global.Decrypt('mBass').NAMA_BASS;
    this.dataHeader.KodeKaryawan = this.global.Decrypt('mAuth').USERNAME;
    this.dataHeader.selectedTipePO = this.tipePOs[0].KODE_TIPE_PO;

    //detail
    this.selectedPart = 0;
    this.sparepartList = [];

    //lain-lain
    this.display = false;
    this.disableSparepartcomponent = false;
    this.disableBarangcomponent = false;
    this.disableSavebtn = true;
    this.disableServicecomponent = false;
    this.disableRemovebtn = true;
    this.disablePOcomponent = false;
    this.disableHeaderComp = false;
    this.hiddenBackbtn = true;
    this.hiddenNewbtn = false;
  }

  loadFromPOcomponent(e) {
    if (e == '') {
      this.new();
    } else {
      this.dataHeader = {
        NoPO: e.NO_PO,
        KODE_SERVICE: e.NOMOR_SERVICE,
        KodeBass: this.global.Decrypt('mAuth').KODE_BASS,
        NamaBass: this.global.Decrypt('mBass').NAMA_BASS,
        KodeKaryawan: this.global.Decrypt('mAuth').USERNAME,
        dateTrx: e.TANGGAL,
        selectedTipePO: e.KODE_TIPE_PO,
        catatan: e.CATATAN
      }
      this.sparepartList = [];
      for (var i = 0; i < e.DETAILS.length; i++) {
        this.sparepartList.push(e.DETAILS[i]);
      }
      this.disableSparepartcomponent = true;
      this.disableBarangcomponent = true;
      this.disableServicecomponent = true;
      this.disableRemovebtn = true;
      this.disableHeaderComp = true;
    }

  }

  loadFromServiceComponent(e) {
    this.dataHeader.KODE_SERVICE = e.KODE_SERVICE;
  }

  POcomponentKeypress(e) {
    this.disableSavebtn = e;
  }

  ServicecomponentKeypress(e) {
    this.disableSavebtn = e;
  }

  loadFromPartComponent(e) {
    this.sparepartList.push(e);
    this.disableRemovebtn = false;
    // if(this.bassPusat==this.dataHeader.KodeBass){
    if (this.HakAkses.HAK_INSERT) {
      this.disableSavebtn = false;
    } else {
      this.disableSavebtn = true;
    }
    // }else{
    //   this.disableSavebtn = true;
    // }
  }

  browseSparepart() {
    this.display = true;
  }

  remove(part) {
    for (var i = 0; i < this.sparepartList.length; i++) {
      if (this.sparepartList[i] === part) {
        this.sparepartList.splice(i, 1);
      }
    }
    if (this.sparepartList.length == 0) {
      this.disableSavebtn = true;
      this.disableRemovebtn = true;
    }
  }

  removeSelected() {
    if (this.selectedPart.length > 0) {
      for (var i = 0; i < this.sparepartList.length; i++) {
        for (var x = 0; x < this.selectedPart.length; x++) {
          if (this.sparepartList[i] === this.selectedPart[x]) {
            this.sparepartList.splice(i, 1);
          }
        }
      }
      this.selectedPart = [];
    } else {
      alert('Data yang mau di remove belum di pilih!');
    }
    if (this.sparepartList.length == 0) {
      this.disableSavebtn = true;
      this.disableRemovebtn = true;
    }
  }

  save() {
    for (var i = 0; i < this.sparepartList.length; i++) {
      if (this.sparepartList[i].QUANTITY <= 0) {
        alert('Quantity harus lebih besar daripada 0')
        return;
      } else if (isNaN(this.sparepartList[i].QUANTITY) == true) {
        alert('Quantity harus angka')
        return;
      }
    }

    this.dataHeader['Details'] = this.sparepartList;

    this.service.save(JSON.stringify(this.dataHeader))
      .then(data => {

        this.service.sendEmail(this.bassPusat, this.dataHeader.KodeKaryawan, this.dataHeader.KodeBass, data, this.dataHeader.dateTrx, this.dataHeader.Details).then(data => {
          alert('Berhasil save, email terkirim');
          this.dataHeader.NoPO = data;
          this.disableSparepartcomponent = true;
          this.disableBarangcomponent = true;
          this.disableServicecomponent = true;
          this.disableRemovebtn = true;
          this.disableSavebtn = true;
          this.disableHeaderComp = true;
        }
          , err => {
            alert('Berhasil save, email tidak terkirim');
            // console.log(err);
          }
        )

      }
      , err => {
        alert('Gagal save');
        //  console.log(err); 
      }
      )
  }


  back(): void {
    this.location.back();
  }
}
