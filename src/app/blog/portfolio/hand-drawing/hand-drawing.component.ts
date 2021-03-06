import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgFullScreen from 'lightgallery/plugins/fullscreen'
import lgAutoplay from 'lightgallery/plugins/autoplay'
import { AfterCloseDetail, BeforeOpenDetail, BeforeSlideDetail } from 'lightgallery/lg-events';
import { LightGallery } from 'lightgallery/lightgallery';
import { InitDetail } from 'lightgallery/lg-events';
import lgZoom from 'lightgallery/plugins/zoom';
import { GalleryItem } from 'src/app/model/gallery-item.model';
import { Image } from 'src/app/model/image.model';
import { UploadService } from 'src/app/service/upload.service';
import { Subscription } from 'rxjs';
import { GalleryImages, Post } from 'src/app/model/post.model';
import { OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { RemoveImg } from 'src/app/model/remove-img.model';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AfterViewInit } from '@angular/core';
import lgShare from 'lightgallery/plugins/share';
declare var $: any;
declare var gtag: Function;
@Component({
  selector: 'app-hand-drawing',
  templateUrl: './hand-drawing.component.html',
  styleUrls: ['./hand-drawing.component.scss']
})
export class HandDrawingComponent implements OnInit,AfterViewInit, OnDestroy {

  private needRefresh = false;
  items: GalleryItem[];
  settings: Object;
  private lightGallery!: LightGallery;
  private images: GalleryImages[] = [];
  subscription: Subscription;

  numberOfPosts: number;
  isPostAvailable = false;
  isCreatePost: boolean;;

  isImageUpload = true;
  isImgAvailable: boolean;

  isCreateImg = false;

  isLoading = false;
  errorMessage: string = null;
  successMessage: string = null;
  private userSub: Subscription;
  isAuthenticated = false;
  portfolioType: string = 'Hand-Drawing';
  private subscriptionContetFileDelete: Subscription;
  private subscriptionDelete: Subscription;
  private subscriptionHandImagesMasterMemoryChanged :Subscription;
  count: number = 1;
  config: any;
  sum = 100;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  newPage: number =0;



  constructor(private uploadService: UploadService, private authService: AuthService,
    private dataStorageService: DataStorageService, private changeDetection: ChangeDetectorRef,
    private router: Router) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 200,
      totalItems: 0
    };
  }

  ngOnInit(): void {



    this.settings = {
      addClass: "lg-update-slide-demo",
      autoplayFirstVideo: false,
      pager: false,
      galleryId: "nature",
      thumbnail: true,
      download: true,
      share: true,
      counter: true,
      plugins: [lgZoom, lgThumbnail, lgFullScreen, lgAutoplay, lgShare],
      mobileSettings: {
        controls: true,
        showCloseIcon: true,
        download: true,
        rotate: true
      },
    }

     
        this.subscriptionHandImagesMasterMemoryChanged = this.uploadService.imagesHandMasterMemoryChanged
        .subscribe(
          (imagesMaster: GalleryImages[]) => {
            console.log("Hand drawing Master memory has been updated to : " + imagesMaster.length);
  
  
          }
        );
  

    this.subscriptionDelete = this.uploadService.imagesHandDrawingChanged
      .subscribe(
        (images: GalleryImages[]) => {
          console.log("Count number(imagesChanged) of times : " + (this.count++));

          if (images.length > 0) {
            //this.config.totalItems = this.images[0].totalItems;
            this.images = images;
            this.newImagesAvailable();
          }

          
     
          if (this.images.length > 0) {
            this.config.totalItems = this.images[0].totalItems;
          }

         
        }
      );
    this.subscriptionDelete = this.uploadService.imagesDeleteChanged
      .subscribe(
        (images: GalleryImages[]) => {
          console.log("Count number(imagesDeleteChanged) of times : " + (this.count++));
          this.images = images;
          if (this.images.length > 0) {
            this.config.totalItems = this.images[0].totalItems;
          }



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

    this.subscriptionContetFileDelete = this.uploadService.fileImageDeleteLocalIndex.subscribe(
      (removeImg: RemoveImg) => {
        console.log("****Deleted the image file at local Index***** : " + removeImg.index);

        // this.uploadedContentImageBg = imageFileContent;
        this.onDeleteImg(removeImg, 'upload');



      }
    );
    this.images = this.uploadService.getImages();
    // this.newImagesAvailable();
    this.dataEmit()

  }


  newImagesAvailable() {
    var localItems = [];
    // this.items =[];
    const images = this.uploadService.getHandDrawingImages();

    images.forEach(element => {


      const item = new GalleryItem(element.reference + '', element.size,
        element.url,
        element.small,
        element.subHtml);;
      localItems.push(item);
    });;


    // add another  items from the API
  
    if(this.items === undefined ||this.items.length === 0){
      this.items = localItems;
    }else{
      console.log("Add more iterms trigered by the scroll !!");
      localItems.forEach(element => {
        this.items = [
          ...this.items,
          element,
        ];
  
      });
    }
    
   // this.items = localItems;
    this.needRefresh = true;
    this.errorMessage = null;
    this.successMessage = null;
  }

  dataEmit() {
    const imageObj = this.uploadService.getImagesAdded();
    this.numberOfPosts = 0;
    this.isImgAvailable = false;

  }

  addItems(startIndex, endIndex, _method) {
    // for (let i = 0; i < this.sum; ++i) {
    //   this.array[_method]([i, " ", this.generateWord()].join(""));
    // }
    this.images.forEach(element => {

    });
  }
  removeImage(index) {

    this.deleteFileUploaded(index);

  }
  deleteFileUploaded(index: number) {
    this.uploadService.deleteFileUploadedHandDrawing(index);

  }

  Init = (detail): void => {
    //   this.items =[];
    this.lightGallery = detail.instance;

    if (this.isAuthenticated) {
      const addBtn =
        '<button type="button" aria-label="Add slide" class="lg-icon" id="lg-add">Add</button>';
      const deleteBtn =
        '<button type="button" aria-label="Remove slide" class="lg-icon" id="lg-delete">R</button>';
      this.lightGallery.outer.find('.lg-toolbar').append(deleteBtn);
      // this.lightGallery.outer.find('.lg-toolbar').append(addBtn);

      this.lightGallery.outer.find('#lg-delete').on('click', (event: Event) => {


        let galleryItems = JSON.parse(
          JSON.stringify(this.lightGallery.galleryItems),
        );

        const index = this.lightGallery.index;
        this.removeImage(index);
        console.log(galleryItems[index]);
        const itemDelete = galleryItems[index];

        // Delete first item
        galleryItems.shift();


        // Pass the modified gallery items via updateSlides method
        // the second parameter is the index of the slide
        // to determine which slide lightGallery should navigate to after deleting current items
        this.lightGallery.updateSlides(galleryItems, 1);

        let slidesUpdated = true;

      });
    }


  };
  AfterClose = (detail: AfterCloseDetail): void => {
    // alert("Closing !!");
  };

  BeforeOpen = (detail: BeforeOpenDetail): void => {
    if (this.successMessage) {
      this.successMessage = null;
    }

  };
  ngAfterViewChecked(): void {
    if (this.needRefresh) {
      this.lightGallery.refresh();
      this.needRefresh = false;
    }
  }


  onDeleteImg(removeImg: RemoveImg, componentUploadingImg) {
    this.subscription = this.dataStorageService.deleteUploadImage(removeImg.galleryImage)
      .subscribe(
        response => {

          if (componentUploadingImg === 'upload') {
            this.images.splice(removeImg.index, 1);
            this.items.splice(removeImg.index, 1);
            this.changeDetection.detectChanges();
            console.log("Remove Images and item index : " + removeImg.index);
          }

          this.uploadService.setLoadingIndicator(false);
          this.uploadService.setSuccessMessage("Successfully deleted the picture!!");
          this.uploadService.setErrorMessage(null);

          this.needRefresh = true;



        },
        errorMessage => {
          console.log('HTTP Error', errorMessage)
          let errMsg = `Unable to delete due to `;
          if (errorMessage == undefined) {

            errMsg += ' service unavailable! '
          } else {
            errMsg += `${errorMessage.message}`
          }

          this.uploadService.setErrorMessage(errMsg);
          this.uploadService.setSuccessMessage(null);
          this.uploadService.setLoadingIndicator(false);



        });
  }
  jquerySupport() {

    $(".animated-thumbnails-gallery")
      .justifiedGallery({
        captions: false,
        lastRow: "hide",
        rowHeight: 180,
        margins: 5
      });



  }

  pageChange(newPage: number) {
    // console.log("Paging : " + newPage);
    // this.config.currentPage = newPage;
    // this.onFetchDataImgHandDrawing(newPage - 1, this.config.itemsPerPage);
    // this.router.navigate([''], { queryParams: { page: newPage } });
  }

  onFetchDataImgHandDrawing(pageNo: number, pageSize: number) {

    this.dataStorageService.fetchImages('HandDrawing', pageNo, pageSize).subscribe((images: GalleryImages[]) => {
   //   console.log('HTTP IMG' + images)

  
    //this.config.totalItems = this.images[0].totalItems;
     this.uploadService.setHandDrawingImages(images);

    
      this.uploadService.setLoadingIndicator(false);
    }, errorMessage => {

      console.log('HTTP Error', errorMessage)
      let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
      this.uploadService.setErrorMessage(errMsg);
      this.uploadService.setLoadingIndicator(false);
    });
  }
  onScrollDown(ev) {
    console.log("scrolled down!!", ev);

    // add another more items to the existing images
    const newPg = ++this.newPage;
    console.log("Add another more items to the existing images ==> " + newPg);

    this.onFetchDataImgHandDrawing( newPg, this.config.itemsPerPage);
    // this.appendItems(start, this.sum);

    // this.direction = "down";
    // alert("Scrolling!!!");
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionContetFileDelete.unsubscribe();
    this.subscriptionDelete.unsubscribe();
    this.subscriptionHandImagesMasterMemoryChanged.remove;
    this.subscriptionHandImagesMasterMemoryChanged.unsubscribe();
    if(this.routerSubscription){
      this.routerSubscription.unsubscribe();
    }
  }

  private routerSubscription: Subscription;
  ngAfterViewInit(): void {
    // subscribe to router events and send page views to Google Analytics
   
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('config', 'G-TE5MPGC93J', {'page_path': event.urlAfterRedirects});
      });
  }


}
