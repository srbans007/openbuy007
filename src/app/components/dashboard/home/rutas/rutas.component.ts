import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, CellClickedEvent, ICellRendererParams } from 'ag-grid-community';
import { AgGridService } from 'src/app/services/ag-grid.service'; 
import { Sucursal } from 'src/app/interfaces/sucursal';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
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
import { MatDialog } from '@angular/material/dialog';
import { ModalRutasComponent } from './modal-rutas/modal-rutas.component';
import { ModalGuiasRutaComponent } from './modal-guias-ruta/modal-guias-ruta.component';
import * as moment from 'moment';

export interface DialogMant {
  valueMant: string;
  viewValueMant: string;
}

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.scss']
})
export class RutasComponent {
  //dato modal
  selectedDato: any;
  //traemos los datos para la tabla
  chofer: Transportista[] = [];
  ayudante: Transportista[] = [];
  sucursales: Sucursal[] = [];
  patente: Vehiculo[] = [];
  tipoRuta: TipoRuta[] = [];
  tim: Tim[] = [];

  private gridColumnApi!: ColumnApi;
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: 'id', hide: true },
    {
      headerName: "Acciones",
      field: "actions",
      cellRenderer: (params: ICellRendererParams) => `
      <div class="btn-group" role="group">
        <button class='btn btn-lt btn-outline-warning botonAgregarGuia' data-toggle="tooltip" data-placement="top" title="Ingresar guías"><i class="fa fa-file-text-o fa-fw" aria-hidden="true"></i></button>
        <button class='btn btn-lt btn-outline-primary botonmodificarruta' data-toggle="tooltip" data-placement="top" title="Modificar ruta"><i class="fa fa-pencil fa-fw" aria-hidden="true"></i></button>
        <button class='btn btn-lt btn-outline-danger botonBorrarRuta' data-toggle="tooltip" data-placement="top" title="Borrar ruta"><i class="fa fa-trash-o fa-fw" aria-hidden="true"></i></button>
      </div>
      `,
      onCellClicked: (params: CellClickedEvent) => {
        if (params.event && params.event.target) {
          const targetElement = params.event.target as HTMLElement;

          // Busca el botón más cercano desde el ícono
          const closestButton = targetElement.closest('button');
          if (closestButton && closestButton.classList.contains('botonBorrarRuta')) {
              this.deleteRow(params.data);
          }
          if (closestButton && closestButton.classList.contains('botonmodificarruta')) {
            this.openEditModal(params.data);
          }
          if (closestButton && closestButton.classList.contains('botonAgregarGuia')) {
            this.openGuiaModal(params.data);
          }
        }
      },
      width: 190

    },
    { 
      field: 'createdAt', 
      headerName: 'Fecha Creación',
      sortable: true,
      sort: 'desc',
      valueFormatter: (params: { value: moment.MomentInput; }) => {
          const dateInSantiago = moment(params.value).tz("America/Santiago").format('DD-MM-YYYY HH:mm:ss');
          return dateInSantiago;
      },
      width: 190
      
    },
    {
      field: 'id_sucursal',
      headerName: 'Sucursal',
      valueGetter: (params: { data: { id_sucursal: number; }; }) => {
        const sucursal = this.sucursales.find(s => s.id === params.data.id_sucursal);
        return sucursal ? sucursal.nombre_sucursal : '';
      },
      width: 110
    },
    {
      field: 'id_chofer',
      headerName: 'Chofer',
      valueGetter: (params: { data: { id_chofer: number; }; }) => {
        const chofer = this.chofer.find(c => c.id === params.data.id_chofer);
        return chofer ? chofer.nombres + ' ' + chofer.apellidos : '';
      }
    },
    {
      field: 'id_ayudante',
      headerName: 'Ayudante',
      valueGetter: (params: { data: { id_ayudante: number; }; }) => {
        const ayudante = this.ayudante.find(a => a.id === params.data.id_ayudante);
        return ayudante ? ayudante.nombres + ' ' + ayudante.apellidos : '';
      }
    },
    {
      field: 'id_vehiculo',
      headerName: 'Patente',
      valueGetter: (params: { data: { id_vehiculo: number; }; }) => {
        const patenteVeh = this.patente.find(v => v.id === params.data.id_vehiculo);
        return patenteVeh ? patenteVeh.patente : '';
      },
      width: 110
    },
    {
      field: 'id_tipoRuta',
      headerName: 'Tipo Ruta',
      valueGetter: (params: { data: { id_tipoRuta: number; }; }) => {
        const tpRuta = this.tipoRuta.find(tR => tR.id === params.data.id_tipoRuta);
        return tpRuta ? tpRuta.nombre_ruta : '';
      },
      width: 120
    },
    {
      field: 'id_tim',
      headerName: 'Tipo Tim',
      valueGetter: (params: { data: { id_tim: number; }; }) => {
        const tpTim = this.tim.find(tM => tM.id === params.data.id_tim);
        return tpTim ? tpTim.nombreTim : '';
      },
      width: 110
    }

  ];

  public gridOptions = {
    rowHeight: 50,
    // otras opciones...
  };

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: false
  };

  public rowData$!: Ruta[];

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    private router: Router,
    private _RutaService: RutaService,
    private _SucursalService: SucursalService,
    private _TransportistaService: TransportistaService,
    private _VehiculoService: VehiculoService,
    private _TipoRutaService: TipoRutaService,
    private _TipoTimService: TipoTimService,
    private _agGridService: AgGridService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    //se reciben los datos para buscar los id
    this._SucursalService.getSucursal().subscribe(s => {
      this.sucursales = s;
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
      this.tipoRuta = tR;
    });

    this._TipoTimService.getTim().subscribe(tM => {
      this.tim = tM;
    });
    
    this.getRutas();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getRutas();
  }

  getRutas() {
    this._RutaService.getRuta().subscribe({
      next: data => {
        this.rowData$ = data;
      },
      error: error => {
        console.error('Ocurrió un error:', error);
        if (error.status === 400) {
          this.logOut();
        }
      },
      complete: () => {
        console.log('Data loading complete');
      }
    });
  }

  onAddRuta(): void {
    const dialogRef = this.dialog.open(ModalRutasComponent, {
      data: {}  // se pasa vacio, ya que es una adición y no una edición.
    });
    dialogRef.componentInstance.currentAction = 'add';
    dialogRef.componentInstance.onRutaAdded.subscribe(() => {
      this.getRutas();
    });
  }

  openEditModal(data: any): void {
    const dialogRef = this.dialog.open(ModalRutasComponent, {
        data: data
    });
    dialogRef.componentInstance.currentAction = 'edit';
    dialogRef.componentInstance.onRutaAdded.subscribe(() => {
        this.getRutas();
    });
  }

  openGuiaModal(dataGuia: any): void {
    const selectedSucursal = this.sucursales.find(s => s.id === dataGuia.id_sucursal);
    const selectedChofer = this.chofer.find(c => c.id === dataGuia.id_chofer);
    const selectedAyudante = this.ayudante.find(a => a.id === dataGuia.id_ayudante);
    const selectedPatente = this.patente.find(p => p.id === dataGuia.id_vehiculo);
    const selectedTipoRuta = this.tipoRuta.find(tR => tR.id === dataGuia.id_tipoRuta);
    const selectedTim = this.tim.find(tM => tM.id === dataGuia.id_tim);

    const dialogRef = this.dialog.open(ModalGuiasRutaComponent, {
      data: {
        dataGuia: dataGuia,
        selectedSucursal: selectedSucursal,
        selectedChofer: selectedChofer,
        selectedAyudante: selectedAyudante,
        selectedPatente: selectedPatente,
        selectedTipoRuta: selectedTipoRuta,
        selectedTim: selectedTim
      }
    });
  }

  deleteRow(data: any) {
    const dataToSend = [{ id: data.id }];

    let snackBarRef = this._snackBar.open('¿Está seguro de que desea eliminar este registro?', 'Eliminar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    snackBarRef.onAction().subscribe(() => {
      this._RutaService.destroyRuta(dataToSend).subscribe({
        next: (deletedData) => {
          console.log('Registro eliminado:', deletedData);
          this._snackBar.open('Registro eliminado', '', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.getRutas();
        },
        error: (error) => {
          console.error('Ocurrió un error al eliminar:', error);
        }
      });
    });
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }

  setFilter(searchText: string) {
    this._agGridService.quickSearch(this.agGrid, searchText);
  }



  
}
