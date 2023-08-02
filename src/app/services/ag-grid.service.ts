import { Injectable } from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {ColumnApi} from "ag-grid-community";

@Injectable({
  providedIn: 'root'
})
export class AgGridService {

  constructor() { }

  autoSizeAll(gridColumnApi: ColumnApi, skipHeader: boolean) {
    const allColumnIds: string[] = [];
    gridColumnApi.getColumns()!.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  quickSearch(agGridApi: AgGridAngular,searchText: string) {
    agGridApi.api.setQuickFilter(searchText);
  }

}

