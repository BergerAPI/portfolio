import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { AngularFullpageModule } from '@fullpage/angular-fullpage';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
    ], { initialNavigation: 'enabledBlocking' }),
    AngularFullpageModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
