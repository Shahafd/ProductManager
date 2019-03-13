import { Product } from "./../../models/product.model";
import { Component, OnInit, Input, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"]
})
export class ProductDetailsComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Product) {}

  ngOnInit() {}

}
