import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Image, ImageUrl } from '../model/image.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  imagesChanged = new Subject<Image[]>();
  imagesHandDrawingChanged = new Subject<Image[]>();
  imagesAdded = new  BehaviorSubject<Image>(null);;
  imagesBgAdded =new  BehaviorSubject<Image>(null);;
  // imagesPostAdded = new Subject<Image>();
  // imagesPostAdded= new  BehaviorSubject<Image>(null);
  imagesPostAdded: Subject<any> = new Subject<any>();
  private images: Image[] = [];
  private imagesHandDrawing: Image[] = [];
  private imagesBgAdd : Image;
  private imagesPostAdd :Image ;
  private imagesAdd: Image;
  isLoading=false;
  isLoadingChanged=new Subject<boolean>();
  errorMessage=null;
  errorMessageChanged=new Subject<string>();
  successMessage: string=null;
  successMessageChanged=new Subject<string>();
  uploadedDataSource: BehaviorSubject<ImageUrl[]> = new BehaviorSubject([]);
  // Observable navItem stream
 // navItem$ = this.imagesPostAdded.asObservable();
  
  constructor() { }

  setErrorMessage(errorMessage: string) {
    this.errorMessage = errorMessage;
    this.errorMessageChanged.next(this.errorMessage);
  }

  setSuccessMessage(successMessage: string) {
    this.successMessage = successMessage;
    this.successMessageChanged.next(this.successMessage);
  }

  uploadedImgDataSource(imageUrls: ImageUrl[]) {
    this.uploadedDataSource.next(imageUrls);
  }
  
  setLoadingIndicator(isLoading: boolean){
    this.isLoading = isLoading;
    this.isLoadingChanged.next(this.isLoading);
  }
  setImages(images: Image[]){
    this.images = images;
    this.imagesChanged.next(this.images.slice());
  }
  getImages(){
    return this.images.slice();
  }
  setHandDrawingImages(images: Image[]){
    this.imagesHandDrawing = images;
    this.imagesHandDrawingChanged.next(this.imagesHandDrawing.slice());
  }
  getHandDrawingImages(){
    return this.imagesHandDrawing.slice();
  }
 
  getImage(index: number) {
    return this.images[index];
  }
  deleteImage(index: number) {
    this.images.splice(index, 1);
    this.imagesChanged.next(this.images.slice());

    // this.imagesAdd =  this.images;
    // this.imagesAdded.next(this.imagesAdd);
  }
  cleanImages() {
    this.imagesAdd = null;
  //  this.imagesAdded.next(this.imagesAdd);
  }
  cleanBgImages() {
    this.imagesBgAdd = null;
   // this.imagesPostAdded.next(this.imagesBgAdd);
  }
  cleanPostImages() {
    this.imagesPostAdd = null;
   // this.imagesBgAdded.next(this.imagesPostAdd);
  }
   createImage(payload: Image,componentUploading: string) {
    payload.id =Math.floor(Math.random() * 100) + 1;
    payload.imageUrls =[];
    
    console.log("*** Notify subscriber for component : " + componentUploading);
    if(componentUploading==='postImg'){
      this.imagesPostAdd =payload;
      this.imagesPostAdded.next(this.imagesPostAdd);
      // this.cleanImages();
      // this.cleanBgImages();
      
    }
    if(componentUploading==='backgroundImg'){
      this.imagesBgAdd =payload;
      this.imagesBgAdded.next(this.imagesBgAdd);
      // this.cleanImages();
      // this.cleanPostImages();
      
    }
    if(componentUploading==='upload'){
      this.imagesAdd =payload;
      this.imagesAdded.next(this.imagesAdd);
      // this.cleanBgImages();
      // this.cleanPostImages();
      
      
    }

  }
  getImagesPostAdded(){
    return this.imagesPostAdd;
  }
  getImagesBgAdded(){
    return this.imagesBgAdd;
  }
  getImagesAdded(){
    return this.imagesAdd;
  }
}
