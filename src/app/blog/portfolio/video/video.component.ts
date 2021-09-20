import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import lgFullScreen from 'lightgallery/plugins/fullscreen'
import { AfterCloseDetail, BeforeOpenDetail } from 'lightgallery/lg-events';
import { LightGallery } from 'lightgallery/lightgallery';
import lgVideo from 'lightgallery/plugins/video';
import lgShare from 'lightgallery/plugins/share';
import { GalleryItem } from 'lightgallery/lg-utils';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UploadService } from 'src/app/service/upload.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

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

  constructor(private uploadService: UploadService, private authService: AuthService,
    private dataStorageService: DataStorageService, private changeDetection: ChangeDetectorRef,
    private router: Router) { 
    this.config = {
      currentPage: 1,
      itemsPerPage: 200,
      totalItems: 0
    };
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  ngAfterViewInit(): void {
   
  }
  ngAfterViewChecked(): void {
    if (this.needRefresh) {
      this.lightGallery.refresh();
      this.needRefresh = false;
    }

  }

  ngOnInit(): void {
 
    let vd = ([
      
      {
        video: {
          source: [
            {
              src: 'https://www.lightgalleryjs.com//videos/video1.mp4',
              type: 'video/mp4'
            }
          ],
          attributes: { preload: false, controls: true, width: 640,
          height: 480 }
        },
        thumb:
          'https://www.lightgalleryjs.com//images/demo/html5-video-poster.jpg',
        subHtml: `<div class="lightGallery-captions">
                  <h4>Photo by <a href="https://unsplash.com/@brookecagle">Brooke Cagle</a></h4>
                  <p>Description of the slide 2</p>
              </div>`
      }
    ] as unknown) as GalleryItem[];

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

    this.items = vd;
    this.needRefresh = true;


    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      // console.log(!user);
      // console.log(!!user);
    });
 
  }
  AfterClose = (detail: AfterCloseDetail): void => {
    // alert("Closing !!");
  };

  BeforeOpen = (detail: BeforeOpenDetail): void => {
   

  };

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
        //this.removeImage(index);
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

}
