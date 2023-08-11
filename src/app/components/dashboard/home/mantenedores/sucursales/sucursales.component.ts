import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, CellClickedEvent } from 'ag-grid-community';
import { AgGridService } from 'src/app/services/ag-grid.service';
import { Sucursal } from 'src/app/interfaces/sucursal';
import { SucursalService } from 'src/app/services/sucursal.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import * as XLSX from 'xlsx';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.scss']
})
export class SucursalesComponent {

  // Propiedades
  sucursales: Sucursal[] = [];
  private gridColumnApi!: ColumnApi;
  private gridApi!: GridApi;
  public rowData$!: Sucursal[];
  newSucursales: Sucursal[] = [
    { nombre_sucursal: '' }
  ];
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

  // Referencias
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('filterInput') filterInput!: ElementRef;

  // Constructor e inicialización
  constructor(
    private router: Router,
    private _agGridService: AgGridService,
    private _SucursalService: SucursalService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this._SucursalService.getSucursal().subscribe(s => {
      this.sucursales = s;
    });
  }

  // Métodos del ciclo de vida de Angular

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


  onAddClick() {
    this._SucursalService.insertSucursal(this.newSucursales).subscribe({
      next: (sucursal) => {
        console.log('Sucursal agregada:', sucursal);
        this._snackBar.open('Sucursal Agregada', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        // Si el backend responde con una sucursal, la agregas al array de sucursales
        if (Array.isArray(sucursal)) {
          this.sucursales.push(...sucursal);
          this.getGuias();
          this.filterInput.nativeElement.focus(); // Enfocar el campo de búsqueda
          this.newSucursales[0].nombre_sucursal = '';
        } else {
          this.sucursales.push(sucursal);
        }
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

  onCellClicked($event: CellClickedEvent<any, any>) {
    // ...
  }
}
