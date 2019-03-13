import { ApiService } from './../../services/api.service';
import { Component, OnInit,Output,EventEmitter } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.css"]
})
export class FilterComponent implements OnInit {
  @Output() filterChanged = new EventEmitter();
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  constructor(private apiSerivce: ApiService) {}

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map(value => this._filter(value))
    );
    this.apiSerivce.GetMostUsedWords().subscribe(res => {
      this.options = res as string[];
    });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
this.filterChanged.emit(value);
    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
