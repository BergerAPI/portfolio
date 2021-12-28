import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './button/button.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
  exports: [
  ]
})
export class AppModule { }
