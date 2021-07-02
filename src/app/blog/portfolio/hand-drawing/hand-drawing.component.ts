import { Component, OnInit } from '@angular/core';
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgFullScreen from 'lightgallery/plugins/fullscreen'
import lgAutoplay from 'lightgallery/plugins/autoplay'
import { BeforeSlideDetail } from 'lightgallery/lg-events';
import { LightGallery } from 'lightgallery/lightgallery';
import { InitDetail } from 'lightgallery/lg-events';
import lgZoom from 'lightgallery/plugins/zoom';
import { GalleryItem } from 'src/app/model/gallery-item.model';
declare var $: any;

@Component({
  selector: 'app-hand-drawing',
  templateUrl: './hand-drawing.component.html',
  styleUrls: ['./hand-drawing.component.css']
})
export class HandDrawingComponent implements OnInit {

  private needRefresh = false;
  items: GalleryItem[];
  settings: Object;
  private lightGallery!: LightGallery;
  constructor() { }

 

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
  

    this.items = [
      {
        id: '1',
        size: '1400-933',
        src:
          'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        thumb:
          'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
        subHtml: `<div class="lightGallery-captions">
              <h4>Photo by <a href="https://unsplash.com/@dann">Dan</a></h4>
              <p>Published on November 13, 2018</p>
          </div>`
      },
      {
        id: '2',
        size: '1400-933',
        src:
          'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        thumb:
          'https://images.unsplash.com/photo-1473876988266-ca0860a443b8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80',
        subHtml: `<div class="lightGallery-captions">
              <h4>Photo by <a href="https://unsplash.com/@kylepyt">Kyle Peyton</a></h4>
              <p>Published on September 14, 2016</p>
          </div>`
      },
      {
        id: '3',
        size: '1400-932',
        src:
          'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1400&q=80',
        thumb:
          'https://images.unsplash.com/photo-1588953936179-d2a4734c5490?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=240&q=80',
        subHtml: `<div class="lightGallery-captions">
              <h4>Photo by <a href="https://unsplash.com/@jxnsartstudio">Garrett Jackson</a></h4>
              <p>Published on May 8, 2020</p>
          </div>`
      }
    ];




  }


  onInit = (detail): void => {
    this.lightGallery = detail.instance;
    console.log("Initiated ");
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
}
