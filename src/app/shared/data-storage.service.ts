import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from '../model/post.model';
import { BlogService } from '../service/blog-service.service';
import { UploadService } from '../service/upload.service';
import { Image } from '../model/image.model';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  url = 'https://ng-course-recipe-book-b8129-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient, private blogService: BlogService,
    private uploadService: UploadService,
    private authService: AuthService) { }


  storePosts() : Observable<undefined | Error>{
    
    this.blogService.setLoadingIndicator(true);
    const posts = this.blogService.getPostsAdded();
    return this.http
      .put<undefined>(
        `${this.url}/posts.json`,
        posts
      ).pipe(
        tap(response => {
        console.log(response);
        

      }),
      map(response => response));
      // .subscribe(
      //   response => {
      //     console.log(response);
      //     this.blogService.cleanPosts()
      //     this.blogService.setLoadingIndicator(false);
      //   },
      //   err => {
      //     console.log('HTTP Error', err)
      //     let errMsg = `error in ${err}() retrieving ${this.url}`;
      //     this.blogService.setLoadingIndicator(false);
          
      //   });
  }

  fetchPosts() {
    this.blogService.setLoadingIndicator(true);
    return this.http
      .get<Post[]>(
        `${this.url}/posts.json`
      )
      .pipe(
        map(posts => {
          return posts.map(post => {
            return {
              ...post,
              galleryImages: post.galleryImages ? post.galleryImages : []
            };
          });
        }),
        tap(posts => {
          console.log("Fetching post...");
          
        }),
        catchError(this.handleError)
      )
  }


  storeImage() : Observable<undefined | Error> {
    this.uploadService.setLoadingIndicator(true);
    const images = this.uploadService.getImagesAdded();
    return this.http
      .put<undefined>(
        `${this.url}/images.json`,
        images
      ).pipe(
        tap(response => {
        console.log(response);
    
      }),
      map(response => response));
      // .subscribe(response => {
      //   console.log(response);
      //   this.uploadService.cleanImages()
      //   this.uploadService.setLoadingIndicator(false);
      // },
      // err => {
      //   console.log('HTTP Error', err)
      //   this.handleError(err)
      // });
  }

  fetchImages() {
    this.uploadService.setLoadingIndicator(true);
    return this.http
      .get<Image[]>(
        `${this.url}/images.json`
      )
      .pipe(
        map(images => {
          return images.map(image => {
            return {
              ...image,
              imageUrl: image.imageUrl ? 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80' :
                'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80'
            };
          });
        }),
        tap(images => {
          console.log("Fetching images...");
        
        }),
        catchError(this.handleError)
      )
  }



  // private handleError(operation: String) {
  //   return (err: any) => {
  //     let errMsg = `error in ${operation}() retrieving ${this.url}`;
  //     console.log(`${errMsg}:`, err)
  //     if (err instanceof HttpErrorResponse) {
  //       // you could extract more info about the error if you want, e.g.:
  //       console.log(`status: ${err.status}, ${err.statusText}`);
  //       // errMsg = ...
  //     }
  //     return throwError(errMsg);
  //   }
  // }
  private handleError(errorRes: HttpErrorResponse){
    let errorMessage = "An unkonwn error occured";
    console.log("Error - " + errorRes);
      if(!errorRes.error || !errorRes.error.error){
        errorMessage = errorRes.message;
        return throwError(errorMessage);
      }
     
  
      return throwError(errorMessage);

  }
}
