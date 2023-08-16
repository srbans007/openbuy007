import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, CellClickedEvent, ICellRendererParams } from 'ag-grid-community';
import { AgGridService } from 'src/app/services/ag-grid.service';
import { Tim } from 'src/app/interfaces/tim';
import { TipoTimService } from 'src/app/services/tipo-tim.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import * as XLSX from 'xlsx';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-tipo-tim',
  templateUrl: './tipo-tim.component.html',
  styleUrls: ['./tipo-tim.component.scss']
})
export class TipoTimComponent {
  // Propiedades
  tim: Tim[] = [];
  private gridColumnApi!: ColumnApi;
  private gridApi!: GridApi;
  public rowData$!: Tim[];
  newTim: Tim[] = [
    { nombreTim: '' }
  ];

  columnDefs = [
    { field: 'id', hide: true },
    { field: 'nombreTim', headerName: 'Tipo Tim' },
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
    private _TipoTimService: TipoTimService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this._TipoTimService.getTim().subscribe(t => {
      this.tim = t;
    });
  }

  // Métodos del ciclo de vida de Angular

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getTipoTim();
    this._agGridService.autoSizeAll(this.gridColumnApi, false);

  }

  getTipoTim() {
    this._TipoTimService.getTim().subscribe({
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
    this._TipoTimService.insertTim(this.newTim).subscribe({
      next: (tim) => {
        console.log('Tipo tim agregada:', tim);
        this._snackBar.open('Transporte Agregada', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        // Si el backend responde con una sucursal, la agregas al array de sucursales
        if (Array.isArray(tim)) {
          this.tim.push(...tim);
          this.getTipoTim();
          this.filterInput.nativeElement.focus(); // Enfocar el campo de búsqueda
          this.newTim[0].nombreTim = '';
        } else {
          this.newTim.push(tim)
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
    const dataToSend = [{ id: data.id, nombreTim: data.nombre }];
    
    let snackBarRef = this._snackBar.open('¿Está seguro de que desea eliminar este registro?', 'Eliminar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  
    snackBarRef.onAction().subscribe(() => {
      // Si el usuario hace clic en 'Eliminar', procede a eliminar el registro
      this._TipoTimService.destroyTim(dataToSend).subscribe({
        next: (deletedData) => {
          console.log('Registro eliminado:', deletedData);
          this._snackBar.open('Registro eliminado', '', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          // Refrescar la tabla
          this.getTipoTim();
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
    XLSX.writeFile(wb, 'tipoTim.xlsx');
  }
}
