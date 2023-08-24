import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi } from 'ag-grid-community';
import { AgGridService } from 'src/app/services/ag-grid.service'; // Asegúrate de que la ruta es correcta
import { TiendaService } from 'src/app/services/tienda.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import * as XLSX from 'xlsx';
import { Seguimiento } from 'src/app/interfaces/seguimiento';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import * as moment from 'moment';
import { TodoCargaService } from 'src/app/services/todo-carga.service';


@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.scss']
})
export class SeguimientoComponent {
  //private gridApi!: AgGridModule;
  private gridColumnApi!: ColumnApi;
  private gridApi!: GridApi;



  columnDefs = [
    // Ocultar IDs si no son necesarios en la vista
    { field: 'id_guia', hide: true },
    { field: 'id_ruta', hide: true },
    { field: 'ruta.id_chofer', hide: true },
    { field: 'ruta.id_ayudante', hide: true },

    // Mostrar datos relevantes
    { field: 'guia.tienda.nombre_tienda', headerName: 'Tienda' },
    { field: 'guia.guia', headerName: 'Guia' },
    { field: 'guia.boleta', headerName: 'Boleta' },
    { field: 'guia.lpn', headerName: 'LPN' },
    { field: 'guia.producto', headerName: 'Producto' },
    { 
      headerName: 'Chofer',
      valueGetter: (params: any) => {
        if (params.data.ruta && params.data.ruta.chofer && params.data.ruta.chofer.tipoTransporte.transporte === 'Chofer') {
          return `${params.data.ruta.chofer.nombres || ''} ${params.data.ruta.chofer.apellidos || ''}`;
        }
        return '';  // Retorna una cadena vacía si no hay datos de chofer o si no es de tipo 'Chofer'
      }
    },
    { 
      headerName: 'Ayudante',
      valueGetter: (params: any) => {
        if (params.data.ruta && params.data.ruta.ayudante && params.data.ruta.ayudante.tipoTransporte.transporte === 'Ayudante') {
          return `${params.data.ruta.ayudante.nombres || ''} ${params.data.ruta.ayudante.apellidos || ''}`;
        }
        return '';  // Retorna una cadena vacía si no hay datos de ayudante o si no es de tipo 'Ayudante'
      }
    },
    { field: 'guia.marcaPgd', headerName: 'Estado' },
    { 
      field: 'createdAt', 
      headerName: 'Fecha Creación',
      valueFormatter: (params: { value: moment.MomentInput; }) => {
          const dateInSantiago = moment(params.value).tz("America/Santiago").format('DD-MM-YYYY HH:mm:ss');
          return dateInSantiago;
      }
    }
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  public rowData$!: Seguimiento[];

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    private router: Router,
    private _TodoCargaService: TodoCargaService,
    private _agGridService: AgGridService,
    private _TiendaService: TiendaService,
    private _SucursalService: SucursalService
  ) { }

  ngOnInit(): void {


  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.getSeguimientoRutas();
  }

  getSeguimientoRutas() {
    this._TodoCargaService.getSeguimiento().subscribe({
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

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }

  setFilter(searchText: string) {
    this._agGridService.quickSearch(this.agGrid, searchText);
  }

  onExportClick() {
    //procesar filas y ordenarlas
    const processedRows: any[] = [];
    this.gridApi.forEachNodeAfterFilterAndSort((node) => {
        const data = node.data;
        const row = {
            'Tienda': data.guia.tienda.nombre_tienda,
            'Guia': data.guia.guia,
            'Boleta': data.guia.boleta,
            'LPN': data.guia.lpn,
            'Producto': data.guia.producto,
            'Chofer': data.ruta && data.ruta.chofer && data.ruta.chofer.tipoTransporte.transporte === 'Chofer' ? 
                      `${data.ruta.chofer.nombres || ''} ${data.ruta.chofer.apellidos || ''}` : '',
            'Ayudante': data.ruta && data.ruta.ayudante && data.ruta.ayudante.tipoTransporte.transporte === 'Ayudante' ? 
                      `${data.ruta.ayudante.nombres || ''} ${data.ruta.ayudante.apellidos || ''}` : '',
            'Estado': data.guia.marcaPgd,
            'Fecha Creación': moment(data.createdAt).tz("America/Santiago").format('DD-MM-YYYY HH:mm:ss')
        };
        processedRows.push(row);
    });

    // Convertir las filas en una hoja de trabajo de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(processedRows);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Guardar archivo
    XLSX.writeFile(wb, 'seguimiento.xlsx');
}

}
