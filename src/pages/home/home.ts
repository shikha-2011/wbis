import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { MainPage } from '../main/main';



@Component({
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,public http:Http) { 
    
  }

  slides = [
    {
      title: "Welcome to Bhuvan Water Bodies Information System(WBIS) Mobile",
      image: "assets/imgs/bhuvan.png",
    },
    {
      title: "About WBIS",
      description: "NRSC monitors the status of all water bodies (~ 2 lakhs, area > 2 ha in size) in the country using multi-resolution satellite images since January, 2012. The estimated water spread area as on the date of image is published as<b> Water Body Information System (WBIS)</b>. Capacity of water bodies computed either based on area-capacity curves (for some reservoirs) or based on assumed depth is also made available on experimental basis.",
      image: "assets/imgs/bhuvan.png",
    },
  
  ];


  goToMain(): void {
    this.navCtrl.push('MainPage');
  }

  
  
  

 /* postCall()
{
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let data=JSON.stringify({username:"raja"});
      this.http.post('http://localhost/isro/ion_dis_try.php',data)
      .map(res => res.json())
      .subscribe(res => {
      alert("success "+res);
      }, (err) => {
      alert("failed");
      });
  }*/

  
}