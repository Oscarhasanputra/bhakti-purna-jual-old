import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalState } from '../../global.state'

@Component({
  selector: 'home',
  styleUrls: ['./home.scss'],
  templateUrl: './home.html'
})
export class Home {
  AksesExploded: boolean = true;
  constructor(protected router: Router, public global: GlobalState) {
  }

  ngOnInit() {
    //this.router.navigate(['/pages/home/servicelist']);
    if (this.global.Decrypt('mAuth').KODE_ROLE == "ROLE00011") {
      this.AksesExploded = false;
      this.router.navigate(['/pages/master/masterexplodedsparepart']);
    }
  }

}
