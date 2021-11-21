import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


import { LoginComponent } from './login.component';

@NgModule({
     declarations: [
          LoginComponent
     ],
     imports: [
          BrowserModule,
          FormsModule
     ],
     providers: []
})
export class LoginModule { }
