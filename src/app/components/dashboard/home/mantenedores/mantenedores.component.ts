import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalMantComponent } from './modal-mant/modal-mant.component';


export interface DialogMant {
  valueMant: string;
  viewValueMant: string;
}

@Component({
  selector: 'app-mantenedores',
  templateUrl: './mantenedores.component.html',
  styleUrls: ['./mantenedores.component.scss']
})
export class MantenedoresComponent {
  selectedMantenedor: any;

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar) {}

  openDialog(): void {
    if (!this.selectedMantenedor) {
      this._snackBar.open('Selecciona una opción.', '', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return; // No abrir el diálogo si no hay selección.
    }
    // Código existente para abrir el diálogo.
    const dialogRef = this.dialog.open(ModalMantComponent, {
      // width: '60%',
      // height: '80%',
      data: this.selectedMantenedor
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed', result);
    // }); POR SI HAY QUE ENVIAR ALGO EN UN FUTURO



  }

  mantenedores: DialogMant[] = [
    {valueMant: 'tienda-0', viewValueMant: 'Tienda'},
    {valueMant: 'sucursal-1', viewValueMant: 'Sucursal'},
    {valueMant: 'tipoRuta-2', viewValueMant: 'Tipo Ruta'},
  ];

}
