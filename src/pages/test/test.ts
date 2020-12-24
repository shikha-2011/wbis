import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient,  } from '@angular/common/http';
import {Http,RequestOptions,Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http) {
  }

  username='';
  password='';
  
  validateLogin()
  {
  
    let headers = new Headers({'Content-Type':'application/json'});
    let options = new RequestOptions({headers: headers });
    
  let data=JSON.stringify({username: this.username, password:this.password});
  this.http.post('http://localhost/isro/validateLogin.php',data,options)
  .map(res => res.json())
  .subscribe(res => {
  alert("success: Userid "+res.userid+" Access Token "+res.token+ "Name: "+res.name);
}, (err) => {
  alert("failed");
  
  });
  
  }

}
