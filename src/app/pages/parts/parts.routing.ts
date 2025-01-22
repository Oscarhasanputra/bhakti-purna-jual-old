import { Routes, RouterModule }  from '@angular/router';

import { Parts } from './parts.component';
import { PartOrder } from './components/partorder/partorder.component';
import { PartReceiving } from './components/partreceiving/partreceiving.component';
import { MaintainPartOrder } from './components/maintainpartorder/maintainpartorder.component';
import { ListFaktur } from './components/listfaktur/listfaktur.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Parts,
    children: [
      // { path: 'partorder', loadChildren: 'app/pages/parts/components/partorder/partorder.module#PartOrderModule'  },
      // { path: 'partreceiving', loadChildren: 'app/pages/parts/components/partreceiving/partreceiving.module#PartReceivingModule'  }
      { path: 'partorder', component: PartOrder },
      { path: 'partorder/:id', component: PartOrder },
      { path: 'partreceiving', component: PartReceiving },
      { path: 'partorderlist', component: MaintainPartOrder},
      { path: 'invoicelist', component: ListFaktur}
      // { path: 'listsparepart/:id', component: ListSparepart}
      // { path: 'smarttables', component: SmartTables }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
