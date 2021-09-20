import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PostDetailResponse } from 'src/app/model/post-response.model';
import { Post } from 'src/app/model/post.model';
import { BlogService } from 'src/app/service/blog-service.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom';
import { LightGallery } from 'lightgallery/lightgallery';
import lgFullScreen from 'lightgallery/plugins/fullscreen'
import { ChangeDetectorRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { GalleryItem } from 'src/app/model/gallery-dynamic.model';
import mermaid from 'mermaid';
import { filter } from 'rxjs/operators';
import { ShareService } from 'src/app/service/share.service';
import { environment } from 'src/environments/environment';
declare var gtag: Function;

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit,AfterViewInit, OnDestroy {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  post: Post;
  postDetailResponse: PostDetailResponse;
  id: number;
  private userSub: Subscription;
  private subscription: Subscription;
  private subscriptionPostDelete: Subscription;
  private subscriptionPostDetail: Subscription;
  isAuthenticated = false;
  isLoading = false;
  errorMessage: string = null;
  private launch: any;
  private lightGallery!: LightGallery;
  settings: any;
  lgContainer: any;
  isReady: boolean = false;
  private needRefresh = false;
  private dg: any;
  host: string= environment.host;


  constructor(private blogService: BlogService, private route: ActivatedRoute,
    private router: Router, private authService: AuthService,
    private dataStorageService: DataStorageService, private elementRef: ElementRef,
    private changeDetection: ChangeDetectorRef, private shareService:ShareService) { }




  ngOnInit(): void {


    mermaid.initialize({
      securityLevel: 'loose'
    });
    setTimeout(() => {
      mermaid.init()
    },1000)

    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          console.log("Parameter ID : " + this.id);
          this.onFetchData(this.id);

        }
      );


    this.subscriptionPostDetail = this.blogService.postDetailResponseChanged
      .subscribe(
        (postDetailResponse: PostDetailResponse) => {
          this.postDetailResponse = postDetailResponse;
          this.galleryImages = this.postDetailResponse.galleryImages;
          console.log("galleryImages : " + this.galleryImages)
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
  }

  autoLaunch(launcDuration: number) {
    setTimeout(() => {
      if( this.isReady){
        this.lightGallery.openGallery();

      }
      
    }, launcDuration);
  }

  ngAfterViewChecked(): void {
    if (this.needRefresh) {
      this.lightGallery.refresh();
      this.needRefresh = false;
    }

  }
  Init = (detail): void => {
    //   this.items =[];

    this.lgContainer = document.getElementById('inline-gallery-container');
    if (this.lgContainer === null) {
      console.log("==>Initialized method after ready : 2");
    } else {
      console.log("==>Initialized method after ready will fail as render is not ready : 2");
    }
    this.lightGallery = detail.instance;


  };
  onEditRecipe() {
    //this.router.navigate(['edit'], {relativeTo: this.route});
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.blogService.deletePost(this.id);
    //  this.router.navigate(['/home']);
  }


  onFetchData(postId: number) {
    this.blogService.setLoadingIndicator(true);
    return this.dataStorageService.fetchDetailPosts(postId).subscribe(postDetail => {
      this.shareService.setFacebookTags(
        environment.host,
       postDetail.heading,
        postDetail.subHeading,
       postDetail.backgroundImage
       );
      this.blogService.setPostDetailResponse(postDetail);

      this.blogService.setLoadingIndicator(false);

    

      var localItems = [];
    
  
      postDetail.galleryImages.forEach(element => {
        const item = new GalleryItem(
          element.big,
          element.medium,
          element.small,
          element.subHtml);;
        localItems.push(item);
      });;
  
    
      this.isReady = localItems.length > 0 ? true: false;
      console.log("==>Initialized method after ready : 1");
      // this.changeDetection.detectChanges();
      //  setTimeout( () => {
      //    alert("check rendere");
      //   this.lgContainer = document.getElementById('inline-gallery-container');
      // },0);
      // 
      //    this.lgContainer = this.elementRef.nativeElement.querySelector('#inline-gallery-container');
      this.lgContainer = document.getElementById('inline-gallery-container');

      this.settings = {

        container: this.lgContainer,
        dynamic: true,
        // Turn off hash plugin in case if you are using it
        // as we don't want to change the url on slide change
        hash: false,
        // Do not allow users to close the gallery
        closable: false,
        // Add maximize icon to enlarge the gallery
        showMaximizeIcon: true,
        // Append caption inside the slide item
        // to apply some animation for the captions (Optional)
        appendSubHtmlTo: ".lg-item",
        // Delay slide transition to complete captions animations
        // before navigating to different slides (Optional)
        // You can find caption animation demo on the captions demo page
        slideDelay: 400,

        backgroundColor: "#000",
        plugins: [lgZoom, lgThumbnail],

        dynamicEl: localItems,


        // Completely optional
        // Adding as the codepen preview is usually smaller
        thumbWidth: 60,
        thumbHeight: "40px",
        thumbMargin: 4
      };


  
      this.autoLaunch(200);
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
    this.routerSubscription.unsubscribe();
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


}
