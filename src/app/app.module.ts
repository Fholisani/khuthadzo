import { BrowserModule, HammerModule, Meta } from '@angular/platform-browser';
import { NgModule, SecurityContext } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownDirective } from './shared/dropdown.directive';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './blog/home/home.component';
import { AboutComponent } from './blog/about/about.component';

import { CleanBlogHeaderComponent } from './blog/components/clean-blog-header/clean-blog-header.component';
import { CarouselConfigComponent } from './blog/components/carousel-config/carousel-config.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { PostComponent } from './blog/post/post.component';
import { PostDetailComponent } from './blog/post/post-detail/post-detail.component';
import { PostListComponent } from './blog/post/post-list/post-list.component';
import { PostEditComponent } from './blog/post/post-edit/post-edit.component';
import { PostNewComponent } from './blog/post/post-new/post-new.component';
import { PostStartComponent } from './blog/post/post-start/post-start.component';
import { ContactComponent } from './blog/contact/contact.component';
import { SearchComponent } from './blog/post/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchResultsComponent } from './blog/post/search/search-results/search-results.component';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { MarkdownModule } from 'ngx-markdown';
import 'hammerjs';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LightgalleryModule } from 'lightgallery/angular/10';
import { HandDrawingComponent } from './blog/portfolio/hand-drawing/hand-drawing.component';
import { ArchitectureComponent } from './blog/portfolio/architecture/architecture.component';
import { UploadDataComponent } from './blog/post/post-detail/upload-data/upload-data.component';

import { DropzoneDirective } from './shared/dropzone.directive';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { BlogService } from './service/blog-service.service';
import { UploadService } from './service/upload.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { UploadFormComponent } from './blog/components/upload-form/upload-form.component';
import { UploadListComponent } from './blog/components/upload-list/upload-list.component';
import { UploadDetailsComponent } from './blog/components/upload-details/upload-details.component';
import { PostImageComponent } from './blog/post/post-image/post-image.component';
import { PostImageItemComponent } from './blog/post/post-new/post-image-item/post-image-item.component';
import { ImageUploadComponent } from './blog/portfolio/image-upload/image-upload.component';
import { AlertMessageComponent } from './shared/alert-message/alert-message.component';
import { ImageUploadImplComponent } from './blog/portfolio/image-upload-impl/image-upload-impl.component';
import { FilesComponent } from './blog/files/files.component';
import { FilesListComponent } from './blog/files/files-list/files-list.component';
import { FilesDetailComponent } from './blog/files/files-detail/files-detail.component';
import { FilesStartComponent } from './blog/files/files-start/files-start.component';
import { FilesEditComponent } from './blog/files/files-edit/files-edit.component';
import { FilesItemComponent } from './blog/files/files-list/files-item/files-item.component';
import { PostBgComponent } from './blog/post/post-edit/post-bg/post-bg.component';
import { PostPtComponent } from './blog/post/post-edit/post-pt/post-pt.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { InfiniteScrollComponent } from './blog/components/infinite-scroll/infinite-scroll.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MarkdwonPipe } from './shared/markdwon.pipe';
import { ExternalLinkDirective } from './shared/external-link.directive';
import { AutosizeModule } from 'ngx-autosize';
import { MatSliderModule } from '@angular/material/slider';
import { MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareModule } from 'ngx-sharebuttons';
import {MatButtonModule} from '@angular/material/button';
import { ShareButtonsPopupModule } from 'ngx-sharebuttons/popup';

import "prismjs";
import "prismjs/components/prism-typescript.min.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-highlight/prism-line-highlight.js";
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquare as farSquare, faCheckSquare as farCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faStackOverflow, faGithub, faMedium, faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { DataStorageService } from './shared/data-storage.service';
import { VideoComponent } from './blog/portfolio/video/video.component';
import { VideoUploadComponent } from './blog/portfolio/video-upload/video-upload.component';
import { VideoUploadImplComponent } from './blog/portfolio/video-upload-impl/video-upload-impl.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DropdownDirective,
    LayoutComponent,
    HomeComponent,
    AboutComponent,
    PostComponent,
    CleanBlogHeaderComponent,
    CarouselConfigComponent,
    PostDetailComponent,
    PostListComponent,
    PostEditComponent,
    PostNewComponent,
    PostStartComponent,
    ContactComponent,
    SearchComponent,
    SearchResultsComponent,
    HandDrawingComponent,
    ArchitectureComponent,
    UploadDataComponent,
    DropzoneDirective,
    LoadingSpinnerComponent,
    AuthComponent,
    UploadFormComponent,
    UploadListComponent,
    UploadDetailsComponent,
    PostImageComponent,
    PostImageItemComponent,
    ImageUploadComponent,
    AlertMessageComponent,
    ImageUploadImplComponent,
    FilesComponent,
    FilesListComponent,
    FilesDetailComponent,
    FilesStartComponent,
    FilesEditComponent,
    FilesItemComponent,
    PostBgComponent,
    PostPtComponent,
    InfiniteScrollComponent,
    MarkdwonPipe,
    ExternalLinkDirective,
    VideoComponent,
    VideoUploadComponent,
    VideoUploadImplComponent,

   
  

 

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    AppRoutingModule,
   
    FormsModule,
    ReactiveFormsModule,
    NgxGalleryModule,
    HammerModule,
    HttpClientModule,
    LightgalleryModule,
    MDBBootstrapModule.forRoot(),


    
    MarkdownModule.forRoot({ loader: HttpClient, markedOptions: {
      provide: MarkedOptions,
      useFactory: markedOptionsFactory,
      
    }, }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    NgxPaginationModule,
    InfiniteScrollModule,
    AutosizeModule,
    
    ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareButtonsPopupModule,
    ShareIconsModule,
    ShareModule,
    MatSliderModule,
    MatButtonModule,
    FontAwesomeModule
  

 

    


   
  

  ],
  providers: [
    BlogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    UploadService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    DataStorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    Meta
   ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faSquare, faCheckSquare, farSquare, farCheckSquare, faStackOverflow, faGithub, faMedium,
      faFacebook, faTwitter, faInstagram);
  }
  
 }
// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.blockquote = (text: string) => {
    return '<blockquote class="blockquote"><p>' + text + '</p></blockquote>';
  };
  renderer.table =(header: string, body: string)=>{
    return '<div class="table-responsive"><table class="table table-hover"><thead class="thead-dark">'+ header+' </thead>' + body+ '</table></div>'
  }
  renderer.code = function (code, language) {
    if (language.match(/^mermaid/)) {
      console.log("mermaid match found use div !!!!");
      return '<div class="mermaid">' + code + '</div>';
    } else {
      console.log("mermaid match not found use pre !!!!");
      return '<pre><code>' + code + '</code></pre>';
    }
  };

  return {
    renderer: renderer,
       gfm: true,
  
    breaks: false,
    pedantic: false,

    smartLists: true,
    smartypants: false

  };
}