import { Routes, RouterModule } from '@angular/router';

import { Services } from './services.component';

import { ClaimService } from './components/claimservice/claimservice.component';
import { ClaimList } from './components/claimlist/claimlist.component';
import { ReviewClaimServices } from './components/reviewclaimservices/reviewclaimservices.component';
import { PaidClaimServices } from './components/paidclaimservices/paidclaimservices.component';

import { ServiceRequestComponent } from './components/servicerequest/servicerequest.component';
import { FinishingServiceRequestComponent } from './components/finishingservicerequest/finishingservicerequest.component';
import { FinishingServiceRequestAllComponent } from './components/finishingservicerequestall/finishingservicerequestall.component';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Services,
    children: [
      { path: 'claimservice', component: ClaimService },
      { path: 'claimlist', component: ClaimList },
      { path: 'reviewclaimservices', component: ReviewClaimServices },
      { path: 'paidclaimservices', component: PaidClaimServices },
      { path: 'servicerequest', component: ServiceRequestComponent },
      { path: 'finishingservicerequest', component: FinishingServiceRequestComponent },
      { path: 'finishingservicerequestall', component: FinishingServiceRequestAllComponent },
      { path: 'finishingservicerequest/:no_service', component: FinishingServiceRequestComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
