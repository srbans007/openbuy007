import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, CellClickedEvent, ICellRendererParams } from 'ag-grid-community';
import { AgGridService } from 'src/app/services/ag-grid.service';
import { Vehiculo } from 'src/app/interfaces/vehiculo';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { Sucursal } from 'src/app/interfaces/sucursal';
import { SucursalService } from 'src/app/services/sucursal.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import * as XLSX from 'xlsx';
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.scss']
})
export class VehiculoComponent {
// Propiedades
sucursal: Sucursal[] = [];
vehiculo: Vehiculo[] = [];
private gridColumnApi!: ColumnApi;
private gridApi!: GridApi;
public rowData$!: Vehiculo[];
newVehiculo: Vehiculo[] = [
  {
    patente: ''
  }
];

columnDefs = [
  { field: 'id', hide: true },
  {
    field: 'id_sucursal',
    headerName: 'Sucursal',
    valueGetter: (params: { data: { id_sucursal: number; }; }) => {
      const sucursal = this.sucursal.find(s => s.id === params.data.id_sucursal);
      return sucursal ? sucursal.nombre_sucursal : '';
    }
  },
  { field: 'patente', headerName: 'Patente' },
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
  private _VehiculoService: VehiculoService,
  private _SucursalService: SucursalService,
  private _snackBar: MatSnackBar
) { }

ngOnInit() {
  this._VehiculoService.getVehiculo().subscribe({
    next: (v) => {
      this.vehiculo = v;
    },
    error: (error) => {
      console.error('Ocurrió un error al obtener tiendas:', error);
      if (error.status === 400) {
        this.logOut();
      }
    },
    complete: () => {
      console.log('Data loading for tiendas complete');
    }
  });

  this._SucursalService.getSucursal().subscribe({
    next: (s) => {
      this.sucursal = s;
    },
    error: (error) => {
      console.error('Ocurrió un error al obtener sucursales:', error);
      if (error.status === 400) {
        this.logOut();
      }
    },
    complete: () => {
      console.log('Data loading for sucursales complete');
    }
  });
}

// Métodos del ciclo de vida de Angular

onGridReady(params: any) {
  this.gridApi = params.api;
  this.gridColumnApi = params.columnApi;
  this.getPatentes();
  this._agGridService.autoSizeAll(this.gridColumnApi, false);

}

getPatentes() {
  this._VehiculoService.getVehiculo().subscribe({
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
  this._VehiculoService.insertVehiculo(this.newVehiculo).subscribe({
    next: (vehiculo) => {
      console.log('Ruta agregada:', vehiculo);
      this._snackBar.open('Ruta Agregada', '', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      // Si el backend responde con una sucursal, la agregas al array de sucursales
      if (Array.isArray(vehiculo)) {
        this.vehiculo.push(...vehiculo);
        this.getPatentes();
        this.filterInput.nativeElement.focus(); // Enfocar el campo de búsqueda
        this.newVehiculo[0].patente = '';
      } else {
        this.vehiculo.push(vehiculo)
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

deleteRow(data: any) {
  const dataToSend = [{ id: data.id, patente: '' }];

  let snackBarRef = this._snackBar.open('¿Está seguro de que desea eliminar este registro?', 'Eliminar', {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  });

  snackBarRef.onAction().subscribe(() => {
    // Si el usuario hace clic en 'Eliminar', procede a eliminar el registro
    this._VehiculoService.destroyVehiculo(dataToSend).subscribe({
      next: (deletedData) => {
        console.log('Registro eliminado:', deletedData);
        this._snackBar.open('Registro eliminado', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        // Refrescar la tabla
        this.getPatentes();
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
  XLSX.writeFile(wb, 'patentes.xlsx');
}

//si no hay token o hay manoseo de token pa juerah
logOut() {
  localStorage.removeItem('token');
  this.router.navigate(['/login'])
}

}
