import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, last, map, switchMap, tap } from 'rxjs/operators';
import { Post } from '../model/post.model';
import { BlogService } from '../service/blog-service.service';
import { UploadService } from '../service/upload.service';
import { Image, ImageUrl } from '../model/image.model';
import { Observable } from 'rxjs';
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
  private basePath = '/uploads';
  serviceTwo: any;



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
          this.blogService.setPosts(posts);
          this.blogService.setLoadingIndicator(false);

        }),
        catchError(this.handleError)
      )
  }



  saveImages(): Observable<unknown[] | Error>{


    // this.serviceOne.getAllServiceOneData()
    //     .pipe(
    //       //Use switchMap to call another API(s)
    //       switchMap((dataFromServiceOne) => {
    //         //Lets map so to an observable of API call
    //         const allObs$ = dataFromServiceOne.map(so => this.serviceTwo.getAllServiceTwoData(so.id.toString()));

    //         //forkJoin will wait for the response to come for all of the observables
    //         return forkJoin(allObs$);
    //       })
    //     ).subscribe((forkJoinResponse) => {
    //       //forkJoinResponse will be an array of responses for each of the this.serviceTwo.getAllServiceTwoData CALL
    //       //Do whatever you want to do with this array
    //       console.log(forkJoinResponse);
    //     });

    const images = this.uploadService.getImagesAdded();
    const finalImages = [];
    const calls = [];
    this.uploadService.setLoadingIndicator(true);
    images.forEach(element => {

     calls.push(this.pushFileImageToStorage(element)
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
        })
      ));
      
      // .subscribe((responses) => {
      //   console.log('Test results : ' + responses);

        
      // });
   

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

  pushFileImageToStorage(fileUpload: Image) {

    console.log('Push images');
    //TODO will this code return the object with updated image URL ?

    const calls = [];
    // this.attachToDelete.forEach(element => {
    //   calls.push(this.documentService.DeleteAttachment(element, this.newDocumentId.toString()));
    // });
    // Observable.forkJoin(calls).subscribe(responses => {...});

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

          return new ImageUrl(imageElement.image.name, response)
        }),
        catchError(this.handleError)

      ));

      // uploadTask.snapshotChanges().pipe(
      //   last(),
      //   switchMap(() => storageRef.getDownloadURL())
      // ).subscribe(downloadURL => {
      //     console.log('PushED images '+ downloadURL);
      //     console.log('PushED images');

      // });

      // .subscribe(url => console.log(
      //   'download url:', url))

      // uploadTask.snapshotChanges().pipe(
      //   finalize(() => {
      //     storageRef.getDownloadURL().pipe(
      //       tap(response => {
      //         console.log('PushED images Tap');
      //       console.log(response);

      //     }),
      //     map(response => {
      //       console.log('PushED images Map');
      //       fileUpload.imageUrls.push(new ImageUrl(imageElement.image.name, response));

      //       return fileUpload
      //     }),
      //     catchError(this.handleError))
      //     .subscribe(downloadURL => {
      //       console.log('PushED images '+ downloadURL);
      //           console.log('PushED images');
      //     });
      //   }),
      //   map(response => {
      //     console.log('PushED images Map + ' + response.ref.getDownloadURL());
      //   //  fileUpload.imageUrls.push(new ImageUrl(imageElement.image.name, response.downloadURL));

      //     return fileUpload
      //   }),
      //   catchError(this.handleError)
      // ).subscribe();







      //calls.push();






    });
    //return fileUpload;
    return forkJoin(calls);
    // .subscribe(responses => {
    //   console.log('Test results : ' + responses);
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
