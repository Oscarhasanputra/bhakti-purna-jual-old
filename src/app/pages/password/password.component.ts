import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, Routes } from '@angular/router';
import { PasswordService } from './password.service';
import { GlobalState } from '../../global.state';

@Component({
  selector: 'password',
  styleUrls: ['./password.scss'],
  templateUrl: './password.html'
})
export class Password {
  public form: FormGroup;
  public username: AbstractControl;
  public oldpassword: AbstractControl;
  public password: AbstractControl;
  public repeatPassword: AbstractControl;
  public submitted: boolean = false;
  constructor(fb: FormBuilder, public service: PasswordService, public router: Router, public global: GlobalState) {
    this.form = fb.group({
      'username': [{ value: this.global.Decrypt('mAuth').USERNAME, disabled: true }, ''],
      'oldpassword': ['', Validators.compose([Validators.required])],
      'password': ['', Validators.compose([Validators.required])],
      'repeatPassword': ['', Validators.compose([Validators.required])]
    });

    this.username = this.form.controls['username'];
    this.oldpassword = this.form.controls['oldpassword'];
    this.password = this.form.controls['password'];
    this.repeatPassword = this.form.controls['repeatPassword'];
  }
  public onSubmit(values: any): void {
    if (this.form.valid) {
      console.log('value', values)
      if (values.repeatPassword == values.password) {
        this.service.changePassword(values)
          .then(data => {
            alert('Password Berhasil diganti \n Silahkan Login ulang');
            sessionStorage.clear();
            this.router.navigate(['/login']);
          },
          error => { alert('Password Gagal diganti') });
      } else {
        alert('Password dan Ulang Password tidak sama');
      }
    }
  }
}
