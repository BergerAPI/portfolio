import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'portfolio-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  fullpage: any;

  constructor() { }

  ngOnInit(): void {
  }


  getRef(fullPageRef: any) {
    this.fullpage = fullPageRef;
  }

}
