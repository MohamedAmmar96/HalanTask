import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MapComponent } from './map.component';

@NgModule({
     declarations: [
          MapComponent
     ],
     imports: [
          BrowserModule,
          FormsModule
     ],
     providers: []
})
export class MapModule { }
