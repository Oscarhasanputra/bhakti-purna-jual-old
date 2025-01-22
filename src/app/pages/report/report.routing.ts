import { Routes, RouterModule } from '@angular/router';

import { Report } from './report.component';
import { reportClaim } from './components/reportclaim/reportclaim.component';
import { reportServiceList } from './components/reportservicelist/reportservicelist.component';
import { reportFinishingService } from './components/reportfinishingservice/reportfinishingservice.component';
import { rejectedServiceReport } from './components/rejectedservicereport/rejectedservicereport.component';
import { reportPartOrder } from './components/reportpartorder/reportpartorder.component';
import { reportPartReceivings } from './components/reportpartreceiving/reportpartreceiving.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Report,
    children: [
      { path: 'reportsclaim', component: reportClaim },
      { path: 'reportsservicerequest', component: reportServiceList },
      { path: 'reportsfinishingservice', component: reportFinishingService },
      { path: 'reportsrejectedservice', component: rejectedServiceReport },
      { path: 'reportspartorder', component: reportPartOrder },
      { path: 'reportspartreceiving', component: reportPartReceivings }
    ]
  }
];

export const routing = RouterModule.forChild(routes);