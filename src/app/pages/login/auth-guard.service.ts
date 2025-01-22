import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate() {
        // If user is not logged in we'll send them to the homepage 
        if (sessionStorage.getItem('mAuth')) {
            return true;
        } else {
            this.router.navigate(['/login']);
            sessionStorage.clear();
            return false;
        }
    }
}