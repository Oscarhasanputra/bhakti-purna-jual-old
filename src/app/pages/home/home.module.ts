import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { CalendarModule, DataTableModule, SharedModule, DialogModule, TabViewModule } from 'primeng/primeng';
import { BusyModule } from 'angular2-busy';
import { Ng2BootstrapModule } from "ng2-bootstrap";
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { Home } from './home.component';
import { routing }       from './home.routing';
import { serviceList } from './components/servicelist/servicelist.component'
import { partOrder } from './components/partorder/partorder.component'
import { partOrderExpired } from './components/partorderexpired/partorderexpired.component'
import { barangDalamPerjalanan } from './components/barangdalamperjalanan/barangdalamperjalanan.component'
import { browseListBass } from './components/lookuphome/browseListBass/browseListBass.component'
import { browseCustomerList } from './components/lookuphome/browseCustomerList/browsecustomerlist.component'


import { BrowseListBassService } from './components/lookuphome/browseListBass/browseListBass.service'
import { ServiceListService } from './components/servicelist/servicelist.service'
import { BrowseCustomerListService } from './components/lookuphome/browseCustomerList/browsecustomerlist.service'
import { PartOrderService } from './components/partorder/partorder.service'
import { PartOrderExpiredService } from './components/partorderexpired/partorderexpired.service'
import { BarangDalamperJalananService } from './components/barangdalamperjalanan/barangdalamperjalanan.service'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    CalendarModule,
    DataTableModule,
    DialogModule,
    BusyModule,
    Ng2BootstrapModule,
    Ng2SmartTableModule,
    TabViewModule
  ],
  declarations: [
    Home,
    serviceList,
    partOrder,
    partOrderExpired,
    barangDalamPerjalanan,
    browseListBass,
    browseCustomerList
  ],
  providers: [
    BrowseListBassService,
    ServiceListService,
    BrowseCustomerListService,
    PartOrderService,
    PartOrderExpiredService,
    BarangDalamperJalananService
   ]
})
export class HomeModule {}
