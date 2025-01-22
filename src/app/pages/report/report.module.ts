import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing } from './report.routing';

import { CalendarModule, DataTableModule, SharedModule, DialogModule } from 'primeng/primeng';

import { BusyModule } from 'angular2-busy';

import { Ng2BootstrapModule } from "ng2-bootstrap";

import { Report } from './report.component';
import { reportClaim } from './components/reportclaim/reportclaim.component';
import { reportServiceList } from './components/reportservicelist/reportservicelist.component';
import { reportFinishingService } from './components/reportfinishingservice/reportfinishingservice.component';
import { rejectedServiceReport } from './components/rejectedservicereport/rejectedservicereport.component';
import { reportPartOrder } from './components/reportpartorder/reportpartorder.component';
import { reportPartReceivings } from './components/reportpartreceiving/reportpartreceiving.component';
import { browseListBassReport } from './components/lookupreport/browseListBassReport/browseListBassReport.component'

import { ClaimReportService } from './components/reportclaim/reportclaim.service';
import { ReportServiceListService } from './components/reportservicelist/reportservicelist.service';
import { ReportFinishingServiceService } from './components/reportfinishingservice/reportfinishingservice.service';
import { RejectedServiceReportService } from './components/rejectedservicereport/rejectedservicereport.service';
import { ReportPartOrderService } from './components/reportpartorder/reportpartorder.service';
import { ReportPartReceivingService } from './components/reportpartreceiving/reportpartreceiving.service';
import { BrowseListBassReportService } from './components/lookupreport/browseListBassReport/browseListBassReport.service'




@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    routing,
    CalendarModule,
    BusyModule,
    DialogModule,
    Ng2BootstrapModule,
    DataTableModule,
    SharedModule
  ],
  declarations: [
    Report,
    reportClaim,
    reportServiceList,
    reportFinishingService,
    rejectedServiceReport,
    reportPartOrder,
    reportPartReceivings,
    browseListBassReport
  ],
  providers: [
    ClaimReportService,
    ReportServiceListService,
    ReportFinishingServiceService,
    RejectedServiceReportService,
    ReportPartOrderService,
    ReportPartReceivingService,
    BrowseListBassReportService
  ]
})
export class ReportModule {
}
