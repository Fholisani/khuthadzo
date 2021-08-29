import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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


@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit, OnDestroy {
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


  constructor(private blogService: BlogService, private route: ActivatedRoute,
    private router: Router, private authService: AuthService,
    private dataStorageService: DataStorageService, private elementRef: ElementRef,
    private changeDetection: ChangeDetectorRef) { }




  ngOnInit(): void {


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
  }
 DialogText ="# Dillinger\n## _The Last Markdown Editor, Ever_\n\n[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)\n\n[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)\n\nDillinger is a cloud-enabled, mobile-ready, offline-storage compatible,\nAngularJS-powered HTML5 Markdown editor.\n\n- Type some Markdown on the left\n- See HTML in the right\n- ✨Magic ✨\n\n## Features\n\n- Import a HTML file and watch it magically convert to Markdown\n- Drag and drop images (requires your Dropbox account be linked)\n- Import and save files from GitHub, Dropbox, Google Drive and One Drive\n- Drag and drop markdown and HTML files into Dillinger\n- Export documents as Markdown, HTML and PDF\n\nMarkdown is a lightweight markup language based on the formatting conventions\nthat people naturally use in email.\nAs [John Gruber] writes on the [Markdown site][df1]\n\n> The overriding design goal for Markdown's\n> formatting syntax is to make it as readable\n> as possible. The idea is that a\n> Markdown-formatted document should be\n> publishable as-is, as plain text, without\n> looking like it's been marked up with tags\n> or formatting instructions.\n\nThis text you see here is *actually- written in Markdown! To get a feel\nfor Markdown's syntax, type some text into the left window and\nwatch the results in the right.\n\n## Tech\n\nDillinger uses a number of open source projects to work properly:\n\n- [AngularJS] - HTML enhanced for web apps!\n- [Ace Editor] - awesome web-based text editor\n- [markdown-it] - Markdown parser done right. Fast and easy to extend.\n- [Twitter Bootstrap] - great UI boilerplate for modern web apps\n- [node.js] - evented I/O for the backend\n- [Express] - fast node.js network app framework [@tjholowaychuk]\n- [Gulp] - the streaming build system\n- [Breakdance](https://breakdance.github.io/breakdance/) - HTML\nto Markdown converter\n- [jQuery] - duh\n\nAnd of course Dillinger itself is open source with a [public repository][dill]\n on GitHub.\n\n## Installation\n\nDillinger requires [Node.js](https://nodejs.org/) v10+ to run.\n\nInstall the dependencies and devDependencies and start the server.\n\n```sh\ncd dillinger\nnpm i\nnode app\n```\n\nFor production environments...\n\n```sh\nnpm install --production\nNODE_ENV=production node app\n```\n\n## Plugins\n\nDillinger is currently extended with the following plugins.\nInstructions on how to use them in your own application are linked below.\n\n| Plugin | README |\n| ------ | ------ |\n| Dropbox | [plugins/dropbox/README.md][PlDb] |\n| GitHub | [plugins/github/README.md][PlGh] |\n| Google Drive | [plugins/googledrive/README.md][PlGd] |\n| OneDrive | [plugins/onedrive/README.md][PlOd] |\n| Medium | [plugins/medium/README.md][PlMe] |\n| Google Analytics | [plugins/googleanalytics/README.md][PlGa] |\n\n## Development\n\nWant to contribute? Great!\n\nDillinger uses Gulp + Webpack for fast developing.\nMake a change in your file and instantaneously see your updates!\n\nOpen your favorite Terminal and run these commands.\n\nFirst Tab:\n\n```sh\nnode app\n```\n\nSecond Tab:\n\n```sh\ngulp watch\n```\n\n(optional) Third:\n\n```sh\nkarma test\n```\n\n#### Building for source\n\nFor production release:\n\n```sh\ngulp build --prod\n```\n\nGenerating pre-built zip archives for distribution:\n\n```sh\ngulp build dist --prod\n```\n\n## Docker\n\nDillinger is very easy to install and deploy in a Docker container.\n\nBy default, the Docker will expose port 8080, so change this within the\nDockerfile if necessary. When ready, simply use the Dockerfile to\nbuild the image.\n\n```sh\ncd dillinger\ndocker build -t <youruser>/dillinger:${package.json.version} .\n```\n\nThis will create the dillinger image and pull in the necessary dependencies.\nBe sure to swap out `${package.json.version}` with the actual\nversion of Dillinger.\n\nOnce done, run the Docker image and map the port to whatever you wish on\nyour host. In this example, we simply map port 8000 of the host to\nport 8080 of the Docker (or whatever port was exposed in the Dockerfile):\n\n```sh\ndocker run -d -p 8000:8080 --restart=always --cap-add=SYS_ADMIN --name=dillinger <youruser>/dillinger:${package.json.version}\n```\n\n> Note: `--capt-add=SYS-ADMIN` is required for PDF rendering.\n\nVerify the deployment by navigating to your server address in\nyour preferred browser.\n\n```sh\n127.0.0.1:8000\n```\n\n## License\n\nMIT\n\n**Free Software, Hell Yeah!**\n\n[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)\n\n   [dill]: <https://github.com/joemccann/dillinger>\n   [git-repo-url]: <https://github.com/joemccann/dillinger.git>\n   [john gruber]: <http://daringfireball.net>\n   [df1]: <http://daringfireball.net/projects/markdown/>\n   [markdown-it]: <https://github.com/markdown-it/markdown-it>\n   [Ace Editor]: <http://ace.ajax.org>\n   [node.js]: <http://nodejs.org>\n   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>\n   [jQuery]: <http://jquery.com>\n   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>\n   [express]: <http://expressjs.com>\n   [AngularJS]: <http://angularjs.org>\n   [Gulp]: <http://gulpjs.com>\n\n   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>\n   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>\n   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>\n   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>\n   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>\n   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>\n" ;


}
