/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'frontend-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input()
  public href = '';

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  public onClick(): void {
    /* If the button has an href, navigate to it. */
    if (this.href) {
      // If its one of the routes in the app, navigate to it.
      if (this.router.config.find(route => route.path === this.href)) {
        this.router.navigate([this.href]);
      } else {
        window.location.href = this.href;
      }
    }
  }

}
