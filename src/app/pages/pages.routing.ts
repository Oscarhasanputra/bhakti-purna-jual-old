import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

import { AuthGuard } from './login/auth-guard.service';

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login', loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'master', loadChildren: 'app/pages/master/master.module#MasterModule' },
      { path: 'dashboard', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule' },
      { path: 'home', loadChildren: 'app/pages/home/home.module#HomeModule' },
      { path: 'service', loadChildren: 'app/pages/services/services.module#ServicesModule' },
      { path: 'report', loadChildren: 'app/pages/report/report.module#ReportModule' },
      { path: 'part', loadChildren: 'app/pages/parts/parts.module#PartsModule' },
      { path: 'password', loadChildren: 'app/pages/password/password.module#PasswordModule' },
      { path: 'settings', loadChildren: 'app/pages/setting/setting.module#SettingModule' }
    ],
    canActivate: [AuthGuard]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);