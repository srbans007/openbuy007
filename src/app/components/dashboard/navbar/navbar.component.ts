import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavService } from 'src/app/services/sidenav.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private _sidenavService: SidenavService
    ) { }

  ngOnInit(): void {
  }

  //userName: string;
  userName = 'Usuario';

  toggleSidenav() {
    this._sidenavService.toggleSidenav();
  }

  profile() {
    // perfil
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }
}
