import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ChildActivationEnd, Router } from '@angular/router'; 
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Khuthadzo';
  loadedFeature = 'recipe';


  constructor(public router: Router, private titleService: Title) {
    this.router.events
      .pipe(filter(event => event instanceof ChildActivationEnd))
      .subscribe(event => {
        let snapshot = (event as ChildActivationEnd).snapshot;
        while (snapshot.firstChild !== null) {
          snapshot = snapshot.firstChild;
        }
        this.titleService.setTitle(snapshot.data.title || 'Khuthadzo');
      });
  }

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
