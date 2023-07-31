import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {SidenavService} from "../../services/sidenav.service";
import {Menu} from "../../interfaces/menu";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{
  @ViewChild('sidenav') public sidenav!: MatSidenav;

  menuItems: Menu[] = [
    {path: '', title: 'Home', icon: 'home'},
    {path: 'carga-datos', title: 'Carga de datos', icon: 'cloud_upload'},
    {path: 'todo-carga', title: 'TODO CARGA', icon: 'cloud_upload'}
  ];

  constructor(
    private _sidenavService: SidenavService
) {
}

opened: boolean = false;

ngAfterViewInit(): void {
  this._sidenavService.sidenavOpen$.subscribe(open => {
    setTimeout(() => {
      if (!open) {
        this.sidenav.open();
        this.opened = true;
      } else {
        this.sidenav.close();
        this.opened = false;
      }
    });
  });
}
}
