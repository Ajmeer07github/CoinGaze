import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

  // method for getting currency data

  getCurrency(currency:string){
    return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&sparkline=false`);
  }
  // method for getting the trending currrency
  getTrendingCurrency(currency:string){
    return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`);
  }
  // method for graphical data
  getGraphicalCurrencyData(coinId:string, currency:string, days: number){
    return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`);

  }

  // method for getting Currency By Id
  getCurrencyById(coinId:string){
    return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/${coinId}`);

  }

}
