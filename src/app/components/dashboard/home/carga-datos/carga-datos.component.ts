import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { TodoCargaService } from '../../../../services/todo-carga.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { SeguimientoService } from 'src/app/services/seguimiento.service';

@Component({
  selector: 'app-carga-datos',
  templateUrl: './carga-datos.component.html',
  styleUrls: ['./carga-datos.component.scss']
})
export class CargaDatosComponent {
  fileName = '';
  fileData: any;

  constructor(
    private _TodoCargaService: TodoCargaService,
    private _SeguimientoService: SeguimientoService,
    private _snackBar: MatSnackBar
  ) { }

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
  
        // Agregar 1 a la columna 'marcaPgd' de cada objeto en 'this.fileData'
        for (let i = 0; i < this.fileData.length; i++) {
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
  
        let datosSeguimiento = {
          "id": data.id,
          "boleta": data.boleta,
          "guia": data.guia, 
          "lpn": data.lpn,
          "marcaPgd": data.marcaPgd
        };

        //console.log(datosSeguimiento)
        console.log("datosqls",data)

        this._SeguimientoService.insertSeguimiento(datosSeguimiento).subscribe({
          next: (data) => {
            console.log('Seguimiento data uploaded successfully', data);
          },
          error: (error) => {
            console.error('Something went wrong with seguimiento data', error);
          }
        });
  
        console.log('TodoCarga data uploaded successfully', data);
      },
      error: (error) => {
        this._snackBar.open('ERROR.', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
  
        console.error('Something went wrong with TodoCarga data', error);
      },
      complete: () => {
        this.fileName = '';
        this.fileData = null;
  
        console.log('TodoCarga data upload completed');
      },
    });
  }
  
}
