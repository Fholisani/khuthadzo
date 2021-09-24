import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ChildActivationEnd, Router } from '@angular/router'; 
import { filter } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import * as AOS from 'aos';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit() {
    AOS.init();
    this.authService.autoLogin();
  }
  title = 'Fholisani';
  loadedFeature = 'recipe';


  constructor(public router: Router, private titleService: Title, private authService: AuthService) {
    this.router.events
      .pipe(filter(event => event instanceof ChildActivationEnd))
      .subscribe(event => {
        let snapshot = (event as ChildActivationEnd).snapshot;
        while (snapshot.firstChild !== null) {
          snapshot = snapshot.firstChild;
        }
        this.titleService.setTitle(snapshot.data.title || 'Fholisani');
      });
  }

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
