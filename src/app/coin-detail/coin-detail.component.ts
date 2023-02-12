import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../service/api.service';
import { ChartConfiguration, ChartType} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ViewChild } from "@angular/core";
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss']
})
export class CoinDetailComponent implements OnInit {

  coinData :any;
  coinId!: string;
  days : number = 1;
  currency : string ="INR";

  // line chart properties or definition
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: `Price Trends`,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#009688',
        pointBackgroundColor: '#009688',
        pointBorderColor: '#009688',
        pointHoverBackgroundColor: '#009688',
        pointHoverBorderColor: '#009688',

      }
    ],
    labels: []
  }; 

  // chart options
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1
      }
    },
    plugins: {
      legend: { display: true },
    }
  };

  // chart type

  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) myLineChart !: BaseChartDirective;


  constructor(private api : ApiService, private activatedRoute : ActivatedRoute, private currencyService : CurrencyService){}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val =>{
      this.coinId = val['id'];
    });
     
    // to get the coin data / details we are calling it
    this.getCoinData();
    this.getGraphData(this.days);

    // to change the currecny value according to user selection
    
    this.currencyService.getCurrency()
    .subscribe( val =>{
      this.currency = val;
      this.getGraphData(this.days);
      this.getCoinData();
    })

  
  }

  getCoinData(){
    this.api.getCurrencyById(this.coinId)
    .subscribe(res =>{
      let currency = this.currency;

      if(currency === "USD"){
        res.market_data.current_price.inr = res.market_data.current_price.usd;
        res.market_data.market_cap.inr = res.market_data.market_cap.usd;
      } 
      else if (currency === "EUR"){
        res.market_data.current_price.inr = res.market_data.current_price.eur;
        res.market_data.market_cap.inr = res.market_data.market_cap.eur;
      } 
      
      res.market_data.current_price.inr = res.market_data.current_price.inr;
      res.market_data.market_cap.inr = res.market_data.market_cap.inr;
    
      this.coinData = res;


    })
  }

  // getting graph data
  getGraphData(days : number){
    this.days = days;
    this.api.getGraphicalCurrencyData(this.coinId, this.currency, this.days)
    .subscribe( res =>{
      // to update the values instantly in graph
      setTimeout(()=>{
        this.myLineChart.chart?.update();
      },200);

      // to getting the price corresponding to the time
      this.lineChartData.datasets[0].data = res.prices.map((a:any)=>{
        return a[1];
      });
      // x and y axis labels
      this.lineChartData.labels =res.prices.map((a:any)=>{
        let date = new Date(a[0]); 
        let time =date.getHours() > 12 ?
        `${date.getHours() -12 } : ${date.getMinutes()}PM` :
        `${date.getHours()} : ${date.getMinutes()}AM`

        return days === 1 ? time : date.toLocaleDateString();
      })
    })

  }

}
