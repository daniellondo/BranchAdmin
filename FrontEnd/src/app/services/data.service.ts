import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Branch } from "../models/branch";
import {
  EndpointBranchResponse,
  EndpointCurrencyResponse,
} from "../models/response";
import { Currency } from "../models/currency";

@Injectable()
export class DataService {
  private readonly API_URL = "https://localhost:44338/api/Branch";
  private readonly API_URL_Currencies = "https://localhost:44338/api/Currency";

  dataChange: BehaviorSubject<Branch[]> = new BehaviorSubject<Branch[]>([]);
  dataCurrencyChange: BehaviorSubject<Currency[]> = new BehaviorSubject<
    Currency[]
  >([]);
  dialogData: any;

  constructor(private http: HttpClient) {}

  get data(): Branch[] {
    return this.dataChange.value;
  }

  get dataCurrency(): Currency[] {
    console.log(`ESTE FUE` + this.dataCurrencyChange.value);
    return this.dataCurrencyChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllBranchs(id?: string): void {
    const url = !id ? "" : `?BranchId=${id}`;
    this.http.get<EndpointBranchResponse>(`${this.API_URL}${url}`).subscribe(
      (data) => {
        this.dataChange.next(data.result);
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + " " + error.message);
      }
    );
  }

  getAllCurrencies(): void {
    this.http
      .get<EndpointCurrencyResponse>(`${this.API_URL_Currencies}`)
      .subscribe(
        (data) => {
          this.dataCurrencyChange.next(data.result);
        },
        (error: HttpErrorResponse) => {
          console.log(error.name + " " + error.message);
        }
      );
  }

  getAllCurrenciex(): Observable<EndpointCurrencyResponse> {
    return this.http.get<EndpointCurrencyResponse>(
      `${this.API_URL_Currencies}`
    );
  }

  addBranch(branch: Branch): void {
    this.http.post<EndpointBranchResponse>(`${this.API_URL}`, branch).subscribe(
      (data) => (this.dialogData = data.result),
      (error: HttpErrorResponse) => {
        console.log(error.name + " " + error.message);
      }
    );
  }

  updateBranch(branch: Branch): void {
    if (!branch.branchId) throw Error("Id is required");
    this.http.put<EndpointBranchResponse>(`${this.API_URL}`, branch).subscribe(
      (data) => (this.dialogData = data.result),
      (error: HttpErrorResponse) => {
        console.log(error.name + " " + error.message);
      }
    );
  }

  deleteBranchById(id: string): void {
    this.http.delete<Branch>(`${this.API_URL}?BranchId=${id}`).subscribe(
      (data) => {},
      (error: HttpErrorResponse) => {
        console.log(error.name + " " + error.message);
      }
    );
  }
}
