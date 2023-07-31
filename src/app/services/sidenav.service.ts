import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  constructor() { }

  private sidenavOpenSource = new BehaviorSubject(false);
  public sidenavOpen$ = this.sidenavOpenSource.asObservable();

  toggleSidenav(status?: boolean) {
    this.sidenavOpenSource.next(status !== undefined ? status : !this.sidenavOpenSource.value);
  }
}
