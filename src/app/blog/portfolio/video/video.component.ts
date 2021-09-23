import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import lgFullScreen from 'lightgallery/plugins/fullscreen'
import { AfterCloseDetail, BeforeOpenDetail } from 'lightgallery/lg-events';
import { LightGallery } from 'lightgallery/lightgallery';
import lgVideo from 'lightgallery/plugins/video';
import lgShare from 'lightgallery/plugins/share';

import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UploadService } from 'src/app/service/upload.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { GalleryImages } from 'src/app/model/post.model';
import { RemoveImg } from 'src/app/model/remove-img.model';
import { filter } from 'rxjs/operators';
import { GalleryItem } from 'lightgallery/lg-utils';
import { Attributes, Source, VideoFile, Video } from 'src/app/model/video-file.model';


declare var $: any;
declare var gtag: Function;
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements  OnInit, AfterViewInit,OnDestroy {

  private needRefresh = false;
  items: GalleryItem[];
  settings: Object;
  config: any;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  newPage: number = 0;
  isAuthenticated = false;
  private userSub: Subscription;
  private lightGallery!: LightGallery;
  private subscriptionContetFileDelete: Subscription;
  private subscriptionDelete: Subscription;
  private subscriptionVideoMasterMemoryChanged :Subscription;
  private videos: GalleryImages[] = [];
  isLoading = false;
  errorMessage: string = null;
  successMessage: string = null;
  subscription: Subscription;

  constructor(private uploadService: UploadService, private authService: AuthService,
    private dataStorageService: DataStorageService, private changeDetection: ChangeDetectorRef,
    private router: Router) { 
    this.config = {
      currentPage: 1,
      itemsPerPage: 200,
      totalItems: 0
    };
  }
 
  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.subscription.unsubscribe();
    this.subscriptionContetFileDelete.unsubscribe();
    this.subscriptionDelete.unsubscribe();
    this.subscriptionVideoMasterMemoryChanged.remove;
    this.subscriptionVideoMasterMemoryChanged.unsubscribe();
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
        gtag('config', 'UA-178909230-1', {'page_path': event.urlAfterRedirects});
      });
  }

  ngAfterViewChecked(): void {
    if (this.needRefresh) {
      this.lightGallery.refresh();
      this.needRefresh = false;
    }

  }

  ngOnInit(): void {
 
 

    this.settings = {
      download: true,
      share: true,
      counter: true,
      
      mobileSettings: {
        controls: true,
        showCloseIcon: true,
        download: true,
        rotate: true
      },
      plugins: [lgVideo, lgFullScreen, lgShare],
      videojs: true,
      videojsOptions: {
          muted: true,
          controls: true, 
          autoplay: true, 
         
      },
    }

 

    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      // console.log(!user);
      // console.log(!!user);
    });


    this.subscriptionVideoMasterMemoryChanged = this.uploadService.videosMasterMemoryChanged
    .subscribe(
      (imagesMaster: GalleryImages[]) => {
        console.log("Video Master memory has been updated to : " + imagesMaster.length);


      }
    );


this.subscriptionDelete = this.uploadService.videosChanged
  .subscribe(
    (videos: GalleryImages[]) => {
      

      if (videos.length > 0) {
        //this.config.totalItems = this.images[0].totalItems;
        this.videos = videos;
        this.newImagesAvailable();
      }

      
 
      if (this.videos.length > 0) {
        this.config.totalItems = this.videos[0].totalItems;
      }

     
    }
  );
this.subscriptionDelete = this.uploadService.imagesDeleteChanged
  .subscribe(
    (videos: GalleryImages[]) => {
      
      this.videos = videos;
      if (this.videos.length > 0) {
        this.config.totalItems = this.videos[0].totalItems;
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


this.subscriptionContetFileDelete = this.uploadService.fileImageDeleteLocalIndex.subscribe(
  (removeImg: RemoveImg) => {
    console.log("****Deleted the video file at local Index***** : " + removeImg.index);

    // this.uploadedContentImageBg = imageFileContent;
    this.onDeleteImg(removeImg, 'uploadvideo');



  }
);
this.videos = this.uploadService.getImages();
// this.newImagesAvailable();
this.dataEmit()
 
  }


  newImagesAvailable() {



    var localItems = [];
    // this.items =[];
    const videos = this.uploadService.getVideos();

    videos.forEach(element => {
      var localSource = [];
      let source = new Source(element.url,'video/mp4')  ;
      let attributes=  new Attributes(false, true);
      localSource.push(source);
      let videoObj = new Video(localSource, attributes);


      const item = new VideoFile(videoObj, element.poster,
        element.subHtml,
        element.reference,
        element.description,
    
       ) as VideoFile;

      localItems.push(item);

    });


    let videoFiles = (localItems) as GalleryImages[];

    // add another  items from the API
  
    if(this.items === undefined ||this.items.length === 0){
      this.items = videoFiles;
    }else{
      console.log("Add more items trigered by the scroll !!");
      videoFiles.forEach(element => {
        this.items = [
          ...this.items,
          element,
        ];
  
      });
    }

    // this.items = vd;
    // this.needRefresh = true;

    
   // this.items = localItems;
    this.needRefresh = true;
    this.errorMessage = null;
    this.successMessage = null;
  }

  dataEmit() {
    const imageObj = this.uploadService.getImagesAdded();


  }



  AfterClose = (detail: AfterCloseDetail): void => {
    // alert("Closing !!");
  };

  BeforeOpen = (detail: BeforeOpenDetail): void => {
   

  };
  removeVideo(index) {

    this.deleteFileUploaded(index);

  }
  deleteFileUploaded(index: number) {
    this.uploadService.deleteVideoFileUploaded(index);

  }
  Init = (detail): void => {
    //   this.items =[];
    this.lightGallery = detail.instance;

    if (/*this.isAuthenticated*/true) {
      const addBtn =
        '<button type="button" aria-label="Add slide" class="lg-icon" id="lg-add">Add</button>';
      const deleteBtn =
        '&nbsp;<button type="button" aria-label="Remove slide" class="lg-icon" id="lg-delete">R</button>&nbsp;';
      this.lightGallery.outer.find('.lg-toolbar').append(deleteBtn);
      // this.lightGallery.outer.find('.lg-toolbar').append(addBtn);

      this.lightGallery.outer.find('#lg-delete').on('click', (event: Event) => {


        let galleryItems = JSON.parse(
          JSON.stringify(this.lightGallery.galleryItems),
        );

        const index = this.lightGallery.index;
        this.removeVideo(index);
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

  onScrollDown(ev) {
    console.log("scrolled down!!", ev);

    // add another more items to the existing images
    const newPg = ++this.newPage;
    console.log("Add another more items to the existing images ==> " + newPg);

    //this.onFetchDataImg(newPg, this.config.itemsPerPage);
    // this.appendItems(start, this.sum);

    // this.direction = "down";
    // alert("Scrolling!!!");
  }


  onDeleteImg(removeImg: RemoveImg, componentUploadingImg) {
    this.subscription = this.dataStorageService.deleteUploadVideo(removeImg.galleryImage)
      .subscribe(
        response => {

          if (componentUploadingImg === 'uploadvideo') {
            this.videos.splice(removeImg.index, 1);
            this.items.splice(removeImg.index, 1);
            this.changeDetection.detectChanges();
            console.log("Remove Images and item index : " + removeImg.index);
          }

          this.uploadService.setLoadingIndicator(false);
          this.uploadService.setSuccessMessage("Successfully deleted the Vodeo!!");
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

}
