import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {FormControl, Validators} from '@angular/forms';
import { Branch } from '../../models/branch';
import { Currency } from "../../models/currency";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add.dialog',
  templateUrl: '../../dialogs/add/add.dialog.html',
  styleUrls: ['../../dialogs/add/add.dialog.css']
})

export class AddDialogComponent implements OnInit{
  minDate = new Date();
  public currencies: Currency[] = [];
  selectedCurrency: string;
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Branch,
              public dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getAllCurrenciex().subscribe(
      (data) => (this.currencies = data.result),
      (error: HttpErrorResponse) => {
        console.log(error.name + " " + error.message);
      }
    );
  }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
  // empty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.data.currencyId = this.selectedCurrency;
    this.dataService.addBranch(this.data);
  }
}
