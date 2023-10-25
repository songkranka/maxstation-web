import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class NavigatorBarService {

  currentRoute : string;
  constructor(private router: Router) 
  { 
    this.currentRoute=this.router.url;   
  }

  getCurrentRoute() {
    return this.currentRoute; 
  }
  setCurrentRoute(path) {
    this.currentRoute=path;   
  }
}
