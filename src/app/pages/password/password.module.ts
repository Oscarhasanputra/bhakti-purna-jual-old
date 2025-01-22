import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { Password } from './password.component';
import { routing } from './password.routing';

import { PasswordService } from './password.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing
  ],
  declarations: [
    Password
  ],
  providers: [
    PasswordService
  ]
})
export class PasswordModule { }
