// Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

// Importa los módulos de Material aquí
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
import { TipoRutaComponent } from './home/mantenedores/tipo-ruta/tipo-ruta.component';
import { VehiculoComponent } from './home/mantenedores/vehiculo/vehiculo.component';
import { TransportistaComponent } from './home/mantenedores/transportista/transportista.component';
import { TipoTransporteComponent } from './home/mantenedores/tipo-transporte/tipo-transporte.component';
import { TipoTimComponent } from './home/mantenedores/tipo-tim/tipo-tim.component';
import { RutasComponent } from './home/rutas/rutas.component';
import { GuiasEnRutaComponent } from './home/rutas/guias-en-ruta/guias-en-ruta.component';
import { ModalRutasComponent } from './home/rutas/modal-rutas/modal-rutas.component';
import { ModalGuiasRutaComponent } from './home/rutas/modal-guias-ruta/modal-guias-ruta.component';


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
    ModalMantComponent,
    TipoRutaComponent,
    VehiculoComponent,
    TransportistaComponent,
    TipoTransporteComponent,
    TipoTimComponent,
    RutasComponent,
    GuiasEnRutaComponent,
    ModalRutasComponent,
    ModalGuiasRutaComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class DashboardModule { }
