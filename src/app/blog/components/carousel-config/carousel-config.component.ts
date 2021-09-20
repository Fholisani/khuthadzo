import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { LandingData } from 'src/app/model/landing-data.model';


@Component({
  selector: 'app-carousel-config',
  templateUrl: './carousel-config.component.html',
  styleUrls: ['./carousel-config.component.scss'],
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
    this.landingData = [new LandingData('Modern Bedroom','This is a modern bedroom design of a 1 bedroom apartment. ', "https://fholisani:8432/blogger/image/959949069/BEDROOM%20VIEW%203.jpg?size=original"),
    new LandingData('Modern Bedroom','A bedview shot from seating area of the bedroom', "https://fholisani:8432/blogger/image/959948320/BEDROOM%20VIEW%201.jpg?size=original"),
    new LandingData('Modern Bedroom','Living room view from the Tv unit', "https://fholisani:8432/blogger/image/959805389/LIVING%20ROOM%204.jpg?size=original")]
  }

}
