import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DataService } from "./services/data.service";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { DataSource } from "@angular/cdk/collections";
import { AddDialogComponent } from "./dialogs/add/add.dialog.component";
import { EditDialogComponent } from "./dialogs/edit/edit.dialog.component";
import { DeleteDialogComponent } from "./dialogs/delete/delete.dialog.component";
import { BehaviorSubject, fromEvent, merge, Observable } from "rxjs";
import { Branch } from "./models/branch";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  displayedColumns = [
    "Code",
    "Address",
    "Identification",
    "CreationDate",
    "Currency",
    "Actions",
  ];
  exampleDatabase: DataService | null;
  dataSource: ExampleDataSource | null;
  branchId: string;
  selectedBranch: string;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dataService: DataService
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: { branch: Branch },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase.dataChange.value.push(
          this.dataService.getDialogData()
        );
        setTimeout(()=>{ this.refresh() }, 1000);
      }
    });
  }

  startEdit(
    branchId: string,
    code: number,
    description: string,
    address: string,
    identification: string,
    createDate: string,
    currencyId: string
  ) {
    this.branchId = branchId;

    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        branchId: branchId,
        code: code,
        description: description,
        address: address,
        identification: identification,
        createDate: createDate,
        currencyId: currencyId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1 && this.exampleDatabase) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(
          (x) => x.branchId === this.branchId
        );
        this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
        setTimeout(()=>{ this.refresh() }, 1000);

      }
    });
  }

  deleteItem(
    branchId: string,
    code: number,
    description: string,
    address: string,
    identification: string,
    createDate: string,
    currencyId: string
  ) {
    this.branchId = branchId;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        branchId: branchId,
        code: code,
        description: description,
        address: address,
        identification: identification,
        createDate: createDate,
        currencyId: currencyId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1 && this.exampleDatabase) {
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(
          (x) => x.branchId === this.branchId
        );
        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        setTimeout(()=>{ this.refresh() }, 1000);
      }
    });
  }

  public loadData() {
    this.exampleDatabase = new DataService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    fromEvent(this.filter.nativeElement, "keyup")
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }
}

export class ExampleDataSource extends DataSource<Branch> {
  _filterChange = new BehaviorSubject("");

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Branch[] = [];
  renderedData: Branch[] = [];

  constructor(
    public _exampleDatabase: DataService,
    public _paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => (this._paginator.pageIndex = 0));
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Branch[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page,
    ];

    this._exampleDatabase.getAllBranchs();

    return merge(...displayDataChanges, this._exampleDatabase.data);
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: Branch[]): Branch[] {
    if (!this._sort.active || this._sort.direction === "") {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = "";
      let propertyB: number | string = "";

      switch (this._sort.active) {
        case "branchId":
          [propertyA, propertyB] = [a.branchId, b.branchId];
          break;
        case "code":
          [propertyA, propertyB] = [a.code, b.code];
          break;
        case "description":
          [propertyA, propertyB] = [a.description, b.description];
          break;
        case "identification":
          [propertyA, propertyB] = [a.identification, b.identification];
          break;
        case "currencyId":
          [propertyA, propertyB] = [a.currencyId, b.currencyId];
          break;
        case "createDate":
          [propertyA, propertyB] = [a.createDate, b.createDate];
          break;
        case "address":
          [propertyA, propertyB] = [a.address, b.address];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === "asc" ? 1 : -1)
      );
    });
  }
}
