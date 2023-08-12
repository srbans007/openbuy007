import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, CellClickedEvent, ICellRendererParams } from 'ag-grid-community';
import { AgGridService } from 'src/app/services/ag-grid.service';
import { Tienda } from 'src/app/interfaces/tienda';
import { TiendaService } from 'src/app/services/tienda.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import * as XLSX from 'xlsx';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.component.html',
  styleUrls: ['./tiendas.component.scss']
})
export class TiendasComponent {
// Propiedades
tienda: Tienda[] = [];
private gridColumnApi!: ColumnApi;
private gridApi!: GridApi;
public rowData$!: Tienda[];
newTiendas: Tienda[] = [
  { nombre_tienda: '' }
];

columnDefs = [
  { field: 'id', hide: true },
  { field: 'nombre_tienda', headerName: 'Tienda' },
  { field: 'createdAt', headerName: 'Fecha Creación' },
  { field: 'updatedAt', headerName: 'Última actualización' },
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

// Constructor e inicialización
constructor(
  private router: Router,
  private _agGridService: AgGridService,
  private _TiendaService: TiendaService,
  private _snackBar: MatSnackBar
) { }

ngOnInit(): void {
  this._TiendaService.getTienda().subscribe(t => {
    this.tienda = t;
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
  this._TiendaService.getTienda().subscribe({
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
  this._TiendaService.insertTienda(this.newTiendas).subscribe({
    next: (tienda) => {
      console.log('Tienda agregada:', tienda);
      this._snackBar.open('Tienda Agregada', '', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      // Si el backend responde con una sucursal, la agregas al array de sucursales
      if (Array.isArray(tienda)) {
        this.tienda.push(...tienda);
        this.getGuias();
        this.filterInput.nativeElement.focus(); // Enfocar el campo de búsqueda
        this.newTiendas[0].nombre_tienda = '';
      } else {
        this.tienda.push(tienda)
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

deleteRow(data: any) {
  const dataToSend = [{ id: data.id }];
  
  let snackBarRef = this._snackBar.open('¿Está seguro de que desea eliminar este registro?', 'Eliminar', {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  });

  snackBarRef.onAction().subscribe(() => {
    // Si el usuario hace clic en 'Eliminar', procede a eliminar el registro
    this._TiendaService.destroyTienda(dataToSend).subscribe({
      next: (deletedData) => {
        console.log('Registro eliminado:', deletedData);
        this._snackBar.open('Registro eliminado', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        // Refrescar la tabla
        this.getGuias();
      },
      error: (error) => {
        console.error('Ocurrió un error al eliminar:', error);
      }
    });
  });
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
  XLSX.writeFile(wb, 'tiendas.xlsx');
}

}
