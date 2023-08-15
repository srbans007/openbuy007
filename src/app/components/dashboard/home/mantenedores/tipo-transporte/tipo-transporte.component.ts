import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, CellClickedEvent, ICellRendererParams } from 'ag-grid-community';
import { AgGridService } from 'src/app/services/ag-grid.service';
import { TipoTransporte } from 'src/app/interfaces/tipoTransporte';
import { TipoTransporteService } from 'src/app/services/tipo-transporte.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import * as XLSX from 'xlsx';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-tipo-transporte',
  templateUrl: './tipo-transporte.component.html',
  styleUrls: ['./tipo-transporte.component.scss']
})
export class TipoTransporteComponent {
  // Propiedades
  tipoTransporte: TipoTransporte[] = [];
  private gridColumnApi!: ColumnApi;
  private gridApi!: GridApi;
  public rowData$!: TipoTransporte[];
  newTipoTransporte: TipoTransporte[] = [
    { transporte: '' }
  ];

  columnDefs = [
    { field: 'id', hide: true },
    { field: 'transporte', headerName: 'Transporte' },
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
    private _TipoTransporteService: TipoTransporteService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this._TipoTransporteService.getTipoTransporte().subscribe(t => {
      this.tipoTransporte = t;
    });
  }

  // Métodos del ciclo de vida de Angular

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getTransporte();
    this._agGridService.autoSizeAll(this.gridColumnApi, false);

  }

  getTransporte() {
    this._TipoTransporteService.getTipoTransporte().subscribe({
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
    this._TipoTransporteService.insertTipoTransporte(this.newTipoTransporte).subscribe({
      next: (transporte) => {
        console.log('Transporte agregada:', transporte);
        this._snackBar.open('Transporte Agregada', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        // Si el backend responde con una sucursal, la agregas al array de sucursales
        if (Array.isArray(transporte)) {
          this.tipoTransporte.push(...transporte);
          this.getTransporte();
          this.filterInput.nativeElement.focus(); // Enfocar el campo de búsqueda
          this.newTipoTransporte[0].transporte = '';
        } else {
          this.tipoTransporte.push(transporte)
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
      this._TipoTransporteService.destroyTipoTransporte(dataToSend).subscribe({
        next: (deletedData) => {
          console.log('Registro eliminado:', deletedData);
          this._snackBar.open('Registro eliminado', '', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          // Refrescar la tabla
          this.getTransporte();
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
    XLSX.writeFile(wb, 'trasnportes.xlsx');
  }
}
