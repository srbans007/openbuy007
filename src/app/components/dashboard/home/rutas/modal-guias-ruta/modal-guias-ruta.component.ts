import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Ruta } from 'src/app/interfaces/ruta';
import { Sucursal } from 'src/app/interfaces/sucursal';
import { Tim } from 'src/app/interfaces/tim';
import { TipoRuta } from 'src/app/interfaces/tipoRuta';
import { TipoTransporte } from 'src/app/interfaces/tipoTransporte';
import { Transportista } from 'src/app/interfaces/transportista';
import { Vehiculo } from 'src/app/interfaces/vehiculo';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-modal-guias-ruta',
  templateUrl: './modal-guias-ruta.component.html',
  styleUrls: ['./modal-guias-ruta.component.scss']
})
export class ModalGuiasRutaComponent {
  sucursalControl = new FormControl();
  choferControl = new FormControl();
  ayudanteControl = new FormControl();
  patenteControl = new FormControl();
  tipoRutaControl = new FormControl();
  timControl = new FormControl();

  filteredSucursales!: Observable<Sucursal[]>;
  filteredChofer!: Observable<Transportista[]>;
  filteredAyudante!: Observable<Transportista[]>;
  filteredVehiculo!: Observable<Vehiculo[]>;
  filteredTipoRuta!: Observable<TipoRuta[]>;
  filteredTim!: Observable<Tim[]>;

  sucursal: Sucursal[] = [];
  tipoTransporte: TipoTransporte[] = [];
  chofer: Transportista[] = [];
  ayudante: Transportista[] = [];
  patente: Vehiculo[] = [];
  nombreRuta: TipoRuta[] = [];
  tim: Tim[] = [];
  newRuta: Ruta[] = [{}];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  constructor(
    public dialogRef: MatDialogRef<ModalGuiasRutaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      dataGuia: Ruta,
      selectedSucursal: Sucursal,
      selectedChofer: Transportista,
      selectedAyudante: Transportista,
      selectedPatente: Vehiculo,
      selectedTipoRuta: TipoRuta,
      selectedTim: Tim
    },
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.sucursal = [this.data.selectedSucursal];
    this.chofer = [this.data.selectedChofer];
    this.ayudante = [this.data.selectedAyudante];
    this.patente = [this.data.selectedPatente];
    this.nombreRuta = [this.data.selectedTipoRuta];
    this.tim = [this.data.selectedTim];
  }
}
