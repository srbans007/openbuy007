// Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

// Component Imports
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './home/home.component';
import { CargaDatosComponent } from './home/carga-datos/carga-datos.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TodoCargaComponent } from './home/todo-carga/todo-carga.component';
import { SeguimientoComponent } from './home/seguimiento/seguimiento.component';


@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    CargaDatosComponent,
    NavbarComponent,
    TodoCargaComponent,
    SeguimientoComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
