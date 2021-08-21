import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PostDetailResponse } from 'src/app/model/post-response.model';
import { GalleryImages, Post } from 'src/app/model/post.model';
import { BlogService } from 'src/app/service/blog-service.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit,OnDestroy {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  post: Post;
  postDetailResponse : PostDetailResponse;
  id: number;
  private userSub: Subscription;
  private subscription: Subscription;
  private subscriptionPostDelete: Subscription;
  private subscriptionPostDetail: Subscription;
  isAuthenticated = false;
  isLoading = false;
  errorMessage: string = null;

  constructor(private blogService: BlogService, private route: ActivatedRoute,
    private router: Router,  private authService: AuthService,
    private dataStorageService: DataStorageService,) { }

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        console.log("Parameter ID : "+ this.id);
        this.onFetchData(this.id);
       
      }
    );


    this.subscriptionPostDetail = this.blogService.postDetailResponseChanged
    .subscribe(
      (postDetailResponse: PostDetailResponse) => {
        this.postDetailResponse = postDetailResponse;
        this.galleryImages = this.postDetailResponse.galleryImages;
        console.log("galleryImages : "+  this.galleryImages)
      }
    );

    this.subscription = this.blogService.isLoadingChanged
    .subscribe(
      (isLoading: boolean) => {
        this.isLoading = isLoading;
      }
    );

    this.subscriptionPostDelete = this.blogService.postDeleteChanged
    .subscribe(
      (postId: number) => {
        this.onPostDelete(postId);
      }
    );
    this.subscription = this.blogService.errorMessageChanged
    .subscribe(
      (errorMessage: string) => {
        this.errorMessage = errorMessage;
      }
    );

    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      // console.log(!user);
      // console.log(!!user);
    });
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
      //this.galleryImages = this.postDetailResponse.galleryImages;
  }

  onEditRecipe() {
    //this.router.navigate(['edit'], {relativeTo: this.route});
   this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.blogService.deletePost(this.id);
  //  this.router.navigate(['/home']);
  }

  onFetchData(postId: number) {
    this.blogService.setLoadingIndicator(true);
    return this.dataStorageService.fetchDetailPosts(postId).subscribe(postDetail => {

      this.blogService.setPostDetailResponse(postDetail);
    
      this.blogService.setLoadingIndicator(false);
    }, errorMessage => {

      console.log('HTTP Error', errorMessage)
      let errMsg = `Unable to retrieve blog post due to  ${errorMessage}()`;
      this.blogService.setErrorMessage(errMsg);
      this.blogService.setLoadingIndicator(false);
    });
  }
  onPostDelete(postId: number) {
    this.blogService.setLoadingIndicator(true);
    return this.dataStorageService.postDelete(postId).subscribe(postDetail => {

      this.blogService.setLoadingIndicator(false);
      this.router.navigate(['/home']);
    }, errorMessage => {

      console.log('HTTP Error', errorMessage)
      let errMsg = `Unable to delete blog post due to  ${errorMessage}()`;
      this.blogService.setErrorMessage(errMsg);
      this.blogService.setLoadingIndicator(false);
    });
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.subscription.unsubscribe();
    this.subscriptionPostDetail.unsubscribe();
    this.subscriptionPostDelete.unsubscribe();
  }
  

}
