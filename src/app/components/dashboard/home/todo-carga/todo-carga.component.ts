import { Component, ViewChild } from '@angular/core';
import { Todo_carga } from 'src/app/interfaces/todo-carga';
import { TodoCargaService } from 'src/app/services/todo-carga.service';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, CellClickedEvent } from 'ag-grid-community';
import { AgGridService } from 'src/app/services/ag-grid.service'; // Asegúrate de que la ruta es correcta
import { Tienda } from 'src/app/interfaces/tienda';
import { Sucursal } from 'src/app/interfaces/sucursal';
import { TiendaService } from 'src/app/services/tienda.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import * as XLSX from 'xlsx';

//import { AgGridModule } from "src/app/components/shared/shared.module";

@Component({
  selector: 'app-todo-carga',
  templateUrl: './todo-carga.component.html',
  styleUrls: ['./todo-carga.component.scss']
})
export class TodoCargaComponent {

  //traemos los datos para la tabla
  tiendas: Tienda[] = [];
  sucursales: Sucursal[] = [];

  onCellClicked($event: CellClickedEvent<any, any>) {

  }
  //private gridApi!: AgGridModule;
  private gridColumnApi!: ColumnApi;
  private gridApi!: GridApi;

  columnDefs = [
    { field: 'id', hide: true },
    { field: 'fecha_carga', headerName: 'Fecha de Carga' },
    {
      field: 'id_tienda',
      headerName: 'Tienda',
      valueGetter: (params: { data: { id_tienda: number; }; }) => {
        const tienda = this.tiendas.find(t => t.id === params.data.id_tienda);
        return tienda ? tienda.nombre_tienda : '';
      }
    },
    {
      field: 'id_sucursal',
      headerName: 'Sucursal',
      valueGetter: (params: { data: { id_sucursal: number; }; }) => {
        const sucursal = this.sucursales.find(s => s.id === params.data.id_sucursal);
        return sucursal ? sucursal.nombre_sucursal : '';
      }
    },
    { field: 'boleta' },
    { field: 'guia' },
    { field: 'sku' },
    { field: 'producto' },
    { field: 'cantidad' },
    { field: 'bulto' },
    { field: 'rut_cliente', headerName: 'Rut' },
    { field: 'fono_cliente', headerName: 'Cliente' },
    { field: 'email_cliente', headerName: 'Email' },
    { field: 'direccion_cliente', headerName: 'Dirección' },
    { field: 'comuna_cliente', headerName: 'Comuna' },
    { field: 'fecha_compromiso', headerName: 'Fecha Compromiso' },
    { field: 'lpn', headerName: 'LPN' }
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  public rowData$!: Todo_carga[];

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

    //se reciben los datos para buscar los id
    this._TiendaService.getTienda().subscribe(t => {
      this.tiendas = t;
    });

    this._SucursalService.getSucursal().subscribe(s => {
      this.sucursales = s;
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.getGuias();
    this._agGridService.autoSizeAll(this.gridColumnApi, false);
  }

  getGuias() {
    this._TodoCargaService.getTodoCarga().subscribe({
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
    // Obtener las filas filtradas
    const filteredRows: any[] = [];
    this.gridApi.forEachNodeAfterFilter((node) => {
      filteredRows.push(node.data);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredRows);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Guardar archivo
    XLSX.writeFile(wb, 'sucursales.xlsx');
  }
}
