import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RefPage } from './ref';

@NgModule({
  declarations: [
    RefPage,
  ],
  imports: [
    IonicPageModule.forChild(RefPage),
  ],
})
export class RefPageModule {}
