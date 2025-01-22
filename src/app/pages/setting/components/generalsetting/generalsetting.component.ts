import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, Routes } from '@angular/router';
import { GeneralSettingService } from './generalsetting.service';

@Component({
  selector: 'generalsetting',
  styleUrls: ['./generalsetting.scss'],
  templateUrl: './generalsetting.html'
})
export class GeneralSetting implements OnInit {
  public form: FormGroup;
  public submitted: boolean = false;
  // public errorMsg: String;

  public web_title: AbstractControl;
  public report_server_path: AbstractControl;
  public expired_po_date: AbstractControl;
  public bass_pusat: AbstractControl;
  public email_port: AbstractControl;
  public email_smtp: AbstractControl;
  public email_username: AbstractControl;
  public email_password: AbstractControl;
  public email_service: AbstractControl;

  constructor(fb: FormBuilder, public service: GeneralSettingService, public router: Router) {
    // console.log('tes')
    this.form = fb.group({
      'web_title': ['', Validators.compose([Validators.required])],
      'report_server_path': ['', Validators.compose([Validators.required])],
      'expired_po_date': ['', Validators.compose([Validators.required])],
      'bass_pusat': ['', Validators.compose([Validators.required])],
      'email_port': ['', Validators.compose([Validators.required])],
      'email_smtp': ['', Validators.compose([Validators.required])],
      'email_username': ['', Validators.compose([Validators.required])],
      'email_password': ['', Validators.compose([Validators.required])],
      'email_service': ['', Validators.compose([Validators.required])]
    });

    this.web_title = this.form.controls['web_title'];
    this.report_server_path = this.form.controls['report_server_path'];
    this.expired_po_date = this.form.controls['expired_po_date'];
    this.bass_pusat = this.form.controls['bass_pusat'];
    this.email_port = this.form.controls['email_port'];
    this.email_smtp = this.form.controls['email_smtp'];
    this.email_username = this.form.controls['email_username'];
    this.email_password = this.form.controls['email_password'];
    this.email_service = this.form.controls['email_service'];
  }

  ngOnInit() {
    //set value
    this.service.getSystemParameter().then(
      data => {
        // console.log(data[0].BASS_PUSAT);
        this.form.controls['web_title'].setValue(data[0].WEB_TITLE);
        this.form.controls['report_server_path'].setValue(data[0].REPORT_SERVER_PATH);
        this.form.controls['expired_po_date'].setValue(data[0].EXPIRED_PO_DATE);
        this.form.controls['bass_pusat'].setValue(data[0].BASS_PUSAT);
        this.form.controls['email_port'].setValue(data[0].EMAIL_PORT);
        this.form.controls['email_smtp'].setValue(data[0].EMAIL_SMTP);
        this.form.controls['email_username'].setValue(data[0].EMAIL_USERNAME);
        this.form.controls['email_password'].setValue(data[0].EMAIL_PASSWORD);
        this.form.controls['email_service'].setValue(data[0].EMAIL_SERVICE);
      },
      err => {
        if (err._body.data.indexOf("TokenExpiredError") == 1 && err.status == 500) {
          alert("Your Token has expired, please login again !")
          sessionStorage.clear();
          this.router.navigate(['/login']);
        } else {
          alert(err._body.data);
        }
      });
  }

  public onSubmit(values: any): void {
    if (this.form.valid) {
      this.service.saveSetting(values)
        .then(data => {
          alert('Setting berhasil diupdate');
        },
        error => { alert('Setting gagal diupdate') });
    }
  }

}
