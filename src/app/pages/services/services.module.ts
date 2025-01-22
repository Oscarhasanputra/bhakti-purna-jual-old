import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Debounce } from 'angular2-debounce';

import { routing } from './services.routing';
import { Services } from './services.component';

import { DataTableModule, DialogModule, CalendarModule, InputTextareaModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { BusyModule } from 'angular2-busy';
// import { ReviewClaimServicesModule } from './components/reviewclaimservices/reviewclaimservices.module'

//Service Request
import { ServiceRequestComponent } from './components/servicerequest/servicerequest.component';
import { ServiceRequestService } from './components/servicerequest/servicerequest.service';

//Service List
import { ServiceListComponent } from './components/servicerequest/components/servicelist';
import { ServiceListService } from './components/servicerequest/components/servicelist/servicelist.service';

//Customer List
import { CustomerListComponent } from './components/servicerequest/components/customerlist';
import { CustomerListService } from './components/servicerequest/components/customerlist/customerlist.service';

//Barang List
import { BarangListComponent } from './components/servicerequest/components/baranglist';
import { BarangListService } from './components/servicerequest/components/baranglist/baranglist.service';

// master
import { frmInputMasterCustomer } from "./components/servicerequest/components/frmInputMasterCustomer";
import { FrmInputMasterCustomerService } from "./components/servicerequest/components/frmInputMasterCustomer/frmInputMasterCustomer.service";

import { TeknisiListComponent } from './components/finishingservicerequest/components/teknisilist';
import { TeknisiListService } from './components/finishingservicerequest/components/teknisilist/teknisilist.service';

// finishing service requeset
import { FinishingServiceRequestComponent } from './components/finishingservicerequest/finishingservicerequest.component';
import { FinishingServiceRequestService } from './components/finishingservicerequest/finishingservicerequest.service';

// finishing service request all
import { FinishingServiceRequestAllComponent } from './components/finishingservicerequestall/finishingservicerequestall.component';
import { FinishingServiceRequestAllService } from './components/finishingservicerequestall/finishingservicerequestall.service';

// part list
import { PartListComponent } from './components/finishingservicerequest/components/partlist';
import { PartlistService } from './components/finishingservicerequest/components/partlist/partlist.service';

// faktur list
import { FakturListComponent } from './components/finishingservicerequest/components/fakturlist';
import { FakturListService } from './components/finishingservicerequest/components/fakturlist/fakturlist.service';

//ClaimService
import { ClaimService } from './components/claimservice/claimservice.component';
import { ClaimServiceService } from './components/claimservice/claimservice.service';

//ClaimList
import { ClaimList } from './components/claimlist/claimlist.component';
import { ClaimListService } from './components/claimlist/claimlist.service';
import { EditClaim } from './components/claimlist/components/editclaim/editclaim.component';
import { EditClaimService } from './components/claimlist/components/editclaim/editclaim.service';

//ReviewClaim
import { ReviewClaimServices } from './components/reviewclaimservices/reviewclaimservices.component';
import { ReviewClaimServicesService } from './components/reviewclaimservices/reviewclaimservices.service';
import { ReviewClaim } from './components/reviewclaimservices/components/reviewclaim/reviewclaim.component';
import { ReviewClaimService } from './components/reviewclaimservices/components/reviewclaim/reviewclaim.service';
import { LookUpBassReviewClaim } from './components/reviewclaimservices/components/lookupbass-reviewclaim/lookupbassreviewclaim.component';
import { LookUpBassReviewClaimService } from './components/reviewclaimservices/components/lookupbass-reviewclaim/lookupbassreviewclaim.service';

//PaidClaim
import { PaidClaimServices } from './components/paidclaimservices/paidclaimservices.component';
import { PaidClaimServicesService } from './components/paidclaimservices/paidclaimservices.service';
import { LookUpBassPaidClaim } from './components/paidclaimservices/components/lookupbass-paidclaim/lookupbasspaidclaim.component';
import { LookUpBassPaidClaimService } from './components/paidclaimservices/components/lookupbass-paidclaim/lookupbasspaidclaim.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    DataTableModule,
    DialogModule,
    CalendarModule,
    ConfirmDialogModule,
    ButtonModule,
    BusyModule,
    InputTextareaModule,
    ReactiveFormsModule
  ],
  declarations: [
    Services,
    ClaimService,
    ClaimList,
    EditClaim,
    ReviewClaimServices,
    ReviewClaim,
    PaidClaimServices,
    LookUpBassPaidClaim,
    LookUpBassReviewClaim,
    ServiceRequestComponent,
    Debounce,
    frmInputMasterCustomer,
    ServiceListComponent,
    CustomerListComponent,
    BarangListComponent,
    FinishingServiceRequestComponent,
    TeknisiListComponent,
    PartListComponent,
    FinishingServiceRequestAllComponent,
    FakturListComponent
  ],
  providers: [
    ConfirmationService,
    ClaimServiceService,
    ClaimListService,
    EditClaimService,
    ReviewClaimServicesService,
    ReviewClaimService,
    PaidClaimServicesService,
    LookUpBassPaidClaimService,
    LookUpBassReviewClaimService,
    ServiceRequestService,
    FrmInputMasterCustomerService,
    ServiceListService,
    CustomerListService,
    BarangListService,
    FinishingServiceRequestService,
    TeknisiListService,
    PartlistService,
    FinishingServiceRequestAllService,
    FakturListService
  ]
})
export class ServicesModule {
}
