import { Component, ViewChild, ViewEncapsulation, Output, EventEmitter, OnInit, Input  } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ModalDirective } from 'ng2-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { EmailValidator } from '../../../../theme/validators';

import { FrmInputMasterCustomerService } from './frmInputMasterCustomer.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'frminputmastercustomer',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./frmInputMasterCustomer.component.scss')],
  template: require('./frmInputMasterCustomer.component.html'),
})
export class frmInputMasterCustomer {
  /* tambah variable input flagUsedforTransaction untuk digunakan di transaksi */
  @Input() flagUsedforTransaction: Boolean = false;
  @Output() onSavedCustomer = new EventEmitter<Object>();
  @Output() onCancel = new EventEmitter<Boolean>();

  public params:any;
  listKota: SelectItem[] = [];
  public sKodeCustomer: any;
  sStorage:any;
  data:Array<any> = [];
  selectedListKota: string;
  public zona:any;
  registerCustomer: FormGroup;
  nama_customer:AbstractControl;
  alamat_customer:AbstractControl;
  nomor_telepon:AbstractControl;
  nomor_hp:AbstractControl;
  kota:AbstractControl;
  validationSukses: any;
  navigasi:any;

  constructor(private frmInputMasterCustomerService: FrmInputMasterCustomerService, private formBuilder: FormBuilder, protected router: Router, public activatedRoute:ActivatedRoute) {    
    this.sKodeCustomer = 'Auto Generated';
    this.sStorage = sessionStorage.getItem('mAuth');
    this.sStorage = JSON.parse(this.sStorage);

    this.frmInputMasterCustomerService.getKotaList().subscribe(
      data => {
        this.data = data.json();
        for (var i = 0; i < this.data.length; i++) {
            this.listKota.push({label:this.data[i].KOTA, value:this.data[i].PROVINSI});
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

    if(this.params.status == "edit"){
      // console.log("edit");
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
      }
  }

  save(values:Object):void{
    if (this.registerCustomer.valid) {
      if(this.params.status == "edit"){
        this.frmInputMasterCustomerService.editCustomer(values,this.sKodeCustomer).then(
            data  => {
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
      } else {
        this.frmInputMasterCustomerService.saveTambahCustomer(values).then(
            data  => {
              if (data['status'] == "sukses") {
                // tambah kondisi klo pas save di transaksi
                if (this.flagUsedforTransaction) {
                  alert("Customer berhasil di tambah. Kode Customer anda : " + data['kode_customer'] + ".");
                  values['kode_customer'] = data['kode_customer'];
                  values['zona'] = this.zona
                  this.onSavedCustomer.emit(values);
                } else {
                  this.validationSukses = "Customer berhasil di tambah. Kode Customer anda : " + data['kode_customer'] + "."
                  this.navigasi = "Klik disini kembali ke halaman sebelumnya"
                }

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

  cancel(){
    // kasih kondisi jika dipake transaksi
    if (this.flagUsedforTransaction) {
      // back to main transaction
      this.onCancel.emit(false)
    } else {
      this.router.navigate(['/pages/master/mastercustomer']);
    }
  }

  ZonaChanged(label){
    this.zona = this.listKota.find(z => z.label == label)
    this.zona = this.zona.value;
  }

}