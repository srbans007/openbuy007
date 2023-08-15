import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgFor, AsyncPipe } from '@angular/common';
import { Sucursal } from 'src/app/interfaces/sucursal';
import { Transportista } from 'src/app/interfaces/transportista';
import { Vehiculo } from 'src/app/interfaces/vehiculo';
import { TipoRuta } from 'src/app/interfaces/tipoRuta';
import { Tim } from 'src/app/interfaces/tim';
import { Ruta } from 'src/app/interfaces/ruta';
import { RutaService } from 'src/app/services/ruta.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { TransportistaService } from 'src/app/services/transportista.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { TipoRutaService } from 'src/app/services/tipo-ruta.service';
import { TipoTimService } from 'src/app/services/tipo-tim.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogMant } from '../rutas.component';
import { TipoTransporte } from 'src/app/interfaces/tipoTransporte';

@Component({
  selector: 'app-modal-rutas',
  templateUrl: './modal-rutas.component.html',
  styleUrls: ['./modal-rutas.component.scss']
})
export class ModalRutasComponent {
  sucursalControl = new FormControl();
  choferControl = new FormControl();
  ayudanteControl = new FormControl();
  patenteControl = new FormControl();
  tipoRutaControl = new FormControl();
  timControl = new FormControl();
  filteredSucursales!: Observable<Sucursal[]>;
  filteredTransportista!: Observable<Transportista[]>;
  filteredVehiculo!: Observable<Vehiculo[]>;
  filteredTipoRuta!: Observable<TipoRuta[]>;
  filteredTim!: Observable<Tim[]>;

  // Propiedades
  sucursal: Sucursal[] = [];
  tipoTransporte: TipoTransporte[] = [];
  chofer: Transportista[] = [];
  ayudante: Transportista[] = [];
  patente: Vehiculo[] = [];
  nombreRuta: TipoRuta[] = [];
  tim: Tim[] = [];
  newRuta: Ruta[] = [{

  }];

  constructor(
    public dialogRef: MatDialogRef<ModalRutasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogMant,
    private _SucursalService: SucursalService,
    private _TransportistaService: TransportistaService,
    private _VehiculoService: VehiculoService,
    private _TipoRutaService: TipoRutaService,
    private _TipoTimService: TipoTimService
  ) { }

  ngOnInit(): void {
    //se reciben los datos para buscar los id
    this._SucursalService.getSucursal().subscribe(s => {
      this.sucursal = s;
    });

    this._TransportistaService.getTransportista().subscribe(s => {
      this.chofer = s;
    });

    this._TransportistaService.getTransportista().subscribe(s => {
      this.ayudante = s;
    });

    this._VehiculoService.getVehiculo().subscribe(p => {
      this.patente = p;
    });

    this._TipoRutaService.getTipoRuta().subscribe(tR => {
      this.nombreRuta = tR;
    });

    this._TipoTimService.getTim().subscribe(tM => {
      this.tim = tM;
    });

    // Configuración para el filtrado de sucursales
    this.filteredSucursales = this.sucursalControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nombre_sucursal),
        map(name => name ? this._filterSucursal(name) : this.sucursal.slice())
      );

    this.filteredTransportista = this.choferControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nombres + ' ' + value.apellidos),
        map(name => name ? this._filterChofer(name) : this.chofer.slice())
      );

    this.filteredTransportista = this.ayudanteControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nombres + ' ' + value.apellidos),
        map(name => name ? this._filterAyudante(name) : this.ayudante.slice())
      );

    this.filteredVehiculo = this.patenteControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.patente),
        map(name => name ? this._filterPatente(name) : this.patente.slice())
      );

    this.filteredTipoRuta = this.tipoRutaControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nombreRuta),
        map(name => name ? this._filterTipoRuta(name) : this.nombreRuta.slice())
      );
  }

  // Método para filtrar sucursales
  private _filterSucursal(name: string): Sucursal[] {
    const filterValue = name.toLowerCase();
    return this.sucursal.filter(sucursal => sucursal.nombre_sucursal.toLowerCase().includes(filterValue));
  }

  private _filterChofer(name: string): Transportista[] {
    const filterValue = name.toLowerCase();
    return this.chofer.filter(transportista =>
      (transportista.nombres.toLowerCase() + ' ' + transportista.apellidos.toLowerCase()).includes(filterValue)
    );
  }

  private _filterAyudante(name: string): Transportista[] {
    const filterValue = name.toLowerCase();
    return this.ayudante.filter(transportista =>
      (transportista.nombres.toLowerCase() + ' ' + transportista.apellidos.toLowerCase()).includes(filterValue)
    );
  }

  private _filterPatente(name: string): Vehiculo[] {
    const filterValue = name.toLowerCase();
    return this.patente.filter(vehiculo => vehiculo.patente.toLowerCase().includes(filterValue));
  }

  private _filterTipoRuta(name: string): TipoRuta[] {
    const filterValue = name.toLowerCase();
    return this.nombreRuta.filter(nombreRuta => nombreRuta.nombre_ruta.toLowerCase().includes(filterValue));
  }

  // Método para mostrar el nombre de la sucursal en el input
  displaySucursalFn(sucursal: Sucursal): string {
    return sucursal?.nombre_sucursal || '';
  }

  displayTransportistaCFn(transportista: Transportista): string {
    return transportista ? transportista.nombres + ' ' + transportista.apellidos : '';
  }

  displayTransportistaAFn(transportista: Transportista): string {
    return transportista ? transportista.nombres + ' ' + transportista.apellidos : '';
  }

  displayPatenteFn(patente: Vehiculo): string {
    return patente?.patente || '';
  }

  displayTipoRutaFn(nombreRuta: TipoRuta): string {
    return nombreRuta?.nombre_ruta || '';
  }


  onAddClick() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
