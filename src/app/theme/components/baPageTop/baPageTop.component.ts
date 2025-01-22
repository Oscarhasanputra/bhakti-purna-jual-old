import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalState } from '../../../global.state';

import 'style-loader!./baPageTop.scss';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
})
export class BaPageTop {

  public isScrolled: boolean = false;
  public isMenuCollapsed: boolean = false;
  public username: String;
  public nama_bass: String;

  constructor(private _state: GlobalState, private _router: Router) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    if (sessionStorage.getItem('mAuth') && sessionStorage.getItem('mBass')) {
      this.username = this._state.Decrypt('mAuth').USERNAME;
      this.nama_bass = this._state.Decrypt('mBass').NAMA_BASS;
    } else {
      this.logOut();
    }
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  public logOut() {
    this._router.navigate(['/login']);
    sessionStorage.clear();
  }
}
