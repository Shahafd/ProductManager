import { ApiService } from "./../../services/api.service";
import { ProductDetailsComponent } from "./../product-details/product-details.component";
import { Product } from "./../../models/product.model";
import { Component, OnInit, ViewChild } from "@angular/core";
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import {
  MatTableDataSource,
  MatSort,
  MatDialog,
  MAT_DIALOG_DATA
} from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-main-menu",
  templateUrl: "./main-menu.component.html",
  styleUrls: ["./main-menu.component.css"]
})
export class MainMenuComponent implements OnInit {
  loading = false;
  color = "primary";
  mode = "indeterminate";
  value = 50;

  @ViewChild(MatSort) sort: MatSort;
  orderById: boolean = true;
  orderByName: boolean = false;
  index: number = 1;
  lastinput: string = "";
  itemsAmount: number = 20;
  products: Product[] = [
    { _id: 1, product: " ", price: "  ", inStock: true, imageUrl: " " }
  ];
  displayedColumns = ["_id", "product", "price", "inStock"];
  dataSource = new MatTableDataSource<Product>();

  constructor(
    private apiSerivce: ApiService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.GetProducts();
    this.apiSerivce.GetNumOfItemsPerRquest().subscribe(amount => {
      this.itemsAmount = amount as number;
    });
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  GetProducts() {
    this.apiSerivce.GetAllProducts(this.index).subscribe((res: Product[]) => {
      this.products = res;
      this.dataSource = new MatTableDataSource(this.products);
    });
  }
  onTableScroll(e) {
    const tableViewHeight = e.target.offsetHeight; // viewport: ~500px
    const tableScrollHeight = e.target.scrollHeight; // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled
    const buffer = 5;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit) {
      setTimeout(() => {
        this.GoToTop();
        this.index += this.itemsAmount;
        if (this.index >= 1000) {
          this.index = 1;
        }
        if (this.orderById) {
          this.GetProducts();
        } else {
          this.GetProductsOrderByName();
        }
      }, 500);
    }
  }
  GoToTop() {
    document.querySelector("mat-table").scrollTop = 100;
  }
  ItemSelected(product: Product) {
    setTimeout(() => {
      this.dialog.open(ProductDetailsComponent, {
        data: {
          product
        }
      });
    }, 500);
  }
  OrderChanged(obj) {
    this.index = 1;
    let input = obj.input;
    let order = obj.order;
    if (order === "ID") {
      this.orderById = true;
      this.orderByName = false;
    } else {
      this.orderByName = true;
      this.orderById = false;
    }
    if (input === "" && this.orderById) {
      this.GetProducts();
    } else if (input === "" && this.orderByName) {
      this.GetProductsOrderByName();
    }
  }
  GetProductsOrderByName() {
    this.apiSerivce
      .GetProductsByName(this.index)
      .subscribe((res: Product[]) => {
        this.products = res;
        this.dataSource = new MatTableDataSource(this.products);
      });
  }
  FilterChanged(value) {
    setTimeout(() => {
      this.lastinput = value;
      if (!value) {
        this.index = 0;
        this.GetProducts();
      } else {
        this.apiSerivce
          .GetSearchedProducts(this.index, value)
          .subscribe((res: Product[]) => {
            this.products = res;
            this.dataSource = new MatTableDataSource(this.products);
            if (this.lastinput !== value) {
              this.index += this.itemsAmount;
            }
          });
      }
    }, 500);
  }
}
