import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, finalize, last, map, switchMap, tap } from 'rxjs/operators';
import { Post } from '../model/post.model';
import { BlogService } from '../service/blog-service.service';
import { UploadService } from '../service/upload.service';
import { Image, ImageUrl } from '../model/image.model';
import { Observable, Subject } from 'rxjs';
import { throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  url = 'https://ng-course-recipe-book-b8129-default-rtdb.firebaseio.com';
  imageUrl = 'http://127.0.0.1:8432';
  private basePath = '/uploads';
  private basePathLocal = '/blogger/image/v1';
  serviceTwo: any;
  searchString: Subject<string> = new Subject();
  searchString$: Observable<string> = this.searchString.asObservable();



  constructor(private http: HttpClient, private blogService: BlogService,
    private uploadService: UploadService,
    private authService: AuthService, private db: AngularFireDatabase,
    private storage: AngularFireStorage) { }


  storePosts(): Observable<undefined | Error> {

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
          this.blogService.setPosts(posts);
          this.blogService.setLoadingIndicator(false);

        }),
        catchError(this.handleError)
      )
  }



  saveImages(): Observable<unknown | Error> {

    const images = this.uploadService.getImagesAdded();
    const finalImages = [];
    const calls = [];
    this.uploadService.setLoadingIndicator(true);
    images.forEach(element => {

      calls.push(this.pushFileImageToStorageLocal(element)
        .pipe(
          
          //Use switchMap to call another API(s)
          switchMap((responses: ImageUrl[]) => {
            //Lets map so to an observable of API call
            element.imageUrls = responses;
            finalImages.push(element);
            console.log("Element data : " + JSON.stringify(element));
            //  const allObs$ = this.storeImage(element);///element.map(so => this.storeImage(element));

            const allObs$ = this.storeImage(finalImages);
            //forkJoin will wait for the response to come for all of the observables
            return allObs$;
          }),
          map(response => {
            console.log('PushED images Map : ' + response);

            return response;//;new ImageUrl(imageElement.image.name, message)
          }),
          catchError(this.handleError)
        ));
    });
    return forkJoin(calls);

  }

  storeImage(image: Image[]): Observable<undefined | Error> {
    this.uploadService.setLoadingIndicator(true);
    console.log("Image data : " + JSON.stringify(image));
    return this.http
      .put<undefined>(
        `${this.url}/images.json`,
        image
      ).pipe(
        tap(response => {
          console.log(response);

        }),
        map(response => response));

  }

  pushFileImageToStorage(fileUpload: Image) {

    console.log('Push images');
    const calls = [];


    fileUpload.images.forEach(imageElement => {

      const filePath = `${this.basePath}/${imageElement.image.name}`;
      const storageRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, imageElement.image);

      calls.push(uploadTask.snapshotChanges().pipe(
        last(),
        switchMap(() => storageRef.getDownloadURL()),
        tap(response => {
          console.log('PushED images Tap');
          console.log(response);

        }),
        map(response => {
          console.log('PushED images Map');
          // fileUpload.imageUrls.push(new ImageUrl(imageElement.image.name, response));

          return new ImageUrl(imageElement.image.name, response,"")
        }),
        catchError(this.handleError)

      ));


    });

    return forkJoin(calls);


  }

  upload(file: File): Observable<HttpEvent<any>> {
    console.log('Push images Local instances');
    const formData: FormData = new FormData();

    formData.append('image', file);

    const req = new HttpRequest('POST', `${this.imageUrl}/blogger/image/v1`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
  pushFileImageToStorageLocal(fileUpload: Image) {

    console.log('Push images Local');
    //TODO will this code return the object with updated image URL ?

    const calls = [];
    let progress = 0;

    fileUpload.images.forEach(imageElement => {

      calls.push(this.upload(imageElement.image).pipe(

        tap(response => {
          console.log('PushED images Tap');
          console.log(response);

        }),
        filter(response => response.type === HttpEventType.Response),
        map(response => {
          console.log('PushED images Map type ' + response.type);
          let message = '';
          if (response.type === HttpEventType.Response) {
            message = response.body;
            console.log('Locate image URL : ' + message);
          
          }

          return new ImageUrl(imageElement.image.name, message,"")
          
        }),
        catchError(this.handleError)

      ));





    });
    return forkJoin(calls);

  }

  fetchImages(portfolioType : String) {
    this.uploadService.setLoadingIndicator(true);
    console.log("Pulling images of portfolio type : " + portfolioType);
    return this.http
      .get<Image[]>(
        `${this.url}/images.json`
      )
      .pipe(
        map(images => {
          return images.map(image => {
            return {
              ...image,
              imageUrl: image.imageUrls[0].url
              // imageUrl: image.imageUrl ? 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80' :
              //   'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80'
            };
          });
        }),
        tap(images => {
          console.log("Fetching images..." + images);

        }),
        catchError(this.handleError)
      )
  }



  contactUs(formData: any): Observable<undefined | Error> {
    this.blogService.setLoadingIndicator(true);

    return this.http
      .put<undefined>(
        `${this.url}/contact.json`,
        formData
      ).pipe(
        tap(response => {
          console.log(response);

        }),
        map(response => response),
        catchError(this.handleError));


  }
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "An unkonwn error occured";
    console.log("Error - " + errorRes);
    if (!errorRes.error || !errorRes.error.error) {
      errorMessage = errorRes.message;

      return throwError(errorMessage);
    }


    return throwError(errorMessage);

  }
}
