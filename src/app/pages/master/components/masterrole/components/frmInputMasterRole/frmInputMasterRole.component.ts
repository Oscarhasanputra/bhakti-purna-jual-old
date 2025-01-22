import { Component, ViewChild, ViewEncapsulation, Output, EventEmitter, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { ModalDirective } from 'ng2-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { EmailValidator } from '../../../../../../theme/validators';

import { FrmInputMasterRoleService } from './frmInputMasterRole.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { GlobalState } from '../../../../../../global.state';

@Component({
  selector: 'frminputmasterrole',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./frmInputMasterRole.component.scss')],
  template: require('./frmInputMasterRole.component.html'),
})
export class frmInputMasterRole {

  public sKodeRole: any;
  sStorage: any;
  source: roleDetailList[];
  private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);
  marked = false;
  selectedRows: Array<any> = [];
  nama_role: any;
  support_center: boolean;
  validationSukses: any;
  navigasi: any;
  params: any;
  roleHeader: any;

  constructor(private frmInputMasterRoleService: FrmInputMasterRoleService, protected router: Router,
    public activatedRoute: ActivatedRoute, public global: GlobalState) {
    this.sKodeRole = 'Auto Generated';
    this.sStorage = sessionStorage.getItem('mAuth');
    this.sStorage = JSON.parse(this.sStorage);
    this.support_center = false

    //get kode role
    let sub = this.activatedRoute.params.subscribe(params => {
      this.params = params;
      // In a real app: dispatch action to load the details here.
    });

    if (this.params.status == "edit") {
      this.busyloadevent.busy = this.frmInputMasterRoleService.getRoleHeader(this.params.kode_role).then(
        data => {
          this.roleHeader = data;
          this.nama_role = this.roleHeader[0].NAMA_ROLE;
          this.sKodeRole = this.roleHeader[0].KODE_ROLE;
          this.support_center = this.roleHeader[0].IS_SUPPORT_CENTER == 0 ? false : true
          // if (this.roleHeader[0].IS_SUPPORT_CENTER == 0) {
          //   this.support_center = false;
          // } else {
          //   this.support_center = true;
          // }
        },
        err => {
          if (err._body == 'You are not authorized' || err.status == 500) {
            alert("Your Token has expired, please login again !")
            sessionStorage.clear();
            this.router.navigate(['/login']);
          }
        }
      );

      this.busyloadevent.busy = this.frmInputMasterRoleService.getListRoleDetail(this.params.kode_role).then(
        data => {
          this.source = data;
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
      let kode_role = '%%';
      this.busyloadevent.busy = this.frmInputMasterRoleService.getListRoleDetail(kode_role).then(
        data => {
          this.source = data;
        },
        err => {
          if (err._body == 'You are not authorized' || err.status == 500) {
            alert("Your Token has expired, please login again !")
            sessionStorage.clear();
            this.router.navigate(['/login']);
          }
        }
      );
    }

  }

  // save(){
  //   let rows = this.selectedRows.map(function(row) {
  //   let obj = {};

  //   for(let key in row) {
  //           if(key !== 'checked') {
  //               obj[key] = row[key];
  //           }
  //       }

  //       return obj;
  //   });

  //   let payload = {
  //       "nama_role": this.nama_role,
  //       "details": rows
  //   };

  //   console.log(payload);
  // }


  save() {
    // var chk = "0"
    if (this.params.status == "edit") {
      // console.log(this.support_center)
      // if (this.support_center == true) {
      // chk = "1"
      // }

      let payload = {
        "kode_role": this.sKodeRole,
        "nama_role": this.nama_role,
        "support_center": this.support_center,
        "details": this.source
      };

      this.frmInputMasterRoleService.updateRole(payload).then(
        data => {
          if (data['status'] == "sukses") {
            this.validationSukses = "Role berhasil di rubah! "
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
      let payload = {
        "nama_role": this.nama_role,
        "support_center": this.support_center,
        "inputted_by": this.global.Decrypt('mAuth').USERNAME,
        "inputted_by_bass": this.global.Decrypt('mAuth').USERNAME,
        "details": this.source
      };

      this.frmInputMasterRoleService.saveTambahRole(payload).then(
        data => {
          if (data['status'] == "sukses") {
            this.validationSukses = "Role berhasil di tambah. Kode Role anda : " + data['kode_role'] + "."
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

  toggle(index, val, key) {
    this.source[index][key] = val ? 1 : 0;
  }

  toggleHeader(val, key) {
    console.log(val)
    this.support_center = val ? true : false;
  }


  selectRow(row, index) {
    if (row.checked) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows.splice(index, 1);
    }
  }

  cancel() {
    this.router.navigate(['/pages/master/rolelist']);
  }

}


export interface roleDetailList {
  KODE_APLIKASI;
  NAMA_APLIKASI;
  HAK_AKSES;
  HAK_INSERT;
  HAK_EDIT;
  HAK_DELETE;
}