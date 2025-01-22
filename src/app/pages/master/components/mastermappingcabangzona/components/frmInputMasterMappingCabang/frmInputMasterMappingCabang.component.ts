import { Component, ViewChild, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ModalDirective } from 'ng2-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { EmailValidator } from '../../../../theme/validators';

import { FrmInputMasterMappingCabangService } from './frmInputMasterMappingCabang.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalState } from '../../../../../../global.state'

@Component({
  selector: 'frminputmastermappingcabang',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./frmInputMasterMappingCabang.component.scss')],
  template: require('./frmInputMasterMappingCabang.component.html'),
})
export class frmInputMasterMappingCabang {
  appCode = "APPL00060";
  HakAkses: any;

  public params: any;
  sStorage: any;
  data: Array<any> = [];
  registerCabang: FormGroup;
  cabang: AbstractControl;
  zona: AbstractControl;
  validationSukses: any;
  navigasi: any;
  listCabang: SelectItem[] = [];
  listZona: SelectItem[] = [];
  selectedCabang: string;
  selectedZona: string;
  btnIsActive: boolean;

  constructor(private frmInputMasterMappingCabangService: FrmInputMasterMappingCabangService,
    private formBuilder: FormBuilder, protected router: Router, public activatedRoute: ActivatedRoute,
    public global: GlobalState) {

    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

    this.btnIsActive = true;
    this.sStorage = this.global.Decrypt('mAuth');

    this.registerCabang = this.formBuilder.group({
      cabang: [''],
      zona: ['']
    })

    this.cabang = this.registerCabang.controls['cabang'];
    this.zona = this.registerCabang.controls['zona'];

    if (this.HakAkses.HAK_AKSES) {
      this.frmInputMasterMappingCabangService.getCabangList().subscribe(
        data => {
          this.data = data.json();
          for (var i = 0; i < this.data.length; i++) {
            this.listCabang.push({ label: this.data[i].CABANG, value: this.data[i].NAMA_CABANG });
          }

          this.selectedCabang = this.listCabang[0].label;
        },
        err => {
          if (err._body == 'You are not authorized' || err.status == 500) {
            alert("Your Token has expired, please login again !")
            sessionStorage.clear();
            this.router.navigate(['/login']);
          }
        }
      );

      this.frmInputMasterMappingCabangService.getZonaList().subscribe(
        data => {
          this.data = data.json();
          if (this.data.length == 0) {

          } else {
            for (var i = 0; i < this.data.length; i++) {
              this.listZona.push({ label: this.data[i].ZONA, value: this.data[i].NAMA_ZONA });
            }
            this.selectedZona = this.listZona[0].label;
          }
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
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }
  }

  save(values: Object): void {
    if (this.HakAkses.HAK_INSERT) {
      this.frmInputMasterMappingCabangService.saveTambahMappingZona(values).then(
        data => {
          if (data['status'] == "sukses") {
            this.validationSukses = "Mapping zona berhasil di tambah."
            this.navigasi = "Klik disini kembali ke halaman sebelumnya"
            this.btnIsActive = false;
          }
        },
        error => {
          if (error._body == 'You are not authorized' || error.status == 500) {
            alert("Your Token has expired, please login again !")
            sessionStorage.clear();
            this.router.navigate(['/login']);
          }
        });
    } else {
      alert('Anda tidak berhak menambah data!');
    }
  }

  cancel() {
    this.router.navigate(['/pages/master/cabangmappinglist']);
  }

}