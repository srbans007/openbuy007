import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, CellClickedEvent, ICellRendererParams } from 'ag-grid-community';
import { AgGridService } from 'src/app/services/ag-grid.service';
import { Transportista } from 'src/app/interfaces/transportista';
import { TransportistaService } from 'src/app/services/transportista.service';
import { Sucursal } from 'src/app/interfaces/sucursal';
import { SucursalService } from 'src/app/services/sucursal.service';
import { TipoTransporte } from 'src/app/interfaces/tipoTransporte';
import { TipoTransporteService } from 'src/app/services/tipo-transporte.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import * as XLSX from 'xlsx';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-transportista',
  templateUrl: './transportista.component.html',
  styleUrls: ['./transportista.component.scss']
})
export class TransportistaComponent {
// Propiedades
sucursal: Sucursal[] = [];
tipoTransporte: TipoTransporte[] = [];
transportista: Transportista[] = [];
private gridColumnApi!: ColumnApi;
private gridApi!: GridApi;
public rowData$!: Transportista[];
newTransportista: Transportista[] = [
  {
    nombres: '',
    apellidos: ''
  }
];

columnDefs = [
  { field: 'id', hide: true },
  {
    field: 'id_transporte',
    headerName: 'Transporte',
    valueGetter: (params: { data: { id_transporte: number; }; }) => {
      const tipoTransporte = this.tipoTransporte.find(s => s.id === params.data.id_transporte);
      return tipoTransporte ? tipoTransporte.transporte : '';
    }
  },
  {
    field: 'id_sucursal',
    headerName: 'Sucursal',
    valueGetter: (params: { data: { id_sucursal: number; }; }) => {
      const sucursal = this.sucursal.find(s => s.id === params.data.id_sucursal);
      return sucursal ? sucursal.nombre_sucursal : '';
    }
  },
  { field: 'nombres', headerName: 'Nombres' },
  { field: 'apellidos', headerName: 'Apellidos' },
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
  private _TransportistaService: TransportistaService,
  private _TipoTransporteService: TipoTransporteService,
  private _SucursalService: SucursalService,
  private _snackBar: MatSnackBar
) { }


ngOnInit() {
  this._TransportistaService.getTransportista().subscribe({
    next: (t) => {
      this.transportista = t;
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

  this._TipoTransporteService.getTipoTransporte().subscribe({
    next: (tT) => {
      this.tipoTransporte = tT;
    },
    error: (error) => {
      console.error('Ocurrió un error al obtener t.Transporte:', error);
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
  this.getTransportista();
  this._agGridService.autoSizeAll(this.gridColumnApi, false);
}

getTransportista() {
  this._TransportistaService.getTransportista().subscribe({
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
  this._TransportistaService.insertTransportista(this.newTransportista).subscribe({
    next: (transportista) => {
      console.log('Ruta agregada:', transportista);
      this._snackBar.open('Ruta Agregada', '', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      // Si el backend responde con una sucursal, la agregas al array de sucursales
      if (Array.isArray(transportista)) {
        this.transportista.push(...transportista);
        this.getTransportista();
        this.filterInput.nativeElement.focus(); // Enfocar el campo de búsqueda
        this.newTransportista[0].nombres = '';
        this.newTransportista[0].apellidos = '';
      } else {
        this.transportista.push(transportista)
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
  const dataToSend = [{ id: data.id }];

  let snackBarRef = this._snackBar.open('¿Está seguro de que desea eliminar este registro?', 'Eliminar', {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  });

  snackBarRef.onAction().subscribe(() => {
    // Si el usuario hace clic en 'Eliminar', procede a eliminar el registro
    this._TransportistaService.destroyTransportista(dataToSend).subscribe({
      next: (deletedData) => {
        console.log('Registro eliminado:', deletedData);
        this._snackBar.open('Registro eliminado', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        // Refrescar la tabla
        this.getTransportista();
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
  XLSX.writeFile(wb, 'transportistas.xlsx');
}

//si no hay token o hay manoseo de token pa juerah
logOut() {
  localStorage.removeItem('token');
  this.router.navigate(['/login'])
}

}
