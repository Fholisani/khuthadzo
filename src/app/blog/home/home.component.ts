import { Component, OnInit } from '@angular/core';
import { PostCard } from 'src/app/model/post-card.model';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {



  constructor(private meta: Meta, private router: Router) { }

  
  ngOnInit(): void {

    this.meta.updateTag({property: 'og:title', content: 'Posts'});
    this.meta.updateTag({property: 'og:image', content: 'http://127.0.0.1:8432/blogger/image/262846328/about.jpg?size=original'});
    this.meta.updateTag({property: 'og:url', content: this.router.url})

   
  }

}
