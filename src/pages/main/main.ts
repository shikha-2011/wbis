import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  refRoot = 'RefPage'
  curRoot = 'CurPage'
  aboutRoot = 'AboutPage'


  constructor(public navCtrl: NavController) {}

}
