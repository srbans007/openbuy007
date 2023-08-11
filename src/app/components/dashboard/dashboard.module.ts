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
import { SucursalesComponent } from './home/mantenedores/sucursales/sucursales.component';
import { TiendasComponent } from './home/mantenedores/tiendas/tiendas.component';
import { MantenedoresComponent } from './home/mantenedores/mantenedores.component';
import { ModalMantComponent } from './home/mantenedores/modal-mant/modal-mant.component';


@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    CargaDatosComponent,
    NavbarComponent,
    TodoCargaComponent,
    SeguimientoComponent,
    SucursalesComponent,
    TiendasComponent,
    MantenedoresComponent,
    ModalMantComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
