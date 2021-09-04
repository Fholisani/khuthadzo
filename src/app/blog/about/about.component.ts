import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
declare var gtag: Function;
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent  implements OnInit,AfterViewInit, OnDestroy {
 
  constructor( private router: Router) { }

  ngOnInit(): void {
  }
  private routerSubscription: Subscription;
  ngAfterViewInit(): void {
    // subscribe to router events and send page views to Google Analytics
   console.log("About page visited")
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('config', 'UA-178909230-1', {'page_path': event.urlAfterRedirects});
      });
  }

  ngOnDestroy(): void {
 
    this.routerSubscription.unsubscribe();
  }


}
