import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurPage } from './cur';

@NgModule({
  declarations: [
    CurPage,
  ],
  imports: [
    IonicPageModule.forChild(CurPage),
  ],
})
export class CurPageModule {}
