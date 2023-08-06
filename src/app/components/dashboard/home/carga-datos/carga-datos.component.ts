import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { TodoCargaService } from '../../../../services/todo-carga.service';
import { MatSnackBar } from "@angular/material/snack-bar";

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
        const wsname: string = wb.SheetNames[0]
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.fileData = XLSX.utils.sheet_to_json(ws);
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
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        console.log('Data uploaded successfully', data);
      },
      error: (error) => {
        this._snackBar.open('ERROR.', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });

        console.error('Something went wrong ', error);
      },
      complete: () => {

        this.fileName = '';
        this.fileData = null;

        console.log('Data upload completed');
      },
    });
  }
}
