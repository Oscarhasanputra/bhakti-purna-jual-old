import { Routes, RouterModule } from '@angular/router';

import { Master } from './master.component';
//centung
import { MasterZona } from './components/masterzona/masterzona.component';
import { MasterKota } from './components/masterkota/masterkota.component';
import { MasterKaryawan } from './components/masterkaryawan/masterkaryawan.component';
//kevin
import { masterBass } from './components/masterbass/masterbass.component';
import { masterCustomer } from './components/mastercustomer/mastercustomer.component';
import { masterTeknisi } from './components/masterteknisi/masterteknisi.component';
import { masterAplikasi } from './components/masteraplikasi/masteraplikasi.component';
import { masterRole } from './components/masterrole/masterrole.component';
import { masterTransportasi } from './components/mastertransportasi/mastertransportasi.component';
import { masterMappingCabangZona } from './components/mastermappingcabangzona/mastermappingcabangzona.component';
import { frmInputMasterBass } from './components/masterbass/components/frmInputMasterBass/frmInputMasterBass.component';
import { frmInputMasterCustomer } from './components/mastercustomer/components/frmInputMasterCustomer/frmInputMasterCustomer.component';
import { frmInputMasterTeknisi } from './components//masterteknisi/components/frmInputMasterTeknisi/frmInputMasterTeknisi.component';
import { frmInputMasterRole } from './components/masterrole/components/frmInputMasterRole/frmInputMasterRole.component';
import { frmInputMasterTransportasi } from './components/mastertransportasi/components/frmInputMasterTransportasi/frmInputMasterTransportasi.component';
import { frmInputMasterMappingCabang } from './components/mastermappingcabangzona/components/frmInputMasterMappingCabang/frmInputMasterMappingCabang.component';

import { MasterExplodedSparepart } from './components/masterexplodedsparepart/masterexplodedsparepart.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Master,
    children: [
      { path: 'zonalist', component: MasterZona },
      { path: 'kotalist', component: MasterKota },
      { path: 'karyawanlist', component: MasterKaryawan },
      { path: 'basslist', component: masterBass },
      { path: 'frmInputMasterBass', component: frmInputMasterBass },
      { path: 'frmInputMasterBass/:kode_bass/:status', component: frmInputMasterBass },
      { path: 'customerlist', component: masterCustomer },
      { path: 'frmInputMasterCustomer', component: frmInputMasterCustomer },
      { path: 'frmInputMasterCustomer/:kode_customer/:status', component: frmInputMasterCustomer },
      { path: 'teknisilist', component: masterTeknisi },
      { path: 'frmInputMasterTeknisi', component: frmInputMasterTeknisi },
      { path: 'frmInputMasterTeknisi/:kode_bass/:kode_teknisi/:status', component: frmInputMasterTeknisi },
      { path: 'applicationlist', component: masterAplikasi },
      { path: 'rolelist', component: masterRole },
      { path: 'frmInputMasterRole', component: frmInputMasterRole },
      { path: 'frmInputMasterRole/:kode_role/:status', component: frmInputMasterRole },
      { path: 'transportasilist', component: masterTransportasi },
      { path: 'frmInputMasterTransportasi', component: frmInputMasterTransportasi },
      { path: 'frmInputMasterTransportasi/:kode_transportasi/:status', component: frmInputMasterTransportasi },
      { path: 'cabangmappinglist', component: masterMappingCabangZona },
      { path: 'frmInputMasterMappingCabang', component: frmInputMasterMappingCabang },
      { path: 'masterexplodedsparepart', component: MasterExplodedSparepart }

      // { path: 'masterkota-detail', component: MasterkotaDetail}
    ]
  }
];

export const routing = RouterModule.forChild(routes);
