import { Component, ViewChild, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ModalDirective } from 'ng2-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { EmailValidator } from '../../../../theme/validators';

import { FrmInputMasterTeknisiService } from './frmInputMasterTeknisi.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'frminputmasterteknisi',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./frmInputMasterTeknisi.component.scss')],
  template: require('./frmInputMasterTeknisi.component.html'),
})
export class frmInputMasterTeknisi {

  public params: any;
  public sKodeTeknisi: any;
  sStorage: any;
  data: Array<any> = [];
  public zona: any;
  registerTeknisi: FormGroup;
  nama_teknisi: AbstractControl;
  validationSukses: any;
  navigasi: any;

  constructor(private frmInputMasterTeknisiService: FrmInputMasterTeknisiService, private formBuilder: FormBuilder, protected router: Router, public activatedRoute: ActivatedRoute) {
    this.sKodeTeknisi = 'Auto Generated';
    this.sStorage = sessionStorage.getItem('mAuth');
    this.sStorage = JSON.parse(this.sStorage);

    this.registerTeknisi = this.formBuilder.group({
      nama_teknisi: ['', Validators.compose([Validators.required])]
    })

    this.nama_teknisi = this.registerTeknisi.controls['nama_teknisi'];

    //get kode teknisi
    let sub = this.activatedRoute.params.subscribe(params => {
      this.params = params;
      //  console.log(params);
      // In a real app: dispatch action to load the details here.
    });

    if (this.params.status == "edit") {
      // console.log("edit");
      this.frmInputMasterTeknisiService.getTeknisiSingle(this.params.kode_bass, this.params.kode_teknisi).subscribe(
        data => {
          this.data = data.json();
          this.sKodeTeknisi = this.data[0].KODE_TEKNISI;
          this.registerTeknisi = this.formBuilder.group({
            nama_teknisi: [this.data[0].NAMA_TEKNISI, Validators.compose([Validators.required])]
          })

          this.nama_teknisi = this.registerTeknisi.controls['nama_teknisi'];

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
    if (this.registerTeknisi.valid) {
      if (this.params.status == "edit") {
        this.frmInputMasterTeknisiService.editTeknisi(values, this.params.kode_bass, this.sKodeTeknisi).then(
          data => {
            if (data['status'] == "sukses") {
              this.validationSukses = "Data teknisi berhasil di rubah"
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
        this.frmInputMasterTeknisiService.saveTambahTeknisi(values).then(
          data => {
            if (data['status'] == "sukses") {
              this.validationSukses = "Teknisi berhasil di tambah. Kode Teknisi anda : " + data['kode_teknisi'] + "."
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
    this.router.navigate(['/pages/master/teknisilist']);
  }

}