import { Component, ViewChild, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ModalDirective } from 'ng2-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { EmailValidator } from '../../../../../../theme/validators';

import { FrmInputMasterBassService } from './frmInputMasterBass.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalState } from '../../../../../../global.state'

@Component({
  selector: 'frminputmasterbass',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./frmInputMasterBass.component.scss')],
  template: require('./frmInputMasterBass.component.html'),
})
export class frmInputMasterBass {
  HakAkses: any;
  appCode = "APPL00001";

  public params: any;
  listKota: SelectItem[] = [];
  public sKodeBass: any;
  data: Array<any> = [];
  selectedListKota: string;
  public zona: any;
  registerBass: FormGroup;
  nama_bass: AbstractControl;
  alamat_bass: AbstractControl;
  nomor_telepon: AbstractControl;
  kota: AbstractControl;
  contact_person: AbstractControl;
  email: AbstractControl;
  validationSukses: any;
  navigasi: any;
  judul: string;

  constructor(private frmInputMasterBassService: FrmInputMasterBassService, private formBuilder: FormBuilder,
    protected router: Router, public activatedRoute: ActivatedRoute, public global: GlobalState) {
    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

    this.sKodeBass = 'Auto Generated';

    if (this.HakAkses.HAK_AKSES) {
      this.frmInputMasterBassService.getKotaList().subscribe(
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

      this.registerBass = this.formBuilder.group({
        nama_bass: ['', Validators.compose([Validators.required])],
        alamat_bass: ['', Validators.compose([Validators.required])],
        nomor_telepon: ['', Validators.compose([Validators.required])],
        kota: ['', Validators.compose([Validators.required])],
        contact_person: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([Validators.required, EmailValidator.validate])]
      })

      this.nama_bass = this.registerBass.controls['nama_bass'];
      this.alamat_bass = this.registerBass.controls['alamat_bass'];
      this.nomor_telepon = this.registerBass.controls['nomor_telepon'];
      this.kota = this.registerBass.controls['kota'];
      this.contact_person = this.registerBass.controls['contact_person'];
      this.email = this.registerBass.controls['email'];

      //get kode bass
      let sub = this.activatedRoute.params.subscribe(params => {
        this.params = params;
        // In a real app: dispatch action to load the details here.
      });
    } else {
      alert('Anda tidak berhak mengakses halaman ini!');
      this.router.navigate(['/pages/home']);
    }

    if (this.params.status == "edit") {
      if (this.HakAkses.HAK_EDIT) {
        this.judul = "EDIT BASS"

        this.frmInputMasterBassService.getBassSingle(this.params.kode_bass).subscribe(
          data => {
            this.data = data.json();
            this.sKodeBass = this.data[0].KODE_BASS;
            this.registerBass = this.formBuilder.group({
              nama_bass: [this.data[0].NAMA_BASS, Validators.compose([Validators.required])],
              alamat_bass: [this.data[0].ALAMAT_BASS, Validators.compose([Validators.required])],
              nomor_telepon: [this.data[0].NOMOR_TELP, Validators.compose([Validators.required])],
              kota: [this.data[0].KOTA, Validators.compose([Validators.required])],
              contact_person: [this.data[0].CONTACT_PERSON, Validators.compose([Validators.required])],
              email: [this.data[0].EMAIL, Validators.compose([Validators.required, EmailValidator.validate])]
            })

            this.nama_bass = this.registerBass.controls['nama_bass'];
            this.alamat_bass = this.registerBass.controls['alamat_bass'];
            this.nomor_telepon = this.registerBass.controls['nomor_telepon'];
            this.kota = this.registerBass.controls['kota'];
            this.contact_person = this.registerBass.controls['contact_person'];
            this.email = this.registerBass.controls['email'];

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
        this.router.navigate(['/pages/master/basslist']);
      }
    } else {
      if (this.HakAkses.HAK_INSERT) {
        this.judul = "TAMBAH BASS"
      } else {
        alert('Anda tidak berhak mengakses halaman ini!');
        this.router.navigate(['/pages/master/basslist']);
      }

    }
  }

  save(values: Object): void {
    if (this.registerBass.valid) {
      if (this.params.status == "edit") {
        if (this.HakAkses.HAK_EDIT) {
          this.frmInputMasterBassService.editBass(values, this.sKodeBass).then(
            data => {
              if (data['status'] == "sukses") {
                this.validationSukses = "Bass berhasil di rubah"
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
          alert('Anda tidak berhak mengakses halaman ini!');
          this.router.navigate(['/pages/master/basslist']);
        }
      } else {
        if (this.HakAkses.HAK_INSERT) {
          this.frmInputMasterBassService.saveTambahBass(values).then(
            data => {
              if (data['status'] == "sukses") {
                this.validationSukses = "Bass berhasil di tambah. Kode Bass anda : " + data['kode_bass'] + "."
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
          alert('Anda tidak berhak mengakses halaman ini!');
          this.router.navigate(['/pages/master/basslist']);
        }
      }
    }

    //this.router.navigate(['/pages/master/masterbass']);
  }

  cancel() {
    this.router.navigate(['/pages/master/basslist']);
  }

  ZonaChanged(label) {
    this.zona = this.listKota.find(z => z.label == label)
    this.zona = this.zona.value;
  }

}