import { Component, ViewChild, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ModalDirective } from 'ng2-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { EmailValidator } from '../../../../theme/validators';

import { FrmInputMasterCustomerService } from './frmInputMasterCustomer.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalState } from '../../../../../../global.state'

@Component({
  selector: 'frminputmastercustomer',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./frmInputMasterCustomer.component.scss')],
  template: require('./frmInputMasterCustomer.component.html'),
})
export class frmInputMasterCustomer {
  HakAkses: any;
  appCode = "APPL00002";

  public params: any;
  listKota: SelectItem[] = [];
  public sKodeCustomer: any;
  data: Array<any> = [];
  selectedListKota: string;
  public zona: any;
  registerCustomer: FormGroup;
  nama_customer: AbstractControl;
  alamat_customer: AbstractControl;
  nomor_telepon: AbstractControl;
  nomor_hp: AbstractControl;
  kota: AbstractControl;
  validationSukses: any;
  navigasi: any;

  constructor(private frmInputMasterCustomerService: FrmInputMasterCustomerService,
    private formBuilder: FormBuilder, protected router: Router, public activatedRoute: ActivatedRoute,
    public global: GlobalState) {
    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

    this.sKodeCustomer = 'Auto Generated';

    if (this.HakAkses.HAK_AKSES) {
      this.frmInputMasterCustomerService.getKotaList().subscribe(
        data => {
          this.data = data.json();
          for (var i = 0; i < this.data.length; i++) {
            this.listKota.push({ label: this.data[i].KOTA, value: this.data[i].PROVINSI });
          }
          this.selectedListKota = this.listKota[0].label;
        },
        err => {
          if (err._body == 'You are not authorized' || err.status == 500) {
            alert("Your Token has expired, please login again !")
            sessionStorage.clear();
            this.router.navigate(['/login']);
          }
        }
      );

      this.registerCustomer = this.formBuilder.group({
        nama_customer: ['', Validators.compose([Validators.required])],
        alamat_customer: ['', Validators.compose([Validators.required])],
        nomor_telepon: ['', Validators.compose([Validators.required])],
        kota: ['', Validators.compose([Validators.required])],
        nomor_hp: ['']
      })

      this.nama_customer = this.registerCustomer.controls['nama_customer'];
      this.alamat_customer = this.registerCustomer.controls['alamat_customer'];
      this.nomor_telepon = this.registerCustomer.controls['nomor_telepon'];
      this.kota = this.registerCustomer.controls['kota'];
      this.nomor_hp = this.registerCustomer.controls['nomor_hp'];

      //get kode customer
      let sub = this.activatedRoute.params.subscribe(params => {
        this.params = params;
        //  console.log(params);
        // In a real app: dispatch action to load the details here.
      });
    } else {
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }

    if (this.params.status == "edit") {
      if (this.HakAkses.HAK_EDIT) {
        this.frmInputMasterCustomerService.getCustomerSingle(this.params.kode_customer).subscribe(
          data => {
            this.data = data.json();
            this.sKodeCustomer = this.data[0].KODE_CUSTOMER;
            this.registerCustomer = this.formBuilder.group({
              nama_customer: [this.data[0].NAMA_CUSTOMER, Validators.compose([Validators.required])],
              alamat_customer: [this.data[0].ALAMAT_CUSTOMER, Validators.compose([Validators.required])],
              nomor_telepon: [this.data[0].TELP_CUSTOMER, Validators.compose([Validators.required])],
              kota: [this.data[0].KOTA_CUSTOMER, Validators.compose([Validators.required])],
              nomor_hp: [this.data[0].HP_CUSTOMER]
            })

            this.nama_customer = this.registerCustomer.controls['nama_customer'];
            this.alamat_customer = this.registerCustomer.controls['alamat_customer'];
            this.nomor_telepon = this.registerCustomer.controls['nomor_telepon'];
            this.kota = this.registerCustomer.controls['kota'];
            this.nomor_hp = this.registerCustomer.controls['nomor_hp'];
          },
          err => {
            if (err._body == 'You are not authorized' || err.status == 500) {
              alert("Your Token has expired, please login again !")
              sessionStorage.clear();
              this.router.navigate(['/login']);
            }
          }
        )
      } else {
        alert('Anda tidak berhak mengakses halaman ini!');
        this.router.navigate(['/pages/master/customerlist']);
      }
    } else {
      if (this.HakAkses.HAK_INSERT) {
      } else {
        alert('Anda tidak berhak mengakses halaman ini!');
        this.router.navigate(['/pages/master/customerlist']);
      }
    }
  }

  save(values: Object): void {
    if (this.registerCustomer.valid) {
      if (this.params.status == "edit") {
        if (this.HakAkses.HAK_EDIT) {
          this.frmInputMasterCustomerService.editCustomer(values, this.sKodeCustomer).then(
            data => {
              if (data['status'] == "sukses") {
                this.validationSukses = "Data customer berhasil di rubah"
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
      } else {
        if (this.HakAkses.HAK_INSERT) {
          this.frmInputMasterCustomerService.saveTambahCustomer(values).then(
            data => {
              if (data['status'] == "sukses") {
                this.validationSukses = "Customer berhasil di tambah. Kode Customer anda : " + data['kode_customer'] + "."
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

  }

  cancel() {
    this.router.navigate(['/pages/master/customerlist']);
  }

  ZonaChanged(label) {
    this.zona = this.listKota.find(z => z.label == label)
    this.zona = this.zona.value;
  }

}