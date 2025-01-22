import { Routes, RouterModule } from '@angular/router';

import { Password } from './password.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Password,
    children: [

    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
