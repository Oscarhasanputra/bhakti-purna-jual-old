import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { SelectItem, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { Router } from '@angular/router';
import { MasterRoleService } from './masterrole.service';
import { GlobalState } from '../../../../global.state';

@Component({
  selector: 'masterrole',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./masterrole.component.scss')],
  template: require('./masterrole.component.html'),
})
export class masterRole {

  data: Array<any> = [];
  sStorage: any;
  kode_role: any;
  login_type: any;
  login_role: any;
  showPilihKodeBass: boolean = false;
  public source: roleList[];
  private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

  constructor(private masterRoleService: MasterRoleService, protected router: Router, private confirmationService: ConfirmationService,
    public global: GlobalState) {
    this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 25px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:34px"></i>{{message}}</div>'

    this.kode_role = '';

    this.sStorage = this.global.Decrypt('mAuth');

    this.loadData()
  }

  loadData() {
    this.busyloadevent.busy = this.masterRoleService.getListMasterRole(this.kode_role).then(
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

  tambahRole() {
    this.router.navigate(['/pages/master/frmInputMasterRole']);
  }

  edit(kode_role) {
    this.router.navigate(['/pages/master/frmInputMasterRole', kode_role, 'edit']);
  }

  delete(kode_role) {
    this.confirmationService.confirm({
      message: 'Anda yakin ingin menghapus role ' + kode_role + ' ?',
      accept: () => {
        //Actual logic to perform a confirmation
        this.busyloadevent.busy = this.masterRoleService.deleteRole(kode_role).then(
          data => {
            this.loadData();
            alert('Role ' + kode_role + ' berhasil di hapus');
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
    });
  }
}

export interface roleList {
  KODE_ROLE;
  NAMA_ROLE;
  IS_SUPPORT_CENTER;
}