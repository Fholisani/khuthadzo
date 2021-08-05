import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { IconsModule } from './icons/icons.module';
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
  

 

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    AppRoutingModule,
    IconsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxGalleryModule,
    HammerModule,
    HttpClientModule,
    LightgalleryModule,
    MDBBootstrapModule.forRoot(),
    MarkdownModule.forRoot({ loader: HttpClient }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule
  

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
   ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
