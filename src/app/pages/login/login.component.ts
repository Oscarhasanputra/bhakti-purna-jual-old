import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, Routes } from '@angular/router';
import { BUSY_CONFIG_DEFAULTS, IBusyConfig } from 'angular2-busy';

import { LoginService } from './login.service';
import { GlobalState } from '../../global.state';

import { PAGES_MENU } from '../pages.menu';

import 'style-loader!./login.scss';

@Component({
  selector: 'login',
  templateUrl: './login.html',
})
export class Login {
  busyLoaderEvent: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);
  public form: FormGroup;
  public kode_bass: AbstractControl;
  public username: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;
  public errorMsg: String;

  constructor(private _state: GlobalState, fb: FormBuilder, public loginService: LoginService, public router: Router) {
    this.busyLoaderEvent.template = `<div style="margin-top:500px; margin-left:600px; position: fixed; z-index:1000; text-align:center; font-size: 24px; ">
                                      <i class="fa fa-spinner fa-spin" style="font-size:36px;"></i>
                                      {{message}}
                                      </div>`;

    this.form = fb.group({
      'kode_bass': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.kode_bass = this.form.controls['kode_bass'];
    this.username = this.form.controls['username'];
    this.password = this.form.controls['password'];

    sessionStorage.clear();
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      this.busyLoaderEvent.minDuration = 10000
      this.busyLoaderEvent.busy = this.loginService.login(values)
        .then(
        data => {
          this.setSessionUser(JSON.parse(data._body).mAuth[0][0][0])
          this.setSessionBass(JSON.parse(data._body).mBass[0][0][0])
          this.setSessionRole(JSON.parse(data._body).mRole[0][0])
          this.setSessionParameter(JSON.parse(data._body).mParameter[0][0][0])

          this._state.notifyDataChanged('user.isLoggedIn', true);
          this.router.navigate(['pages/home']);
        },
        error => {
          this.errorMsg = JSON.parse(error._body).data;
        });
    }
  }

  private setSessionUser(data: any) {
    // save to session storage
    try {
      // let auth = {
      //   Kode_Bass: data.KODE_BASS,
      //   Kode_Karyawan: data.USERNAME,
      //   Role: data.KODE_ROLE,
      //   Type: data.TYPE === 'C' ? 'Cabang' : 'Bass',
      //   Token: data.TOKEN
      // }​​​​​​​;
      // console.log('user',data.mAuth)
      // sessionStorage.setItem('mAuth', data.mAuth);
      sessionStorage.setItem('mAuth', JSON.stringify(data.mAuth));
    } catch (error) {
      console.log(error)
    }
  }

  private setSessionBass(data: any) {
    // save to session storage
    try {
      // let bass = {
      //   Nama_Bass: data.NAMA_BASS,
      //   Alamat_Bass: data.ALAMAT_BASS,
      //   No_Telp: data.NO_TELP,
      //   Kota: data.KOTA,
      //   Contact_Person: data.CONTACT_PERSON,
      //   Email: data.EMAIL
      // }​​​​​​​;
      sessionStorage.setItem('mBass', JSON.stringify(data.mBass));
    } catch (error) {
      console.log(error)
    }
  }

  private setSessionRole(data: any) {
    // save to session storage
    try {
      // let role = [];
      // data.forEach(element => {
      //   role.push({
      //     App_Code: element.KODE_APPLICATION,
      //     Akses: element.HAK_AKSES,
      //     Insert: element.HAK_INSERT,
      //     Edit: element.HAK_EDIT,
      //     Delete: element.HAK_DELETE
      //   })
      // });
      sessionStorage.setItem('mRole', JSON.stringify(data.mRole));
    } catch (error) {
      console.log(error)
    }
  }

  private setSessionParameter(data: any) {
    // save to session storage
    try {
      // let param = {
      //   Web_Title: data.WEB_TITLE,
      //   Report_Server_Path: data.REPORT_SERVER_PATH,
      //   Expired_PO_Date: data.EXPIRED_PO_DATE,
      //   Bass_Pusat: data.BASS_PUSAT,
      //   Email_SMTP: data.EMAIL_SMTP,
      //   Email_Port: data.EMAIL_PORT,
      //   Email_Username: data.EMAIL_USERNAME,
      //   Email_Password: data.EMAIL_PASSWORD
      // }​​​​​​​;
      sessionStorage.setItem('mParameter', JSON.stringify(data.mParameter));
    } catch (error) {
      console.log(error)
    }
  }
}
