import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ButtonComponent } from './button/button.component';
import { InputComponent } from './input/input.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, ButtonComponent, InputComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
    ], { initialNavigation: 'enabledBlocking' }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    ButtonComponent,
    InputComponent
  ],
})
export class AppModule { }
