import { Component, OnInit } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let ScrollReveal: any;

@Component({
  selector: 'frontend-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  current = 0;

  ngOnInit(): void {
    const content = document.getElementById("content");

    if (content)
      content.style.height = "100%";

    ScrollReveal().reveal('.load', {
      delay: 250,
      scale: 0.85,
      distance: '0px',
      easing: 'ease-in-out',
      reset: true,
    });
  }

}
