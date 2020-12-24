import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Http, Headers,RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { Toast } from '@ionic-native/toast';

//import * as PouchDB from 'pouchdb';  
//import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
@Injectable()
export class DataWbisProvider {
  constructor(public http: Http,
    public sqlite: SQLite,
    private toast: Toast) {
    
  }
  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS expense(rowid INTEGER PRIMARY KEY, date TEXT, type TEXT, description TEXT, amount INT)', {})
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));

    }).catch(e => console.log(e));
  }

  /*saveData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO expense VALUES(NULL,?,?,?,?)',[this.data.date,this.data.type,this.data.description,this.data.amount])
        .then(res => {
          console.log(res);
          this.toast.show('Data saved', '5000', 'center').subscribe(
            toast => {
              this.navCtrl.popToRoot();
            }
          );
        })
        .catch(e => {
          console.log(e);
          this.toast.show(e, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
    }).catch(e => {
      console.log(e);
      this.toast.show(e, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }*/
  geta() {
    return this.http.get("https://jsonplaceholder.typicode.com/photos")
      .map(x => x.json());
  }
  getDataFromSQLlite() {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        return db.executeSql('select * from photosDB', []);
      })
      .catch(e => console.log(e));
  }

  InsertData(data: any) {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        data.forEach(element => {
          db.executeSql('insert into photosDB values (?,?,?)', [element.id, element.title, "assets/icon/spongebob.png"])
            .then(() => {
              console.log("Data Inserted");
            })
            .catch(e => console.log(e));
        });
      })
      .catch(e => console.log(e));
  }
  ClearDB() {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('delete from photosDB', {})
          .then(() => {
            console.log("Data Cleared");
          })
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

}



