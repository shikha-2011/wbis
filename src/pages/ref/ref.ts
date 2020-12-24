import { Component } from '@angular/core';
import { IonicPage, NavController,Platform, NavParams,ToastController,ViewController,LoadingController } from 'ionic-angular';
import { HttpClient,  } from '@angular/common/http';
import {Http,RequestOptions,Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DataWbisProvider } from '../../providers/data-wbis/data-wbis';
import { DecimalPipe } from '@angular/common';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationTrackerProvider  } from '../../providers/location-tracker/location-tracker';
//import { ViewController } from '';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
declare var google;
var loading;


@IonicPage()
@Component({
  selector: 'page-ref',
  templateUrl: 'ref.html',
})
export class RefPage {

  states: Observable<any>;//  public states: any[];
  districts: Observable<any>;//  public states: any[];
  talukas: Observable<any>;
  public wbNearest:Array<any>;
  public sState : Array<any> = ["ANDAMAN & NICOBAR", "ANDHRA PRADESH", "ARUNACHAL PRADESH", "ASSAM", "BIHAR", "CHANDIGARH", "CHHATTISGARH", "DADRA & NAGAR HAVELI", "DAMAN & DIU", "DELHI", "GOA", "GUJARAT", "HARYANA", "HIMACHAL PRADESH", "JAMMU AND KASHMIR", "JHARKHAND", "KARNATAKA", "KERALA", "LAKSHADWEEP", "MADHYA PRADESH", "MAHARASHTRA", "MANIPUR", "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUDUCHERRY", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL NADU","TELANGANA", "TRIPURA", "UTTAR PRADESH", "UTTARAKHAND", "WEST BENGAL"];
  public sDistrict:Array<any> ;
  public sVillages:Array<any>;
  public statistics:Array<any>;
  public areaTable:Array<any>;
  public areaTotal:number = 0;
  public numTotal:number = 0;
  public area:number = 0;
  public villEmpty:Array<any>;
  public Basin:Array<any> = [{name:"Area of North Ladakha not draining into Indus Basin",value:"23"},{name:"Barak and others Basin",value:"23"},{name:"Brahmani and Baitarni Basin",value:"07"},{name:"Brahmaputra Basin",value:"2B"},{name:"Cauvery Basin",value:"05"},{name:"Drainage Area of Andaman and Nicobar Islands Basin",value:"24"},{name:"Drainage Area of Lakshadweep Islands Basin",value:"25"},{name:"East flowing rivers between Godavari and Krishna Basin" ,value:"16"},{name:"East flowing rivers between Krishna and Pennar Basin",value:"17"},{name:"East flowing rivers between Mahanadi and Godavari Basin",value:"15"},{name:"East flowing rivers between Pennar and Cauvery Basin",value:"18"},{name:"East flowing rivers South of Cauvery Basin",value:"19"},{name:"Ganga Basin",value:"2A"},{name:"Godavari Basin",value:"03"},{name:"Indus (Up to border) Basin",value:"01"},{name:"Krishna Basin",value:"04"},{name:"Mahanadi Basin",value:"08"},{name:"Mahi Basin",value:"10"},{name:"Minor rivers draining into Bangladesh Basin",value:"21"},{name:"Minor rivers draining into Myanmar Basin",value:"22"},{name:"Narmada Basin",value:"12"},{name:"Pennar Basin",value:"09"},{name:"Sabarmati Basin",value:"11"},{name:"Subernarekha Basin",value:"06"},{name:"Tapi Basin",value:"13"},{name:"West flowing rivers of Kutch and Saurashtra including Luni Basin",value:"20"},{name:"West flowing rivers South of Tapi Basin",value:"14"} ];
  public subBasin:Array<any>;
  


  
  //var test =[ "ANDAMAN & NICOBAR", "ANDHRA PRADESH", "ARUNACHAL PRADESH", "ASSAM", "BIHAR", "CHANDIGARH", "CHHATTISGARH", "DADRA & NAGAR HAVELI", "DAMAN & DIU", "DELHI", "GOA", "GUJARAT", "HARYANA", "HIMACHAL PRADESH", "JAMMU AND KASHMIR", "JHARKHAND", "KARNATAKA", "KERALA", "LAKSHADWEEP", "MADHYA PRADESH", "MAHARASHTRA", "MANIPUR", "MEGHALAYA", "MIZORAM", "NAGALAND", "ODISHA", "PUDUCHERRY", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL NADU","TELANGANA", "TRIPURA", "UTTAR PRADESH", "UTTARAKHAND", "WEST BENGAL"];

  stateAlertOpts: { title: string };
  distAlertOpts: { title: string };
  talukAlertOpts: { title: string };

  State='';
  district='';
  taluka='';
  village='';
  glob_state='';
  glob_dist='';
	glob_taluka='';
  glob_vill='';
  basin = '';
  subbasin = '';


public slatitude: any;
public slongitude: any;

  constructor(public sqlite: SQLite,public loadingCtrl: LoadingController,public navCtrl: NavController,public alertCtrl: AlertController,public navParams: NavParams,public geolocation: Geolocation,private platform: Platform,public locationTracker: LocationTrackerProvider,public http   : Http,public httpClient: HttpClient,public toastCtrl  : ToastController,public dbWbis:DataWbisProvider,public viewCtrl: ViewController)
   {
      this.sqlite.create({
    name: 'wbis.db',
    location: 'default'
  })
    .then((db: SQLiteObject) => {
      db.executeSql('create table IF NOT EXISTS state (rang VARCHAR(255),num INT,area REAL)', {})
        .then(() => {
          console.log("Database Created");
        })
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));

      this.stateAlertOpts = {
        title: 'Select any State'
      };
      this.distAlertOpts = {
        title: 'Select any District'
      };
      this.talukAlertOpts = {
        title: 'Select any Village'
      };
      this.platform.ready().then(() => {
        this.start();

        this.geolocation.getCurrentPosition().then(resp => {
          this.slatitude = resp.coords.latitude;
          this.slongitude = resp.coords.longitude;
          //this.latitude = this.slatitude;
          //this.longitude = this.slongitude;
           console.log(this.slatitude);
          console.log(this.slongitude);
          this.get_nearest_wb();
          
          }).catch(() => {
            console.log ("error to get location")
      
        });
        });
  }
  start(){
    this.locationTracker.startTracking();
  }
 
  stop(){
    this.locationTracker.stopTracking();
  }
  get_nearest_wb(){
    let body  : string   = "&lon=" + this.slongitude +"&lat="+this.slatitude,
           type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
           headers  : any      = new Headers({ 'Content-Type': type}),
           options  : any      = new RequestOptions({ headers: headers }),
           url      : any      = 'http://bhuvan-rcc.nrsc.gov.in:8081/TCPDFnew/examples/view_locate_wbis_mobile.php';
           //const loading = this.loadingCtrl.create({
           /// content: 'Please wait...'
         // });
         // loading.present();
           this.http.post(url,body,options)
           .subscribe((data) =>
          {
           // loading.dismiss();
          // If the request was successful notify the user
          if(data.status === 200)
          {
           //this.nearest_wb = data.json();

            alert("nearest waterbody:"+data["_body"]);
            
            }
     
       });
  }
    show_Districts()
    {
      
       console.log(this.State);
       //let item = this.state;
      // this.selectedState = item.stname;
 
       let state    : string   = this.State,
           body     : string   = "&State=" + this.State ,
           type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
           headers  : any      = new Headers({ 'Content-Type': type}),
           options  : any      = new RequestOptions({ headers: headers }),
           url      : any      = 'http://bhuvan-rcc.nrsc.gov.in:8081/TCPDFnew/examples/view_dist_state_wbis.php';
 
       this.http.post(url, body, options)
       .subscribe((data) =>
       {
          // If the request was successful notify the user
          if(data.status === 200)
          {
             //this.hideForm   = true;
            //this.sendNotification('Congratulations the technology: ${state.stname} was successfully selected');
            // alert("success"+JSON.stringify(data))
            //let state = this.State;
            //this.sendNotification(' ${state} was successfully selected');
            if(data["_body"] === "1"){
              alert("Database is under preparation");
              this.sDistrict = this.villEmpty;

            }else{
              this.sDistrict = data.json();
             console.log('my districts', (data));
            }
     
            
          }
          // Otherwise let 'em know anyway
          else
          {
             //this.sendNotification('Something went wrong!');
             console.error();
             
          }
       });
    }

    show_Villages(){
      console.log(this.district);
      let body     : string   = "&State=" + this.State + "&dist=" +this.district,
          type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
          headers  : any      = new Headers({ 'Content-Type': type}),
          options  : any      = new RequestOptions({ headers: headers }),
          url      : any      = 'http://bhuvan-rcc.nrsc.gov.in:8081/TCPDFnew/examples/view_vill_taluka.php';

      this.http.post(url, body, options)
      .subscribe((data) =>
      {
         // If the request was successful notify the user
         //this.sendNotification('Congratulations the technology: ${tate} was successfully selected');
         if(data.status === 200)
         {
            //this.hideForm   = true;
           //this.sendNotification('Congratulations the technology: ${state.stname} was successfully selected');
           // alert("success"+JSON.stringify(data))
                  if(data["_body"] === "1"){
                    alert("Database is under preparation");
                    this.sVillages = this.villEmpty;

                  }else{
                    this.sVillages = data.json();
                    console.log('my villages', (data));
                  }
           
         }
         // Otherwise let 'em know anyway
         else
         {
            //this.sendNotification('Something went wrong!');
            console.error();
            
         }
      });

    }


  view_status(){
      //let params1;
      if (this.State === '') {
        alert("Please select a State first");
      }
       else{

            if(this.district === ''){
            //this.glob_state = this.State;
             // params1 = {state:this.glob_state};	
              let body     : string   = "&state=" + this.State,
                      type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
                      headers  : any      = new Headers({ 'Content-Type': type}),
                      options  : any      = new RequestOptions({ headers: headers }),
                      url      : any      = 'http://bhuvan-rcc.nrsc.gov.in:8081/TCPDFnew/examples/view_date_geom_wbis.php';
                  this.loader();
                  this.httpRequest(url,body,options);
                      
            }
            else{
              if(this.taluka === ''){
                //this.glob_dist = this.district;
               // params1 = {state:this.glob_state,dist:this.glob_dist};	
                let body     : string   = "&state=" + this.State + "&dist=" + this.district,
                    type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
                    headers  : any      = new Headers({ 'Content-Type': type}),
                    options  : any      = new RequestOptions({ headers: headers }),
                    url      : any      = 'http://bhuvan-rcc.nrsc.gov.in:8081/TCPDFnew/examples/view_date_geom_wbis.php';
                   this.loader();
                    this.httpRequest(url,body,options);

              }
              else{
                  if(this.village === ''){
                      this.glob_taluka = this.taluka;
                       // params1 = {state:this.glob_state,dist:this.glob_dist,taluka:this.glob_taluka};	
                        let body     : string   = "&state=" + this.State +  "&dist=" + this.district +"&taluka=" + this.taluka,
                            type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
                            headers  : any      = new Headers({ 'Content-Type': type}),
                            options  : any      = new RequestOptions({ headers: headers }),
                            url      : any      = 'http://bhuvan-rcc.nrsc.gov.in:8081/TCPDFnew/examples/view_date_geom_wbis.php';
                            this.loader();

                            this.httpRequest(url,body,options);

                    
                  }
                  else{
                      this.glob_taluka = this.taluka;
                      this.glob_vill = this.village;
                  //params1 = {state:this.glob_state,dist:this.glob_dist,taluka:this.glob_taluka,vill:this.glob_vill};	
                  let body     : string   ="&state=" + this.State +  "&dist=" + this.district +"&taluka=" + this.taluka + "&vill=" +this.village,
                      type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
                      headers  : any      = new Headers({ 'Content-Type': type}),
                      options  : any      = new RequestOptions({ headers: headers }),
                      url      : any      = 'http://bhuvan-rcc.nrsc.gov.in:8081/TCPDFnew/examples/view_date_geom_wbis.php';
                      this.loader();

                      this.httpRequest(url,body,options);

                  }
                }
          
        }
        
      }
//console.log(params1);
                /*  let body     : string   = "&state=" + this.State,
                  type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
                  headers  : any      = new Headers({ 'Content-Type': type}),
                  options  : any      = new RequestOptions({ headers: headers }),
                  url      : any      = 'http://bhuvan-rcc.nrsc.gov.in:8081/TCPDFnew/examples/view_date_geom_wbis.php';

                  this.http.post(url, body, options)
                  .subscribe((data) =>
                  {
                  // If the request was successful notify the user
                  if(data.status === 200)
                  {
                      //this.hideForm   = true;
                    //this.sendNotification('Congratulations the technology: ${state.stname} was successfully selected');
                    alert("success")
                    // this.sVillages = data.json();
                      console.log('my table', (data["_body"]));
                      this.statistics=data.json();
                      this.numTotal = 0;
                      this.areaTotal = 0;
                      for(let i=0;i<this.statistics.length;i++){
                        this.numTotal+=parseInt(this.statistics[i].num);
                        this.areaTotal+=parseFloat(this.statistics[i].area);
                    // this.area=(this.areaTotal);
                        
                      }
                      console.log("total num",this.numTotal);
                      console.log("total num",this.areaTotal);


                    
                    


                  }
                  // Otherwise let 'em know anyway
                  else
                  {
                      //this.sendNotification('Something went wrong!');
                      console.error();
                      
                      
                  }
                  });*/

    }
  

httpRequest(url,body,options){
  this.http.post(url, body, options)
  .subscribe((data) =>
  {
    loading.dismiss();
   // If the request was successful notify the user
   if(data.status === 200)
   {
      //this.hideForm   = true;
     //this.sendNotification('Congratulations the technology: ${state.stname} was successfully selected');
     if(data["_body"] === "1"){
      alert("Sorry! No Data Available.");
      this.subBasin = this.villEmpty;

    }
    else{

    
     alert("success")
    // this.sVillages = data.json();
      console.log('my table', (data["_body"]));
      this.statistics=data.json();
      
      this.numTotal = 0;
      this.areaTotal = 0;
      for(let i=0;i<this.statistics.length;i++){
        this.numTotal+=parseInt(this.statistics[i].num);
        this.areaTotal+=parseFloat(this.statistics[i].area);
     // this.area=(this.areaTotal);
        
      }
      console.log("total num",this.numTotal);
      console.log("total num",this.areaTotal);
   }
  }
   // Otherwise let 'em know anyway
  
  });

}
show_SubBasin(){
  console.log(this.basin);
 // this.item = this.basin['value'];
  //console.log(this.item);
  let body     : string   = "&basin=" + this.basin['value'] ,
      type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
      headers  : any      = new Headers({ 'Content-Type': type}),
      options  : any      = new RequestOptions({ headers: headers }),
      url      : any      = 'http://bhuvan-rcc.nrsc.gov.in:8081/TCPDFnew/examples/view_sb_basin.php';

  this.http.post(url, body, options)
  .subscribe((data) =>
  {
     // If the request was successful notify the user
     //this.sendNotification('Congratulations the technology: ${tate} was successfully selected');
     if(data.status === 200)
     {
        //this.hideForm   = true;
       //this.sendNotification('Congratulations the technology: ${state.stname} was successfully selected');
       // alert("success"+JSON.stringify(data))
              if(data["_body"] === "1"){
                alert("Database is under preparation");
                this.subBasin = this.villEmpty;

              }else{
                this.subBasin = data.json();
                console.log('my subbasins', (data));
              }
       
     }
     // Otherwise let 'em know anyway
     else
     {
        //this.sendNotification('Something went wrong!');
        console.error();
        
     }
  });

}


sendNotification(message)  : void
   {
      let notification = this.toastCtrl.create({
          message       : message,
          duration      : 3000
      });
      notification.present();
   }


view_status_ws(){
    if (this.basin === '') {
      alert("Please select Basin before submitting");
    }
     else{

         if(this.subbasin  === ''){
          //this.glob_state = this.State;
           // params1 = {state:this.glob_state};

            let body     : string   = "&basin=" + this.basin['name'],
                    type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
                    headers  : any      = new Headers({ 'Content-Type': type}),
                    options  : any      = new RequestOptions({ headers: headers }),
                    url      : any      = 'http://bhuvan-rcc.nrsc.gov.in:8081/TCPDFnew/examples/view_date_geom_wbis_ws.php';
                   this.loader();

                 this.httpRequest(url,body,options);
                    
          }else{
              //this.glob_dist = this.district;
             // params1 = {state:this.glob_state,dist:this.glob_dist};	
              let body     : string   = "&basin=" + this.basin['name'] + "&sb=" + this.subbasin,
                  type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
                  headers  : any      = new Headers({ 'Content-Type': type}),
                  options  : any      = new RequestOptions({ headers: headers }),
                  url      : any      = 'http://bhuvan-rcc.nrsc.gov.in:8081/TCPDFnew/examples/view_date_geom_wbis_ws.php';
                  this.httpRequest(url,body,options);

            }
          }

   }
   loader(){
    loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
   }

    InsertData(data: any) {
    return this.sqlite.create({
      name: 'wbis.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        data.forEach(element => {
          db.executeSql('insert into state values (?,?,?)', [element.rang, element.num, element.area])
            .then(() => {
              console.log("Data Inserted");
            })
            .catch(e => console.log(e));
        });
      })
      .catch(e => console.log(e));
  }
  
}


