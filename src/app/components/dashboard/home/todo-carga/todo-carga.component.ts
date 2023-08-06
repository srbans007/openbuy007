import { Component } from '@angular/core';
import { Todo_carga } from 'src/app/interfaces/todo-carga';
import { TodoCargaService } from 'src/app/services/todo-carga.service';
import { Router } from '@angular/router';
import { AgGridModule } from "src/app/components/shared/shared.module";
import { CellClickedEvent, ColDef, ColumnApi, GridReadyEvent } from "ag-grid-community";
import { AgGridService } from 'src/app/services/ag-grid.service'; // Asegúrate de que la ruta es correcta

@Component({
  selector: 'app-todo-carga',
  templateUrl: './todo-carga.component.html',
  styleUrls: ['./todo-carga.component.scss']
})
export class TodoCargaComponent {
onCellClicked($event: CellClickedEvent<any,any>) {

}
  private gridApi!: AgGridModule;
  private gridColumnApi!: ColumnApi;
  
  columnDefs = [
    { field: 'id' },
    { field: 'fecha_carga' },
    { field: 'tienda' },
    { field: 'boleta' },
    { field: 'sku' },
    { field: 'producto' },
    { field: 'cantidad' },
    { field: 'bulto' },
    { field: 'rut_cliente' },
    { field: 'fono_cliente' },
    { field: 'email_cliente' },
    { field: 'direccion_cliente' },
    { field: 'comuna_cliente' },
    { field: 'fecha_compromiso' },
    { field: 'lpn' }
  ];
  
  //listGuias: Todo_carga[] = []
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };
  public rowData$!: Todo_carga[];

  constructor(
    private router: Router,
    private _TodoCargaService: TodoCargaService,
    private _agGridService: AgGridService,
  ) { }

  ngOnInit(): void {
    this.getGuias();
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
}
