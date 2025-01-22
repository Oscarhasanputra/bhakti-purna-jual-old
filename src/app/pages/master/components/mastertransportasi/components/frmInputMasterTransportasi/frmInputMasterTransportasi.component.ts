import { Component, ViewChild, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ModalDirective } from 'ng2-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { EmailValidator } from '../../../../theme/validators';

import { FrmInputMasterTransportasiService } from './frmInputMasterTransportasi.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'frminputmastertransportasi',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./frmInputMasterTransportasi.component.scss')],
  template: require('./frmInputMasterTransportasi.component.html'),
})
export class frmInputMasterTransportasi {

  public params: any;
  public sKodeTransportasi: any;
  sStorage: any;
  data: Array<any> = [];
  public zona: any;
  registerTransportasi: FormGroup;
  jarak: AbstractControl;
  biaya: AbstractControl;
  validationSukses: any;
  navigasi: any;

  constructor(private frmInputMasterTransportasiService: FrmInputMasterTransportasiService, private formBuilder: FormBuilder, protected router: Router, public activatedRoute: ActivatedRoute) {
    this.sKodeTransportasi = 'Auto Generated';
    this.sStorage = sessionStorage.getItem('mAuth');
    this.sStorage = JSON.parse(this.sStorage);

    this.registerTransportasi = this.formBuilder.group({
      jarak: ['', Validators.compose([Validators.required])],
      biaya: ['', Validators.compose([Validators.required])]
    })

    this.jarak = this.registerTransportasi.controls['jarak'];
    this.biaya = this.registerTransportasi.controls['biaya'];

    //get kode teknisi
    let sub = this.activatedRoute.params.subscribe(params => {
      this.params = params;
      //  console.log(params);
      // In a real app: dispatch action to load the details here.
    });

    if (this.params.status == "edit") {
      // console.log("edit");
      this.frmInputMasterTransportasiService.getTransportasiSingle(this.params.kode_transportasi).subscribe(
        data => {
          this.data = data.json();
          this.sKodeTransportasi = this.data[0].KODE_TRANS;
          this.registerTransportasi = this.formBuilder.group({
            jarak: [this.data[0].JARAK, Validators.compose([Validators.required])],
            biaya: [this.data[0].BIAYA, Validators.compose([Validators.required])]
          })

          this.jarak = this.registerTransportasi.controls['jarak'];
          this.biaya = this.registerTransportasi.controls['biaya'];

        },
        err => {
          if (err._body == 'You are not authorized' || err.status == 500) {
            alert("Your Token has expired, please login again !")
            sessionStorage.clear();
            this.router.navigate(['/login']);
          }
        }
      )
    }
  }

  save(values: Object): void {
    if (this.registerTransportasi.valid) {
      if (this.params.status == "edit") {
        this.frmInputMasterTransportasiService.editTransportasi(values, this.sKodeTransportasi).then(
          data => {
            if (data['status'] == "sukses") {
              this.validationSukses = "Data Transportasi berhasil di rubah"
              this.navigasi = "Klik disini kembali ke halaman sebelumnya"
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
        this.frmInputMasterTransportasiService.saveTambahTransportasi(values).then(
          data => {
            if (data['status'] == "sukses") {
              this.validationSukses = "Transportasi berhasil di tambah. Kode Transportasi anda : " + data['kode_transportasi'] + "."
              this.navigasi = "Klik disini kembali ke halaman sebelumnya"
            }
          },
          error => {
            if (error._body == 'You are not authorized' || error.status == 500) {
              alert("Your Token has expired, please login again !")
              sessionStorage.clear();
              this.router.navigate(['/login']);
            }
          });
      }
    }

  }

  cancel() {
    this.router.navigate(['/pages/master/transportasilist']);
  }

}