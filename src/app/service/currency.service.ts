import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private selectedCurrecny$ : BehaviorSubject<string> = new BehaviorSubject<string>("INR");

  constructor() { }

  // getting currency
  getCurrency(){
    return this.selectedCurrecny$.asObservable();
  }

  // setting currency
  setCurrency(currency : string){
    this.selectedCurrecny$.next(currency);
  }

}
