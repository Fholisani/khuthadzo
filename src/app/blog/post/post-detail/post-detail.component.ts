import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';
import { Observable } from 'rxjs';
import { GalleryImages, Post } from 'src/app/model/post.model';
import { BlogService } from 'src/app/service/blog-service.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  post: Post;
  id: number;

  constructor(private blogService: BlogService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.post = this.blogService.getPost(this.id);
        this.galleryImages = this.post.galleryImages;
      }
    );

    this.galleryOptions = [
      {
    
        width: '100%',
        height: '450px',
        imageDescription: true, previewZoom: true, previewRotate: true,
        imageSwipe: true, thumbnailsSwipe: true, previewSwipe: true,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      { breakpoint: 500, width: '100%', height: '450px', thumbnailsColumns: 3 },
      { breakpoint: 300, width: '100%', height: '450px', thumbnailsColumns: 2 }
    ];

    // this.post = new Post(1, "slug",
    //   "https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-medium.jpeg",
    //   "Magna nostrud incididunt cupidatat cillum incididunt et nisi in ut minim reprehenderit.",
    //   "Labore irure irure laborum quis tempor aliqua. Dude", "meta",
    //   "Est ipsum sint officia quis nulla nisi cupidatat aliquip nisi laboris eiusmod eiusmod aliquip do. Commodo elit excepteur occaecat irure Lorem sit nulla nulla sint duis incididunt. Nostrud ut do mollit et amet velit aute excepteur et culpa culpa velit. Cillum veniam officia anim cupidatat.",
    //   [
    //     {
    //       small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-small.jpeg',
    //       medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-medium.jpeg',
    //       big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-big.jpeg',
    //       description: 'Testing 1'
    //     },
    //     {
    //       small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-small.jpeg',
    //       medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-medium.jpeg',
    //       big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-big.jpeg',
    //       description: 'Testing 2'
    //     },
    //     {
    //       small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-small.jpeg',
    //       medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-medium.jpeg',
    //       big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-big.jpeg',
    //       description: 'Testing 3'
    //     },
    //     {
    //       small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-small.jpeg',
    //       medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-medium.jpeg',
    //       big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-big.jpeg',
    //       description: 'Testing 4'
    //     }
    //   ],  new Date("2019-01-16"),"*Khuthi*","#1 min read",[],[],
    //   "https://mdbootstrap.com/img/Photos/Horizontal/Work/4-col/img%20%2821%29.jpg");
      this.galleryImages = this.post.galleryImages;
  }

  onEditRecipe() {
    //this.router.navigate(['edit'], {relativeTo: this.route});
   this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.blogService.deletePost(this.id);
    this.router.navigate(['/home']);
  }

}
