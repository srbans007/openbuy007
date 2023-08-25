import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard.component";
import {HomeComponent} from "./home/home.component";
import { CargaDatosComponent } from './home/carga-datos/carga-datos.component';
import { TodoCargaComponent } from './home/todo-carga/todo-carga.component';

//validar login
import { AuthGuard } from 'src/app/utils/auth.guard';

import { MantenedoresComponent } from './home/mantenedores/mantenedores.component';
import { RutasComponent } from './home/rutas/rutas.component';
import { SeguimientoComponent } from './home/seguimiento/seguimiento.component';
import { GuiasProcesadasComponent } from './home/guias-procesadas/guias-procesadas.component';


const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      {path: '', component: HomeComponent},
      {path: 'carga-datos', component: CargaDatosComponent},
      {path: 'todo-carga', component: TodoCargaComponent},
      {path: 'mantenedores', component: MantenedoresComponent},
      {path: 'ruta', component: RutasComponent},
      {path: 'seguimiento', component: SeguimientoComponent},
      {path: 'guias-procesadas', component: GuiasProcesadasComponent}

    ], canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
