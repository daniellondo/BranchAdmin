import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, OnInit } from "@angular/core";
import { DataService } from "../../services/data.service";
import { FormControl, Validators } from "@angular/forms";
import { Currency } from "../../models/currency";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-baza.dialog",
  templateUrl: "../../dialogs/edit/edit.dialog.html",
  styleUrls: ["../../dialogs/edit/edit.dialog.css"],
})
export class EditDialogComponent implements OnInit {
  minDate = new Date();
  public currencies: Currency[] = [];
  selectedCurrency: string;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.getAllCurrenciex().subscribe(
      (data) => (this.currencies = data.result),
      (error: HttpErrorResponse) => {
        console.log(error.name + " " + error.message);
      }
    );
  }

  formControl = new FormControl("", [
    Validators.required,
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
      ? "Not a valid email"
      : "";
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    this.data.currencyId = Number.parseInt(this.selectedCurrency);
    this.dataService.updateBranch(this.data);
  }
}
