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
import { PostCardResponse } from '../model/post-card-response.model';
import { PostDetailResponse } from '../model/post-response.model';
import { ContetFile } from '../model/content-file.model';

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
      .post<undefined>(
        `${this.imageUrl}/blogger/post`,
        posts
      ).pipe(
        tap(response => {
          console.log(response);


        }),
        map(response => response));
    
  }
  updatePost(): Observable<undefined | Error> {

    this.blogService.setLoadingIndicator(true);
    const post = this.blogService.getUpdatedPost();
    return this.http
      .put<undefined>(
        // `${this.imageUrl}/blogger/post/${post.index}`,
        `${this.url}/postupdate.json`,
        post.post
      ).pipe(
        tap(response => {
          console.log(response);


        }),
        map(response => response));
    
  }

  fetchPosts() {
    this.blogService.setLoadingIndicator(true);
    return this.http
      .get<PostCardResponse[]>(
        `${this.imageUrl}/blogger/blog?pageNo=0&pageSize=10&sortBy=date`
      )
      .pipe(
        map(response => response
        //   posts => {
        //   return posts.map(post => {
        //     return {
        //       ...post,
        //       galleryImages: post.galleryImages ? post.galleryImages : []
        //     };
        //   });
        // }
        ),
        tap(posts => {
          console.log("Fetching post...");
          this.blogService.setPostCards(posts);
          this.blogService.setLoadingIndicator(false);

        }),
        catchError(this.handleError)
      )
  }

  fetchDetailPosts(postId : number) {
    this.blogService.setLoadingIndicator(true);
    return this.http
      .get<PostDetailResponse>(
        `${this.imageUrl}/blogger/blog/${postId}`
      )
      .pipe(
        map(response => response
        ),
        tap(post => {
          console.log("Fetching post detail...");
          // this.blogService.setPostDetailResponse(post);
          // this.blogService.setLoadingIndicator(false);

        }),
        catchError(this.handleError)
      )
  }

  fetchFileUploaded(reference : number) {
    this.blogService.setLoadingIndicator(true);
    return this.http
      .get<PostDetailResponse>(
        `${this.imageUrl}/blogger/files/${reference}`
      )
      .pipe(
        map(response => response
        ),
        tap(post => {
          console.log("Fetching files detail...");
          // this.blogService.setPostDetailResponse(post);
          // this.blogService.setLoadingIndicator(false);

        }),
        catchError(this.handleError)
      )
  }

  updateContentImages(componentUploadingImg : string): Observable<ContetFile | Error> {
    let imageObj= null;
    console.log("======Get images for component  : ===== " + componentUploadingImg);
    if(componentUploadingImg==='postImg'){
     
      imageObj = this.uploadService.getUpdateContentPostImg();
      
    }
    if(componentUploadingImg==='backgroundImg'){
      imageObj = this.uploadService.getUpdateContentBgImg();
      
    }
    if(componentUploadingImg==='upload'){

      imageObj = this.uploadService.getUpdateContentUploadedImg();
      
    }
    if(imageObj === null){
      console.log("======Should not push empty Imagess : =====");
      return;
    }

    this.uploadService.setLoadingIndicator(true);
    console.log("Image deatail data : " + JSON.stringify(imageObj));
    return this.http
      .put<ContetFile>(
        `${this.imageUrl}/blogger/content/${imageObj.contentId}`,
        imageObj
      ).pipe(
        tap(response => {
          console.log(response);

        }),
        map((response : ContetFile )=> response));

  }

  saveImages(componentUploadingImg : string): Observable<unknown | Error> {

    let imageObj= null;
    console.log("======Get images for component  : ===== " + componentUploadingImg);
    if(componentUploadingImg==='postImg'){
     
      imageObj = this.uploadService.getImagesPostAdded();
      
    }
    if(componentUploadingImg==='backgroundImg'){
      imageObj = this.uploadService.getImagesBgAdded();
      
    }
    if(componentUploadingImg==='upload'){

      imageObj = this.uploadService.getImagesAdded();
      
    }
   
    if(imageObj === null){
      console.log("======Should not push empty Imagess : =====");
      return;
    }
    const finalImages = [];
    const calls = [];
    this.uploadService.setLoadingIndicator(true);
    // images.forEach(element => {

      calls.push(this.pushFileImageToStorageLocal(imageObj)
        .pipe(
          tap(response => {
            console.log(response);

          }),
          
          //Use switchMap to call another API(s)
          // switchMap((responses: ImageUrl[]) => {
          //   //Lets map so to an observable of API call
          //   imageObj.imageUrls = responses;
          //   finalImages.push(imageObj);
          //   console.log("Element data : " + JSON.stringify(imageObj));
          //   //  const allObs$ = this.storeImage(element);///element.map(so => this.storeImage(element));

          //   const allObs$ = this.storeImage(finalImages);
          //   //forkJoin will wait for the response to come for all of the observables
          //   return allObs$;
          // }),
          map((responses: ImageUrl[]) => {
            console.log('PushED images Map : ' + responses);
            imageObj.imageUrls = responses;
            finalImages.push(imageObj);
  

            return finalImages;//;new ImageUrl(imageElement.image.name, message)
          }),
          catchError(this.handleError)
        ));
    // });
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

          return new ImageUrl(imageElement.image.name, response,"","")
        }),
        catchError(this.handleError)

      ));


    });

    return forkJoin(calls);


  }

  upload(file: File, fileUploadDetails: Image): Observable<HttpEvent<any>> {
    console.log('Push images Local instances');
    const formData: FormData = new FormData();
    let postId = 0 +'';
    if(fileUploadDetails.postId){
      postId = fileUploadDetails.postId +'';
    }


    formData.append('image', file);
    formData.append('description', fileUploadDetails.description);
    formData.append('portfolioType', fileUploadDetails.portfolioType);
    formData.append('title', fileUploadDetails.tittle);
    formData.append('postId',postId );
    

    const req = new HttpRequest('POST', `${this.imageUrl}/blogger/image/v1`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
  pushFileImageToStorageLocal(fileUpload: Image) {

    console.log('Push images Local');
    //TODO will this code return the object with updated image URL ?

    const calls = [];
    let progress = 0;

    fileUpload.images.forEach(imageElement => {

      calls.push(this.upload(imageElement.image,
        fileUpload).pipe(

        tap(response => {
          console.log('PushED images Tap');
          console.log(response);

        }),
        filter(response => response.type === HttpEventType.Response),
        map(response => {
          console.log('PushED images Map type ' + response.type);
          let reference = '';
          let url = '';
          let contentId = '';
          if (response.type === HttpEventType.Response) {
            reference = response.body.reference;
            url = response.body.url;
            contentId = response.body.contentId;
            console.log('contentId : ' +contentId +  ' - Locate image URL : ' + url);
          
          }

          return new ImageUrl(imageElement.image.name,url,reference , contentId)
          
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
  deleteImage(contentFile: ContetFile): Observable<unknown | Error> {
    this.uploadService.setLoadingIndicator(true);
    return this.http
      .delete<unknown>(
        `${this.imageUrl}/blogger/image/v1/${contentFile.reference}`,
       
      ).pipe(
        tap(response => {
          console.log(response);

        }),
        map(response => response));
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
