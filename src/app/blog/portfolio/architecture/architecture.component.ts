import { Component, OnInit, VERSION, ViewEncapsulation } from '@angular/core';
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgFullScreen from 'lightgallery/plugins/fullscreen'
import lgAutoplay from 'lightgallery/plugins/autoplay'
import { BeforeSlideDetail } from 'lightgallery/lg-events';
import { LightGallery } from 'lightgallery/lightgallery';
import { InitDetail } from 'lightgallery/lg-events';
import { GalleryItem } from 'src/app/model/gallery-item.model';
import { Image } from 'src/app/model/image.model';
import { UploadService } from 'src/app/service/upload.service';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
declare var $: any;



@Component({
  selector: 'app-architecture',
  templateUrl: './architecture.component.html',
  styleUrls: ['./architecture.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ArchitectureComponent implements OnInit, OnDestroy {

  private needRefresh = false;
  items: GalleryItem[];
  settings: Object;
  private lightGallery!: LightGallery;
  private images: Image[] = [];
  subscription: Subscription;
  numberOfPosts: number;
  isPostAvailable = false;
  isCreatePost: boolean;;

  isImageUpload=true;
  isImgAvailable: boolean;

  isCreateImg=false;

  isLoading = false;
  errorMessage: string=null;
  successMessage: string=null;
  private userSub: Subscription;
  isAuthenticated = false;
  portfolioType: string = 'Architecture';



  constructor(private uploadService: UploadService, private authService: AuthService) { }



  ngOnInit(): void {

    this.settings = {
      addClass: "animated-thumbnails-gallery",
      autoplayFirstVideo: false,
      pager: false,
      galleryId: "nature",
      plugins: [lgZoom, lgThumbnail, lgFullScreen, lgAutoplay],
      mobileSettings: {
        controls: true,
        showCloseIcon: true,
        download: true,
        rotate: true
      },
    }


    // this.items = [
    //   {
    //     id: '1',
    //     size: '1400-933',
    //     src:
    //       'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    //     thumb:
    //       'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    //     subHtml: `<div class="lightGallery-captions">
    //           <h4>Photo by <a href="https://unsplash.com/@dann">Dan</a></h4>
    //           <p>Published on November 13, 2018</p>
    //       </div>`
    //   },
    //   {
    //     id: '2',
    //     size: '1400-933',
    //     src:
    //       'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
    //     thumb:
    //       'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
    //     subHtml: `<div class="lightGallery-captions">
    //           <h4>Photo by <a href="https://unsplash.com/@kylepyt">Kyle Peyton</a></h4>
    //           <p>Published on September 14, 2016</p>
    //       </div>`
    //   },
    //   {
    //     id: '3',
    //     size: '1400-932',
    //     src:
    //       'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
    //     thumb:
    //       'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
    //     subHtml: `<div class="lightGallery-captions">
    //           <h4>Photo by <a href="https://unsplash.com/@jxnsartstudio">Garrett Jackson</a></h4>
    //           <p>Published on May 8, 2020</p>
    //       </div>`
    //   }
    // ];


    this.subscription = this.uploadService.imagesChanged
    .subscribe(
      (images: Image[]) => {
        this.images = images;
        this.newImagesAvailable();
      }
    );

  this.subscription = this.uploadService.imagesAdded
    .subscribe(
      (images: Image) => {
        this.dataEmit();
      }
    );

    this.subscription = this.uploadService.isLoadingChanged
    .subscribe(
      (isLoading: boolean) => {
       this.isLoading = isLoading;
      }
    );

    this.subscription = this.uploadService.errorMessageChanged
    .subscribe(
      (errorMessage: string) => {
        this.errorMessage = errorMessage;
      }
    );
    this.subscription = this.uploadService.successMessageChanged
    .subscribe(
      (successMessage: string) => {
        this.successMessage = successMessage;
      }
    );

    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      console.log(!user);
      console.log(!!user);
    });

    this.images = this.uploadService.getImages();
    this.newImagesAvailable();
    this.dataEmit()



  }

  newImagesAvailable(){
    var localItems = [];
    this.images.forEach(element => {
      // const item = new GalleryItem(element.id.toString(), '11400-933',
      // element.imageUrl,
      // 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80', 
      //  `<div class="lightGallery-captions">
      // <h4>Photo by <a href="https://unsplash.com/@jxnsartstudio">Garrett Jackson</a></h4>
      // <p>Published on May 8, 2020</p></div>`);
      
           const item = new GalleryItem(element.id.toString(), '11400-933',
      element.imageUrl,
      element.imageUrls[0].url + '?size=medium', 
       `<div class="lightGallery-captions">
      <h4>Photo by <a href="https://unsplash.com/@jxnsartstudio">Garrett Jackson</a></h4>
      <p>Published on May 8, 2020</p></div>`);
      localItems.push(item);
    });

    this.items = localItems;
    this.needRefresh = true;
    this.errorMessage=null;
    this.successMessage=null;
  }

  dataEmit() {
    const imageObj = this.uploadService.getImagesAdded();
    this.numberOfPosts = 0;
    this.isImgAvailable = false;
   
    // if (images.length > 0) {
    //   this.numberOfPosts = images.length;
    //   this.isImgAvailable = true;
    // } else {
    //   this.numberOfPosts = 0;
    //   this.isImgAvailable = false;
    // }
  }


  removeImage(index) {
    alert("About to delete item id : " + index);
    this.uploadService.deleteImage(index);
    this.needRefresh = true;
  }
  onInit = (detail): void => {
    this.lightGallery = detail.instance;

    //this.jquerySupport();
  };

  ngAfterViewChecked(): void {
    if (this.needRefresh) {
      this.lightGallery.refresh();
      this.needRefresh = false;
    }
  }
  addImage = () => {
    this.items = [
      ...this.items,
      {
        id: '4',
        size: '1400-933',
        src:
          'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
        thumb:
          'https://images.unsplash.com/photo-1609902726285-00668009f004?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
        subHtml: `<div class="lightGallery-captions">
            <h4>Photo by <a href="https://unsplash.com/@bruno_adam">Bruno Adam</a></h4>
            <p>Published on January 6, 2021</p>
        </div>`
      }
    ];
    this.needRefresh = true;
  };

  jquerySupport() {

    $(".animated-thumbnails-gallery")
      .justifiedGallery({
        captions: false,
        lastRow: "hide",
        rowHeight: 180,
        margins: 5
      });



  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
