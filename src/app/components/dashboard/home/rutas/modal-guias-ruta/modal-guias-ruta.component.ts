import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ICellRendererParams, CellClickedEvent, ColDef, ColumnApi, GridApi } from 'ag-grid-community';
import { Observable, concatMap, lastValueFrom } from 'rxjs';
import { GuiaRuta } from 'src/app/interfaces/guiaRuta';
import { Ruta } from 'src/app/interfaces/ruta';
import { Seguimiento } from 'src/app/interfaces/seguimiento';
import { Sucursal } from 'src/app/interfaces/sucursal';
import { Tim } from 'src/app/interfaces/tim';
import { TipoRuta } from 'src/app/interfaces/tipoRuta';
import { TipoTransporte } from 'src/app/interfaces/tipoTransporte';
import { Todo_carga } from 'src/app/interfaces/todo-carga';
import { Transportista } from 'src/app/interfaces/transportista';
import { Vehiculo } from 'src/app/interfaces/vehiculo';
import { AgGridService } from 'src/app/services/ag-grid.service';
import { GuiaRutaService } from 'src/app/services/guia-ruta.service';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { TodoCargaService } from 'src/app/services/todo-carga.service';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment-timezone';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal-guias-ruta',
  templateUrl: './modal-guias-ruta.component.html',
  styleUrls: ['./modal-guias-ruta.component.scss']
})

export class ModalGuiasRutaComponent {
  // Propiedades
  guiaInputValue: string = '';
  sucursalControl = new FormControl();
  choferControl = new FormControl();
  ayudanteControl = new FormControl();
  patenteControl = new FormControl();
  tipoRutaControl = new FormControl();
  timControl = new FormControl();

  filteredSucursales!: Observable<Sucursal[]>;
  filteredChofer!: Observable<Transportista[]>;
  filteredAyudante!: Observable<Transportista[]>;
  filteredVehiculo!: Observable<Vehiculo[]>;
  filteredTipoRuta!: Observable<TipoRuta[]>;
  filteredTim!: Observable<Tim[]>;

  sucursal: Sucursal[] = [];
  seguimientos: Seguimiento[] = [];
  tipoTransporte: TipoTransporte[] = [];
  chofer: Transportista[] = [];
  ayudante: Transportista[] = [];
  patente: Vehiculo[] = [];
  nombreRuta: TipoRuta[] = [];
  tim: Tim[] = [];

  private gridColumnApi!: ColumnApi;
  private gridApi!: GridApi;
  public rowData$!: GuiaRuta[];
  buscarGuia: Todo_carga[] = [];
  guiaRuta: GuiaRuta[] = [];
  newGuiaRuta: GuiaRuta[] = [];


  columnDefs: ColDef[] = [
    { field: 'id', hide: true },
    { field: 'id_ruta', hide: true },
    { field: 'guia.tienda.nombre_tienda', headerName: 'Tienda' },
    { field: 'guia.guia', headerName: 'Guía' },
    { field: 'guia.boleta', headerName: 'Boleta' },
    { field: 'guia.lpn', headerName: 'LPN' },
    {
      field: 'createdAt',
      headerName: 'Fecha Creación',
      sortable: true,
      sort: 'desc',
      valueFormatter: (params: { value: moment.MomentInput; }) => {
        const dateInSantiago = moment(params.value).tz("America/Santiago").format('DD-MM-YYYY HH:mm:ss');
        return dateInSantiago;
      }
    },
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
  @ViewChild('inputGuia') inputGuia!: ElementRef;


  // Constructor e inicialización

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private _agGridService: AgGridService,
    public dialogRef: MatDialogRef<ModalGuiasRutaComponent>,
    private _GuiaRutaService: GuiaRutaService,
    private _TodoCargaService: TodoCargaService,
    private _SeguimientoService: SeguimientoService,
    @Inject(MAT_DIALOG_DATA) public data: {
      dataGuia: Ruta,
      selectedSucursal: Sucursal,
      selectedChofer: Transportista,
      selectedAyudante: Transportista,
      selectedPatente: Vehiculo,
      selectedTipoRuta: TipoRuta,
      selectedTim: Tim
    },
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.sucursal = [this.data.selectedSucursal];
    this.chofer = [this.data.selectedChofer];
    this.ayudante = [this.data.selectedAyudante];
    this.patente = [this.data.selectedPatente];
    this.nombreRuta = [this.data.selectedTipoRuta];
    this.tim = [this.data.selectedTim];

    if (this.data.dataGuia.id !== undefined) {
      this._GuiaRutaService.getGuiaRutaId(this.data.dataGuia.id).subscribe(g => {
        this.newGuiaRuta = g;
      });
    } else {
      console.error("id no está definido");
    }

  }

  tiendasPresentes: Set<string> = new Set();
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getGuiasId();
    this._agGridService.autoSizeAll(this.gridColumnApi, false);

    // Limpia las tiendas presentes previamente
    this.tiendasPresentes.clear();

    // Verifica las tiendas presentes en la grilla de ag-grid
    this.gridApi.forEachNode((node) => {
      const tiendaName = node.data.guia.tienda.nombre_tienda.toLowerCase();
      this.tiendasPresentes.add(tiendaName);
      console.log('datosTienda', node)
    });


    // Forzar la detección de cambios
    this.cdr.detectChanges();
  }

  getGuiasId() {
    if (this.data.dataGuia.id !== undefined) {
      this._TodoCargaService.getDatosGuiaRutaPorRutaId(this.data.dataGuia.id).subscribe({
        next: data => {
          this.rowData$ = data;
          console.log("Data received", data);

          // Mueve la lógica de detección de tiendas aquí
          this.detectStoresFromData(data);
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
  }

  detectStoresFromData(data: any[]) {
    // Limpia las tiendas presentes previamente
    this.tiendasPresentes.clear();

    // Verifica las tiendas presentes en la grilla de ag-grid
    data.forEach(item => {
      const tiendaName = item.guia.tienda.nombre_tienda.toLowerCase();
      this.tiendasPresentes.add(tiendaName);
    });

    console.log('tiendas presentes:', Array.from(this.tiendasPresentes));

    // Forzar la detección de cambios
    this.cdr.detectChanges();
  }

  onBuscarGuia() {
    const encodedGuia = encodeURIComponent(this.guiaInputValue);
    this._TodoCargaService.getBuscarGuia(encodedGuia)
      .subscribe({
        next: (data: Todo_carga[]) => {
          const dataRuta = this.data.dataGuia.id;

          // Usar map para iterar sobre cada registro y construir el objeto deseado
          const resultArray = data.map(item => {
            return {
              "id_ruta": dataRuta,
              "id_guia": item.id
            };
          });

          // Insertar cada registro de resultArray

          this.newGuiaRuta = resultArray;
          this.onAddClick();
          console.log('guiaqlia', this.guiaInputValue)

          this.guiaInputValue = '';
        },
        error: (err) => {
          console.error('Error al buscar guía:', err);
        },
        complete: () => {
          console.log('Búsqueda completada.');
        }
      });
  }

  onAddClick() {
    let guiasAdded: GuiaRuta[] = [];  // <-- Declara una variable aquí

    this._GuiaRutaService.insertGuiaRuta(this.newGuiaRuta).pipe(
      concatMap((guiaRutas) => {
        console.log('Guias agregadas:', guiaRutas);
        this._snackBar.open('Guias Agregadas', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });

        guiasAdded = guiaRutas;

        const seguimientos = guiaRutas.map(guia => ({
          id_guia: guia.id_guia!,
          id_ruta: guia.id_ruta!,
          marcaPgd: 5
        }));

        return this._SeguimientoService.insertSeguimiento(seguimientos);
      })
    ).subscribe({
      next: (dataSeguimiento) => {
        console.log('Seguimientos cargados', dataSeguimiento);
        this.guiaRuta.push(...guiasAdded);  // <-- Usa la variable aquí
        this.getGuiasId();
        this.updateMarcaPgd(2);
        if (this.inputGuia && this.inputGuia.nativeElement) {
          this.inputGuia.nativeElement.focus();
        }
      },
      error: (error) => {
        console.error('Ocurrió un error:', error);
      },
      complete: () => {
        console.log('Operación de inserción completa.');
      }
    });
  }

  deleteRow(data: any) {
    console.log('dato eliminado', data)
    const dataToSend = [{ id: data.id }];

    let snackBarRef = this._snackBar.open('¿Está seguro de que desea eliminar este registro?', 'Eliminar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    snackBarRef.onAction().subscribe(() => {

      // Si el usuario hace clic en 'Eliminar', procede a eliminar el registro
      this._GuiaRutaService.destroyGuiaRuta(dataToSend).subscribe({
        next: (deletedData) => {
          console.log('Registro eliminado:', deletedData);
          this._snackBar.open('Registro eliminado', '', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          // Accede a id_guia e id_ruta desde el objeto data
          const id_guia = data.id_guia;
          const id_ruta = data.id_ruta;

          // Crear un objeto seguimiento para el registro eliminado
          const seguimiento: Seguimiento = {
            id_guia: id_guia,
            id_ruta: id_ruta,
            marcaPgd: 4
          };

          // Insertar el objeto seguimiento en el backend
          this._SeguimientoService.insertSeguimiento([seguimiento]).subscribe({
            next: (dataSeguimiento) => {
              console.log('Seguimiento cargado', dataSeguimiento);
            },
            error: (errorSeguimiento) => {
              console.error('Error seguimiento', errorSeguimiento);
            }
          });

          // Refrescar la tabla
          this.getGuiasId();
          this.updateMarcaPgdDel(id_guia, 1);

        },
        error: (error) => {
          console.error('Ocurrió un error al eliminar:', error);
        }
      });
    });
  }

  //update marca
  updateMarcaPgd(marcaPgdValue: number) {
    this.newGuiaRuta.forEach(guia => {
      const guiaId = guia.id_guia;
      const guiaToUpdate = [{ id: guiaId, marcaPgd: marcaPgdValue }];

      this._TodoCargaService.updateGuia(guiaToUpdate).subscribe({
        next: (updatedGuia) => {
          console.log('Guía actualizada con marcaPgd:', updatedGuia);
        },
        error: (error) => {
          console.error('Error al actualizar marcaPgd:', error);
        }
      });
    });
  }

  updateMarcaPgdDel(guiaId: number, marcaPgdValue: number) {
    const guiaToUpdate: Todo_carga[] = [{ id: guiaId, marcaPgd: marcaPgdValue }];

    this._TodoCargaService.updateGuia(guiaToUpdate).subscribe({
      next: (updatedGuia) => {
        console.log('Guía actualizada con marcaPgd:', updatedGuia);
      },
      error: (error) => {
        console.error('Error al actualizar marcaPgd:', error);
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
    // Obtener las filas filtradas y transformadas
    const transformedRows: any[] = [];
    this.gridApi.forEachNodeAfterFilter((node) => {
      transformedRows.push(this.transformRowForExport(node.data));
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(transformedRows);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Guardar archivo
    XLSX.writeFile(wb, 'guiaRuta.xlsx');
  }

  transformRowForExport(row: any): any {
    return {
      'Tienda': row.guia.tienda.nombre_tienda,
      'Guía': row.guia.guia,
      'Boleta': row.guia.boleta,
      'LPN': row.guia.lpn,
      'Fecha Creación': row.createdAt
      // ... (y así para cualquier otro campo que quieras exportar)
    };
  }

  //manejo de tiendas
  currentStore: string = '';
  transformRowForPDF(row: any): any[] {
    const createdAtInSantiago = moment(row.createdAt).tz("America/Santiago").format('DD-MM-YYYY HH:mm:ss');

    return [
      row.guia.guia,
      row.guia.boleta,
      row.guia.lpn,
      row.guia.producto,
      row.guia.cliente,
      row.guia.direccion_cliente,
      row.guia.comuna_cliente,
      row.guia.fono_cliente,
      createdAtInSantiago
    ];
  }

  async generatePDF(store: string) {
    const imageBase64 = await this.getImageAsBase64();
    const dimensions = await this.getImageDimensions(imageBase64);

    const scaledWidth = dimensions.width * 0.1;
    const scaledHeight = dimensions.height * 0.1;

    const totalUniqueGuides = new Set();

    // Primero, cuenta todas las guías únicas en la grilla
    this.gridApi.forEachNode((node) => {
      const guideNumber = node.data.guia.guia;
      if (guideNumber) {
        totalUniqueGuides.add(guideNumber);
      }
    });

    // Datos de ag-grid
    const bodyData = [];
    bodyData.push(['#', 'Guía', 'Boleta', 'LPN', 'Producto', 'Cliente', 'Dirección', 'Comuna', 'Contacto', 'Ingreso']);

    const processedGuides = new Set();
    const uniqueGuidesForStore = new Set();
    let counter = 1;

    this.gridApi.forEachNodeAfterFilter((node) => {
      const guideNumber = node.data.guia.guia;
      if (guideNumber && node.data.guia.tienda.nombre_tienda === store) {
        uniqueGuidesForStore.add(guideNumber);

        const transformedRow = this.transformRowForPDF(node.data);

        if (!processedGuides.has(guideNumber)) {
          transformedRow.unshift(counter++);
          processedGuides.add(guideNumber); // Agrega el número de la guía al conjunto
        } else {
          transformedRow.unshift(''); // Si la guía ya fue procesada, deja el espacio del contador vacío
        }

        bodyData.push(transformedRow);
      }
    });

    const bodyTable = {
      style: 'bodyFont',
      table: {
        widths: [10, 50, 50, '*', 120, 85, 120, 70, 60, 60], // Ajusta estos valores según el contenido de tus columnas
        body: bodyData,
      },
      layout: {
        hLineWidth: function () {
          return 0.5;  // grosor de la línea horizontal
        },
        vLineWidth: function () {
          return 0.5;  // grosor de la línea vertical
        }
      }
    };

    const numberOfTotalUniqueGuides = totalUniqueGuides.size;
    const lastGuideCountForStore = counter - 1;

    // Encabezado del PDF
    const headerTable = {
      table: {
        widths: ['*', '*', '*', '*'],
        body: [
          [{ text: 'Tienda ' + store.toUpperCase(), style: 'header2', colSpan: 3 }, {}, {}, { image: imageBase64, width: scaledWidth, height: scaledHeight, alignment: 'right' }],
          [
            { text: 'Chofer: ' + this.chofer[0].nombres + ' ' + this.chofer[0].apellidos, style: 'header' },
            { text: 'Cantidad x tienda: ' + lastGuideCountForStore, style: 'header' },
            { text: 'Ruta: ' + this.nombreRuta[0].nombre_ruta, style: 'header' },
            { text: 'Patente: ' + this.patente[0].patente, style: 'header' }
          ],
          [
            { text: 'Ayudante: ' + this.ayudante[0].nombres + ' ' + this.ayudante[0].apellidos, style: 'header' },
            { text: 'Total General: ' + numberOfTotalUniqueGuides, style: 'header' },
            { text: 'Fecha: ' + '', style: 'header' },
            { text: 'Tienda: ' + '', style: 'header' }
          ]
        ]
      },
      layout: 'noBorders'
    };

    // Definición del documento para pdfMake
    const docDefinition = {
      content: [
        headerTable,
        bodyTable
      ],
      styles: {
        header: {
          fontSize: 9,
          bold: false
        },
        bodyFont: {
          fontSize: 8,
          bold: false
        }
      },
      pageSize: { width: 595.28, height: 841.89 }, // Tamaño A4
      pageOrientation: 'landscape' as const,
      pageMargins: [28.3, 15, 28.3, 28.3] // Margen de 1cm en cada lado
    };

    // Genera y descarga el PDF
    pdfMake.createPdf(docDefinition as any).download(`timConductor_${store}.pdf`);
  }


  async getImageAsBase64(): Promise<string> {
    const imagePath = '../../../../../../assets/img/openbuy.png';

    try {
      const blobData = await lastValueFrom(this.http.get(imagePath, { responseType: 'blob' }));

      if (blobData) {
        return this.convertBlobToBase64(blobData);
      } else {
        console.error("Error al obtener la imagen: respuesta vacía");
        return '';
      }
    } catch (error) {
      console.error("Error al obtener la imagen:", error);
      return '';
    }
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  getImageDimensions(base64: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = base64;
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
