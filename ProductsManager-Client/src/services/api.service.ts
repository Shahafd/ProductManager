import { Product } from "../models/product.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { CollectionViewer, DataSource } from "@angular/cdk/collections";

@Injectable({
  providedIn: "root"
})
export class ApiService {
   url: string = "http://localhost:3000/api/";
  getAllProductsRoute = "products/GetAllProducts";
  getSearchedProductsRoute = "products/GetProducts";
  getMostUsedWordsRoute = "products/GetMostUsedWords";
  getNumOfItemsPerRquest = "products/GetNumOfItemsPerRquest";
  constructor(private http: HttpClient) {}

  GetAllProducts(index: number) {
    return this.http
      .get(this.url + this.getAllProductsRoute + "/" + (index))
      .pipe(
        tap(res => {
          return res as Product[];
        })
      );
  }
  GetNumOfItemsPerRquest() {
    return this.http.get(this.url + this.getNumOfItemsPerRquest).pipe(
      tap(res => {
        return res as Number;
      })
    );
  }
  GetSearchedProducts(index: number, input: string) {
    return this.http
      .get(this.url + this.getSearchedProductsRoute + "/" + input + "/" + (index))
      .pipe(
        tap(res => {
          return res as Product[];
        })
      );
  }
  GetMostUsedWords() {
    return this.http.get(this.url + this.getMostUsedWordsRoute).pipe(
      tap(res => {
        return res as String[];
      })
    );
  }
}
