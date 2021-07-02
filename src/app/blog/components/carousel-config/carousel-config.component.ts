import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { LandingData } from 'src/app/model/landing-data.model';


@Component({
  selector: 'app-carousel-config',
  templateUrl: './carousel-config.component.html',
  styleUrls: ['./carousel-config.component.css'],
  providers: [NgbCarouselConfig]  // add NgbCarouselConfig to the component providers
  
})
export class CarouselConfigComponent implements OnInit {

 // images = [700, 533, 807, 124].map((n) => `https://picsum.photos/id/${n}/900/500`);

  title = 'ng-carousel-demo';
  landingData : LandingData[];
   
  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.interval = 50000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  ngOnInit(): void {
    this.landingData = [new LandingData('First Slide','First Slide Short', "https://picsum.photos/id/700/900/500"),
    new LandingData('Second Slide','Second Slide Short', "https://picsum.photos/id/807/900/500"),
    new LandingData('Third Slide','Third Slide Short', "https://picsum.photos/id/533/900/500")]
  }

}
