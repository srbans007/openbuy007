import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatSnackBar } from "@angular/material/snack-bar";
import { TodoCargaService } from '../../../../services/todo-carga.service';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { TiendaService } from 'src/app/services/tienda.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { Tienda } from 'src/app/interfaces/tienda';
import { Sucursal } from 'src/app/interfaces/sucursal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carga-datos',
  templateUrl: './carga-datos.component.html',
  styleUrls: ['./carga-datos.component.scss']
})
export class CargaDatosComponent {
  fileName = '';
  fileData: any;

  //usar interfaces para encontrar datos de tienda y sucursal
  tiendas: Tienda[] = [];
  sucursales: Sucursal[] = [];

  constructor(
    private router: Router,
    private _TodoCargaService: TodoCargaService,
    private _SeguimientoService: SeguimientoService,
    private _TiendaService: TiendaService,
    private _SucursalService: SucursalService,
    private _snackBar: MatSnackBar,

  ) { }

  ngOnInit() {
    this._TiendaService.getTienda().subscribe({
      next: (t) => {
        this.tiendas = t;
      },
      error: (error) => {
        console.error('Ocurrió un error al obtener tiendas:', error);
        if (error.status === 400) {
          this.logOut();
        }
      },
      complete: () => {
        console.log('Data loading for tiendas complete');
      }
    });

    this._SucursalService.getSucursal().subscribe({
      next: (s) => {
        this.sucursales = s;
      },
      error: (error) => {
        console.error('Ocurrió un error al obtener sucursales:', error);
        if (error.status === 400) {
          this.logOut();
        }
      },
      complete: () => {
        console.log('Data loading for sucursales complete');
      }
    });
  }


  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }


  private serialDateToISO(serialDate: number): string {
    // La fecha de inicio para Excel es típicamente 1900-01-01, pero debido a un error en Excel
    // el 1900 es considerado como un año bisiesto, así que debemos ajustar si es antes del 1900-03-01.
    const startDate = new Date(1900, 0, 1);
    if (serialDate > 59) {
        serialDate--;
    }

    // Calcula la fecha final sumando los días del número de serie a la fecha de inicio.
    const resultDate = new Date(startDate.getTime() + (serialDate - 1) * 24 * 60 * 60 * 1000);
    return resultDate.toISOString().split('T')[0];  // Devuelve la fecha en formato YYYY-MM-DD
}

  onFileSelected(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files && target.files.length > 0) {
      this.fileName = target.files[0].name;
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.fileData = XLSX.utils.sheet_to_json(ws);

        for (let i = 0; i < this.fileData.length; i++) {
          let tienda = this.tiendas.find(t => t.nombre_tienda === this.fileData[i].id_tienda);
          let sucursal = this.sucursales.find(s => s.nombre_sucursal === this.fileData[i].id_sucursal);

          if (tienda) {
            this.fileData[i].id_tienda = tienda.id;
          }

          if (sucursal) {
            this.fileData[i].id_sucursal = sucursal.id;
          }

          // Transforma las fechas si existen
          if (this.fileData[i].hasOwnProperty('fecha_carga')) {
            this.fileData[i].fecha_carga = this.serialDateToISO(this.fileData[i].fecha_carga);
            console.log('fecha', this.fileData)
          }
          if (this.fileData[i].hasOwnProperty('fecha_compromiso')) {
              this.fileData[i].fecha_compromiso = this.serialDateToISO(this.fileData[i].fecha_compromiso);
          }

          // Agregar 1 a la columna 'marcaPgd' de cada objeto en 'this.fileData'
          if (this.fileData[i].hasOwnProperty('marcaPgd')) {
            this.fileData[i].marcaPgd += 1;
          } else {
            // si no existe la propiedad 'marcaPgd', la creamos y le asignamos el valor 1
            this.fileData[i].marcaPgd = 1;
          }
        }
      };

      reader.readAsBinaryString(target.files[0]);
    }
  }


  onUpload() {
    this._TodoCargaService.insertTodoCarga(this.fileData).subscribe({

      next: (data) => {
        this._snackBar.open('Datos Insertados.', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });

        let datosSeguimiento = data.map(
          (item: {
            id: number;
            marcaPgd: number;
          }
          ) => {
            return {
              "id_guia": item.id,
              "marcaPgd": item.marcaPgd
            };
          });

        this._SeguimientoService.insertSeguimiento(datosSeguimiento).subscribe({
          next: (data) => {
            console.log('Seguimiento cargado', data);
          },
          error: (error) => {
            console.error('Error seguimiento', error);
          }
        });

        console.log('TodoCarga cargado', data);
      },
      error: (error) => {
        this._snackBar.open('ERROR.', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });

        console.error('Error TodoCarga', error);
      },
      complete: () => {
        this.fileName = '';
        this.fileData = null;

        console.log('TodoCarga completo');
      },
    });
  }

}
