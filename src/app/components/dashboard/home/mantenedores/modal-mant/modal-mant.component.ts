import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogMant } from '../mantenedores.component';

@Component({
  selector: 'app-modal-mant',
  templateUrl: './modal-mant.component.html',
  styleUrls: ['./modal-mant.component.scss']
})
export class ModalMantComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalMantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogMant
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
