import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit{
  actionButton: string = "Save"
  freshnessList = [
    'Brand new',
    'Second hand',
    'Refurbished'
  ]

  productForm! : FormGroup
  constructor(
    private formBuilder: FormBuilder, 
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required]
    })

    if(this.editData) {
      this.actionButton = "Update"
      this.productForm.controls['name'].setValue(this.editData.name)
      this.productForm.controls['category'].setValue(this.editData.category)
      this.productForm.controls['freshness'].setValue(this.editData.freshness)
      this.productForm.controls['date'].setValue(this.editData.date)
      this.productForm.controls['price'].setValue(this.editData.price)
      this.productForm.controls['comment'].setValue(this.editData.comment)
    }
  }

  addProduct() {
    if(!this.editData) {
      console.log(this.productForm.valid)
      if(this.productForm.value) {
        this.apiService.postProduct(this.productForm.value)
        .subscribe({
          next: (res) => {
            alert('Product added')
            this.productForm.reset()
            this.dialogRef.close('save')
          },
          error: () => {
            alert('Error occured')
          }
        })
      }
    }
    else {
      this.updateProduct()
    }
  }

  updateProduct() {
    this.apiService.putProduct(this.productForm.value, this.editData.id)
    .subscribe({
      next: (res) => {
        alert('Product Updated')
        this.productForm.reset
        this.dialogRef.close('update')
      }, 
      error: () => {
        alert('Error while updating the record')
      }
    })
  }
}
