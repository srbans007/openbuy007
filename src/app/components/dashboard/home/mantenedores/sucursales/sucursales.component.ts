import { Component, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.scss']
})
export class SucursalesComponent {
  sucursales: Sucursal[] = [];
  onCellClicked($event: CellClickedEvent<any, any>) {

  }
  //private gridApi!: AgGridModule;
  private gridColumnApi!: ColumnApi;
  private gridApi!: GridApi;

  columnDefs = [
    { field: 'id', hide: true },
    { field: 'nombre_sucursal', headerName: 'Sucursal' },
    { field: 'createdAt', headerName: 'Fecha Creación' },
    { field: 'updatedAt', headerName: 'Última actualización' },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  public rowData$!: Sucursal[];

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    private router: Router,
    private _agGridService: AgGridService,
    private _SucursalService: SucursalService
  ) { }

  ngOnInit(): void {

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
    this._SucursalService.getSucursal().subscribe({
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

  //si no hay token o hay manoseo de token pa juerah
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

  onAddClick(){

  }
}
