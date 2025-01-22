import { Routes, RouterModule } from '@angular/router';

import { Setting } from './setting.component';

import { GeneralSetting } from './components/generalsetting/generalsetting.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Setting,
    children: [
      { path: 'generalsetting', component: GeneralSetting }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
