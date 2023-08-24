import { Component, ViewChild } from '@angular/core';
import { Todo_carga } from 'src/app/interfaces/todo-carga';
import { TodoCargaService } from 'src/app/services/todo-carga.service';
import { Router } from '@angular/router';
import { ColDef, ColumnApi, CellClickedEvent, IRowNode } from 'ag-grid-community';
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
    { field: 'guia' },
    { field: 'boleta' },
    { field: 'lpn', headerName: 'LPN' },
    { field: 'marcaPgd', headerName: 'Estado'  },
    { field: 'sku' },
    { field: 'producto' },
    { field: 'cantidad' },
    { field: 'bulto' },
    { field: 'cliente', headerName: 'Cliente' },
    { field: 'fono_cliente', headerName: 'Contacto' },
    { field: 'direccion_cliente', headerName: 'Dirección' },
    { field: 'comuna_cliente', headerName: 'Comuna' },
    { field: 'fecha_compromiso', headerName: 'Fecha Compromiso' },
    
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
    const processedRows: any[] = [];
    const previousGuides: Set<string> = new Set();

    const nodesArray: IRowNode<any>[] = [];
    this.gridApi.forEachNode(node => nodesArray.push(node));
    


    nodesArray.sort((a, b) => {
      const tiendaA = this.tiendas.find(t => t.id === a.data.id_tienda);
      const tiendaB = this.tiendas.find(t => t.id === b.data.id_tienda);
  
      const nombreTiendaA = tiendaA?.nombre_tienda || '';
      const nombreTiendaB = tiendaB?.nombre_tienda || '';
  
      if (nombreTiendaA < nombreTiendaB) return -1;
      if (nombreTiendaA > nombreTiendaB) return 1;
  
      if (a.data.guia < b.data.guia) return -1;
      if (a.data.guia > b.data.guia) return 1;
  
      return new Date(a.data.fecha_compromiso).getTime() - new Date(b.data.fecha_compromiso).getTime();
  });

  

    for (const node of nodesArray) {
        const data = node.data;
        const guide = data.guia;
        
        const tienda = this.tiendas.find(t => t.id === data.id_tienda);
        const sucursal = this.sucursales.find(s => s.id === data.id_sucursal);
        
        const guiaValue = previousGuides.has(guide) ? '' : guide;

        const row = {
            'Fecha de Carga': data.fecha_carga,
            'Tienda': tienda?.nombre_tienda || '',
            'Sucursal': sucursal?.nombre_sucursal || '',
            'Guia': guiaValue,
            'Boleta': data.boleta,
            'LPN': data.lpn,
            'Estado': data.marcaPgd,
            'SKU': data.sku,
            'Producto': data.producto,
            'Cantidad': data.cantidad,
            'Bulto': data.bulto,
            'Dirección': data.direccion_cliente,
            'Comuna': data.comuna_cliente,
            'Cliente': data.cliente,
            'Contacto': data.fono_cliente,
            'Fecha Compromiso': this.formatDateToExcelFriendly(data.fecha_compromiso)
        };

        if (!previousGuides.has(guide)) {
            previousGuides.add(guide);
        }

        processedRows.push(row);
    }

    // Convertir las filas en una hoja de trabajo de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(processedRows);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Guardar archivo
    XLSX.writeFile(wb, 'sucursales.xlsx');
}

// 1. Función para reformatar la fecha:
formatDateToExcelFriendly(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;  // Formato DD/MM/YYYY
}

}
