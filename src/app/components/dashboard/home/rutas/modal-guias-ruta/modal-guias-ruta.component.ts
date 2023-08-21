import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ICellRendererParams, CellClickedEvent, ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { GuiaRuta } from 'src/app/interfaces/guiaRuta';
import { Ruta } from 'src/app/interfaces/ruta';
import { Sucursal } from 'src/app/interfaces/sucursal';
import { Tim } from 'src/app/interfaces/tim';
import { TipoRuta } from 'src/app/interfaces/tipoRuta';
import { TipoTransporte } from 'src/app/interfaces/tipoTransporte';
import { Todo_carga } from 'src/app/interfaces/todo-carga';
import { Transportista } from 'src/app/interfaces/transportista';
import { Vehiculo } from 'src/app/interfaces/vehiculo';
import { AgGridService } from 'src/app/services/ag-grid.service';
import { GuiaRutaService } from 'src/app/services/guia-ruta.service';
import { TodoCargaService } from 'src/app/services/todo-carga.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-modal-guias-ruta',
  templateUrl: './modal-guias-ruta.component.html',
  styleUrls: ['./modal-guias-ruta.component.scss']
})

export class ModalGuiasRutaComponent {
  // Propiedades
  guiaInputValue: string = '';
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

  private gridColumnApi!: ColumnApi;
  private gridApi!: GridApi;
  public rowData$!: GuiaRuta[];
  buscarGuia: Todo_carga[] = [];
  guiaRuta: GuiaRuta[] = [];
  newGuiaRuta: GuiaRuta[] = [];


  columnDefs = [
    { field: 'id', hide: true },
    { field: 'id_ruta', hide: true },
    { field: 'guia.guia', headerName: 'Guía' },
    { field: 'guia.boleta', headerName: 'Boleta' },
    { field: 'guia.lpn', headerName: 'LPN' },
    { field: 'guia.createdAt', headerName: 'Fecha Creación' },
    {
      headerName: "Acciones",
      field: "actions",
      cellRenderer: (params: ICellRendererParams) => '<button class="btn btn-danger btn-sm">Eliminar</button>',
      onCellClicked: (params: CellClickedEvent) => this.deleteRow(params.data),
      width: 150,
      filter: false,
      sortable: false
    }
  ];
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };
  // Referencias
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('filterInput') filterInput!: ElementRef;
  @ViewChild('inputGuia') inputGuia!: ElementRef;

  // Constructor e inicialización

  constructor(
    private router: Router,
    private _agGridService: AgGridService,
    public dialogRef: MatDialogRef<ModalGuiasRutaComponent>,
    private _GuiaRutaService: GuiaRutaService,
    private _TodoCargaService: TodoCargaService,
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

    if (this.data.dataGuia.id !== undefined) {
      this._GuiaRutaService.getGuiaRutaId(this.data.dataGuia.id).subscribe(g => {
        this.newGuiaRuta = g;
      });
    } else {
      console.error("id no está definido");
    }

    console.log('guia', this.newGuiaRuta);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getGuiasId();
    this._agGridService.autoSizeAll(this.gridColumnApi, false);
  }

  getGuiasId() {
    if (this.data.dataGuia.id !== undefined) {
      this._TodoCargaService.getDatosGuiaRutaPorRutaId(this.data.dataGuia.id).subscribe({
        next: data => {
          this.rowData$ = data;
          console.log("Data received", data);
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
  }



  onBuscarGuia() {
    this._TodoCargaService.getBuscarGuia(this.guiaInputValue)
      .subscribe({
        next: (data: Todo_carga[]) => {
          const dataRuta = this.data.dataGuia.id;

          // Usar map para iterar sobre cada registro y construir el objeto deseado
          const resultArray = data.map(item => {
            return {
              "id_ruta": dataRuta,
              "id_guia": item.id
            };
          });

          // Insertar cada registro de resultArray

          this.newGuiaRuta = resultArray;
          this.onAddClick();


          this.guiaInputValue = '';
        },
        error: (err) => {
          console.error('Error al buscar guía:', err);
        },
        complete: () => {
          console.log('Búsqueda completada.');
        }
      });
  }



  onAddClick() {
    this._GuiaRutaService.insertGuiaRuta(this.newGuiaRuta).subscribe({
      next: (guiaRutas) => {
        console.log('Guias agregadas:', guiaRutas);
        this._snackBar.open('Guias Agregadas', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.guiaRuta.push(...guiaRutas); // Añade todos los registros retornados al array guiaRuta
        this.getGuiasId();
        if (this.inputGuia && this.inputGuia.nativeElement) {
          this.inputGuia.nativeElement.focus();
        }
      },
      error: (error) => {
        console.error('Ocurrió un error:', error);
      },
      complete: () => {
        console.log('Operación de inserción completa.');
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
      // Si el usuario hace clic en 'Eliminar', procede a eliminar el registro
      this._GuiaRutaService.destroyGuiaRuta(dataToSend).subscribe({
        next: (deletedData) => {
          console.log('Registro eliminado:', deletedData);
          this._snackBar.open('Registro eliminado', '', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          // Refrescar la tabla
          this.getGuiasId();
        },
        error: (error) => {
          console.error('Ocurrió un error al eliminar:', error);
        }
      });
    });
  }

  //si no hay token o hay manoseo de token pa juerah
  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }

  setFilter(searchText: string) {
    this._agGridService.quickSearch(this.agGrid, searchText);
  }

  onExportClick() {
    // Obtener las filas filtradas y transformadas
    const transformedRows: any[] = [];
    this.gridApi.forEachNodeAfterFilter((node) => {
      transformedRows.push(this.transformRowForExport(node.data));
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(transformedRows);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Guardar archivo
    XLSX.writeFile(wb, 'guiaRuta.xlsx');
  }

  transformRowForExport(row: any): any {
    return {
      'Tienda': row.guia.tienda.nombre_tienda,
      'Guía': row.guia.guia,
      'Boleta': row.guia.boleta,
      'LPN': row.guia.lpn,
      'Fecha Creación': row.guia.createdAt
      // ... (y así para cualquier otro campo que quieras exportar)
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
