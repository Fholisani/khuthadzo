import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { PostCard } from 'src/app/model/post-card.model';
import { Meta } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

declare var gtag: Function;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent   implements OnInit,AfterViewInit, OnDestroy {

  private routerSubscription: Subscription;


  constructor(private meta: Meta, private router: Router,
   
   
    public http: HttpClient) { }

  
  ngOnInit(): void {
  
   
  }
  ngAfterViewInit(): void {
    // subscribe to router events and send page views to Google Analytics
   
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('config', 'UA-178909230-1', {'page_path': event.urlAfterRedirects});
      });
  }

  ngOnDestroy(): void {
 
    if(this.routerSubscription){
      this.routerSubscription.unsubscribe();
    }
  }



}
