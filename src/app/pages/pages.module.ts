import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusyModule } from 'angular2-busy';

import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';

import { Pages } from './pages.component';
import { AuthGuard } from './login/auth-guard.service';
import { PagesService } from './pages.service';

@NgModule({
  imports: [CommonModule, NgaModule, routing, BusyModule],
  declarations: [Pages],
  providers: [
    AuthGuard,
    PagesService
  ]
})
export class PagesModule {
}
