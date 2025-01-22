import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { Setting } from './setting.component';
import { routing } from './setting.routing';

//General Setting
import { GeneralSetting } from './components/generalsetting/generalsetting.component';
import { GeneralSettingService } from './components/generalsetting/generalsetting.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    ReactiveFormsModule
  ],
  declarations: [
    Setting,
    GeneralSetting
  ],
  providers: [
    GeneralSettingService
  ]
})
export class SettingModule { }
