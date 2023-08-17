import { Component, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
import { DialogMant, RutasComponent } from '../rutas.component';
import { TipoTransporte } from 'src/app/interfaces/tipoTransporte';

@Component({
  selector: 'app-modal-rutas',
  templateUrl: './modal-rutas.component.html',
  styleUrls: ['./modal-rutas.component.scss']
})
export class ModalRutasComponent {
  public onRutaAdded: EventEmitter<void> = new EventEmitter<void>();
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

  constructor(
    public dialogRef: MatDialogRef<ModalRutasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogMant,
    private _SucursalService: SucursalService,
    private _TransportistaService: TransportistaService,
    private _VehiculoService: VehiculoService,
    private _TipoRutaService: TipoRutaService,
    private _TipoTimService: TipoTimService,
    private _RutaService: RutaService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    forkJoin({
      sucursal: this._SucursalService.getSucursal(),
      transportista: this._TransportistaService.getTransportista(),
      vehiculo: this._VehiculoService.getVehiculo(),
      tipoRuta: this._TipoRutaService.getTipoRuta(),
      tim: this._TipoTimService.getTim()
    }).subscribe(res => {
      this.sucursal = res.sucursal;
      this.chofer = res.transportista;
      this.ayudante = res.transportista;
      this.patente = res.vehiculo;
      this.nombreRuta = res.tipoRuta;
      this.tim = res.tim;

      this.setupFilters();
    });
  }

  setupFilters(): void {
    this.setupSucursalFilter();
    this.setupChoferFilter();
    this.setupAyudanteFilter();
    this.setupPatenteFilter();
    this.setupTipoRutaFilter();
    this.setupTimFilter();
  }
  // Filtro para Sucursal
  setupSucursalFilter(): void {
    this.filteredSucursales = this.sucursalControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.displaySucursal(value)),
      map(name => name ? this.filterSucursal(name) : this.sucursal.slice())
    );
  }

  filterSucursal(name: string): Sucursal[] {
    const filterValue = name.toLowerCase();
    return this.sucursal.filter(s => s.nombre_sucursal.toLowerCase().includes(filterValue));
  }

  displaySucursal(sucursal: Sucursal): string {
    return sucursal ? sucursal.nombre_sucursal : '';
  }

  // Filtro para Chofer
  setupChoferFilter(): void {
    this.filteredChofer = this.choferControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.displayChofer(value)),
      map(name => name ? this.filterChofer(name) : this.chofer.slice())
    );
  }

  filterChofer(name: string): Transportista[] {
    const filterValue = name.toLowerCase();
    return this.chofer.filter(ch => (ch.nombres + ' ' + ch.apellidos).toLowerCase().includes(filterValue));
  }

  displayChofer(chofer: Transportista): string {
    return chofer ? chofer.nombres + ' ' + chofer.apellidos : '';
  }

  // Filtro para Ayudante
  setupAyudanteFilter(): void {
    this.filteredAyudante = this.ayudanteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.displayAyudante(value)),
      map(name => name ? this.filterAyudante(name) : this.ayudante.slice())
    );
  }

  filterAyudante(name: string): Transportista[] {
    const filterValue = name.toLowerCase();
    return this.ayudante.filter(ay => (ay.nombres + ' ' + ay.apellidos).toLowerCase().includes(filterValue));
  }

  displayAyudante(ayudante: Transportista): string {
    return ayudante ? ayudante.nombres + ' ' + ayudante.apellidos : '';
  }

  // Filtro para Patente
  setupPatenteFilter(): void {
    this.filteredVehiculo = this.patenteControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.displayPatente(value)),
      map(name => name ? this.filterPatente(name) : this.patente.slice())
    );
  }

  filterPatente(name: string): Vehiculo[] {
    const filterValue = name.toLowerCase();
    return this.patente.filter(pt => pt.patente.toLowerCase().includes(filterValue));
  }

  displayPatente(patente: Vehiculo): string {
    return patente ? patente.patente : '';
  }

  // Filtro para Tipo Ruta
  setupTipoRutaFilter(): void {
    this.filteredTipoRuta = this.tipoRutaControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.displayTipoRuta(value)),
      map(name => name ? this.filterTipoRuta(name) : this.nombreRuta.slice())
    );
  }

  filterTipoRuta(name: string): TipoRuta[] {
    const filterValue = name.toLowerCase();
    return this.nombreRuta.filter(tr => tr.nombre_ruta.toLowerCase().includes(filterValue));
  }

  displayTipoRuta(tipoRuta: TipoRuta): string {
    return tipoRuta ? tipoRuta.nombre_ruta : '';
  }

  // Filtro para Tim
  setupTimFilter(): void {
    this.filteredTim = this.timControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.displayTim(value)),
      map(name => name ? this.filterTim(name) : this.tim.slice())
    );
  }

  filterTim(name: string): Tim[] {
    const filterValue = name.toLowerCase();
    return this.tim.filter(t => t.nombreTim.toLowerCase().includes(filterValue));
  }

  displayTim(tim: Tim): string {
    return tim ? tim.nombreTim : '';
  }

  onAddClick(): void {
    const preparedRuta = this.getRutaArray(); // Obtiene el objeto de ruta preparado
    
    this._RutaService.insertRuta(preparedRuta).subscribe({
      
      next: (ruta) => {
        
        console.log('Ruta agregada:', ruta);
        this._snackBar.open('Ruta Agregada', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        // Si el backend responde con una ruta, la agregas al array de rutas
        if (Array.isArray(ruta)) {
          this.newRuta.push(...ruta);

        } else {
          this.newRuta.push(ruta);
        }
        this.onRutaAdded.emit();
      },
      error: (error) => {
        console.error('Ocurrió un error:', error);
        // Maneja el error según tus necesidades (e.g., muestra una notificación al usuario)
      },
      complete: () => {
        console.log('Operación de inserción completa.');
      }
    });
  }
  
  getRutaArray(): any[] {
    let rutaObject = {
      "id_sucursal": this.sucursalControl.value.id,
      "id_chofer": this.choferControl.value.id,
      "id_ayudante": this.ayudanteControl.value.id,
      "id_vehiculo": this.patenteControl.value.id,
      "id_tipoRuta": this.tipoRutaControl.value.id,
      "id_tim": this.timControl.value.id
    };

    return [rutaObject];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}