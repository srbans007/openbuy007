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
import { GuiaProcesada } from 'src/app/interfaces/guiaProcesada';
import { GuiasProcesadasService } from 'src/app/services/guias-procesadas.service';
import * as moment from 'moment';

@Component({
  selector: 'app-guias-procesadas',
  templateUrl: './guias-procesadas.component.html',
  styleUrls: ['./guias-procesadas.component.scss']
})
export class GuiasProcesadasComponent {
  //private gridApi!: AgGridModule;
  private gridColumnApi!: ColumnApi;
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    
    { 
      field: 'guiaRuta.ruta.createdAt', 
      headerName: 'Fecha Ruta',
      sortable: true,
      sort: 'desc',
      valueFormatter: (params: { value: moment.MomentInput; }) => {
          const dateInSantiago = moment(params.value).tz("America/Santiago").format('DD-MM-YYYY');
          return dateInSantiago;
      }
    },
    { field: 'guiaRuta.guia.tienda.nombre_tienda', headerName: 'Nombre Tienda' },
    { field: 'guiaRuta.guia.guia', headerName: 'Guía' },
    { field: 'boleta', headerName: 'Boleta' },
    { field: 'estado', headerName: 'Estado' },
    { field: 'subestado', headerName: 'Subestado' },
    { 
      field: 'fecha_entregado', 
      headerName: 'Horario Gestión',
      valueFormatter: (params: { value: moment.MomentInput; }) => {
          const dateInSantiago = moment(params.value).tz("America/Santiago").format('DD-MM-YYYY HH:mm:ss');
          return dateInSantiago;
      }
    },
    { field: 'comentario_beetrack', headerName: 'Comentario Beetrack' },
    { field: 'guiaRuta.guia.lpn', headerName: 'LPN' },
    { field: 'guiaRuta.guia.producto', headerName: 'Producto' },
    { field: 'guiaRuta.guia.cliente', headerName: 'Cliente' },
    { field: 'guiaRuta.guia.direccion_cliente', headerName: 'Dirección' },
    { field: 'guiaRuta.guia.comuna_cliente', headerName: 'Comuna' },
    {
      headerName: 'Nombre Chofer',
      valueGetter: (params) => `${params.data.guiaRuta.ruta.chofer.nombres} ${params.data.guiaRuta.ruta.chofer.apellidos}`
    },
    {
      headerName: 'Nombre Ayudante',
      valueGetter: (params) => `${params.data.guiaRuta.ruta.ayudante.nombres} ${params.data.guiaRuta.ruta.ayudante.apellidos}`
    }
  
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  public rowData$!: GuiaProcesada[];

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    private router: Router,
    private _GuiaProcesadaService: GuiasProcesadasService,
    private _agGridService: AgGridService,

  ) { }

  ngOnInit(): void {

  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.getGuiasProcesadas();
    this._agGridService.autoSizeAll(this.gridColumnApi, false);
  }

  getGuiasProcesadas() {
    this._GuiaProcesadaService.getGuiaProcesada().subscribe({
      next: data => {
        this.rowData$ = data;
        console.log("Data guia", data);
      },
      error: error => {
        console.error('Ocurrió un error:', error);
        if (error.status === 400) {
          this.logOut();
        }
      },
      complete: () => {
        console.log('Data guia complete');
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
    const nodesArray: IRowNode<any>[] = [];
  
    // Usar forEachNodeAfterFilter en lugar de forEachNode
    this.gridApi.forEachNodeAfterFilter(node => nodesArray.push(node));
  
    for (const node of nodesArray) {
      const data = node.data;
  
      const row = {
        // ... tus otros campos ...
        'Guía': data.guiaRuta.guia.guia,
        'Boleta': data.boleta,
        'Estado': data.estado,
        'Subestado': data.subestado,
        'Comentario Beetrack': data.comentario_beetrack,
        'LPN': data.guiaRuta.guia.lpn,
        'Producto': data.guiaRuta.guia.producto,
        'Nombre Chofer': `${data.guiaRuta.ruta.chofer.nombres} ${data.guiaRuta.ruta.chofer.apellidos}`,
        'Nombre Ayudante': `${data.guiaRuta.ruta.ayudante.nombres} ${data.guiaRuta.ruta.ayudante.apellidos}`,
        'Nombre Tienda': data.guiaRuta.guia.tienda.nombre_tienda
      };
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
