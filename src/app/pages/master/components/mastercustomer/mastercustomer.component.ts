import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { SelectItem, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';
import { Router } from '@angular/router';
import { MasterCustomerService } from './mastercustomer.service';
import { GlobalState } from '../../../../global.state'

@Component({
  selector: 'mastercustomer',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./mastercustomer.component.scss')],
  template: require('./mastercustomer.component.html'),
})
export class masterCustomer {
  HakAkses: any;
  appCode = "APPL00002";

  sStorage: any;
  status: Array<any>;
  selectedStatus: string;
  listZona: SelectItem[] = [];
  data: Array<any> = [];
  selectedListZona: string;
  nama_customer: any;
  public source: customerList[];
  private busyloadevent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);
  selectedCust: Array<any>;
  listKodeCust: Array<any>;

  constructor(private masterCustomerService: MasterCustomerService, protected router: Router,
    private confirmationService: ConfirmationService, public global: GlobalState) {
    this.sStorage = this.global.Decrypt('mAuth');
    this.HakAkses = this.global.Decrypt('mRole').filter(data => data.KODE_APPLICATION == this.appCode)[0];

    this.listKodeCust = [];
    this.selectedCust = [];

    this.status = [];
    this.status.push({ label: 'All', value: "" });
    this.status.push({ label: 'Active', value: "A" });
    this.status.push({ label: 'Inactive', value: "I" });

    this.nama_customer = '';

    this.busyloadevent.template = '<div style="margin-top: 10px; text-align: center; font-size: 25px; font-weight: 700;"><i class="fa fa-spinner fa-spin" style="font-size:34px"></i>{{message}}</div>'

    this.selectedStatus = this.status[0].value;

    if (this.HakAkses.HAK_AKSES) {
      this.masterCustomerService.getZonaList(this.sStorage.KODE_BASS).subscribe(
        data => {
          this.data = data.json();
          for (var i = 0; i < this.data.length; i++) {
            this.listZona.push({ label: this.data[i].NAMA_ZONA, value: this.data[i].ZONA });
          }

          this.selectedListZona = this.listZona[0].value;
          this.loadData()
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

  loadData() {
    this.busyloadevent.busy = this.masterCustomerService.getListMasterCustomer(this.sStorage.KODE_BASS, this.selectedListZona, this.nama_customer).then(
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

  tambahCustomer() {
    this.router.navigate(['/pages/master/frmInputMasterCustomer']);
  }

  edit(kode_customer) {
    this.router.navigate(['/pages/master/frmInputMasterCustomer', kode_customer, 'edit']);
  }

  delete(kode_customer) {
    if (this.HakAkses.HAK_DELETE) {
      this.confirmationService.confirm({
        message: 'Anda yakin ingin menghapus customer ' + kode_customer + '?',
        accept: () => {
          //Actual logic to perform a confirmation
          this.masterCustomerService.deleteCustomer(kode_customer).then(
            data => {
              alert('Customer ' + kode_customer + ' berhasil di hapus');
              this.loadData();
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
    } else {
      alert("Anda tidak berhak menghapus data!")
    }
  }

  massDeleteCustomer() {
    if (this.HakAkses.HAK_DELETE) {
      this.listKodeCust = [];

      for (let i = 0; i < this.selectedCust.length; i++) {
        this.listKodeCust.push({ kode_customer: this.selectedCust[i].KODE_CUSTOMER });
      }

      this.confirmationService.confirm({
        message: 'Anda yakin ingin menghapus semua Customer ini?',
        accept: () => {
          //Actual logic to perform a confirmation
          this.masterCustomerService.massDeleteCustomer(this.listKodeCust).then(
            data => {
              this.selectedCust = [];
              alert('Customer berhasil di hapus');
              this.loadData();
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
    } else {
      alert("Anda tidak berhak menghapus data!")
    }
  }
}

export interface customerList {
  KODE_CUSTOMER;
  NAMA_CUSTOMER;
  KODE_ZONA;
  NAMA_ZONA;
}