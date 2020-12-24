import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Http, HttpModule, Headers } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'; 
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DataWbisProvider } from '../providers/data-wbis/data-wbis';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,HttpClientModule,HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BackgroundGeolocation,
    Geolocation,HttpModule,
   
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataWbisProvider,SQLite,
    LocationTrackerProvider,Toast
  ]
})
export class AppModule {}
