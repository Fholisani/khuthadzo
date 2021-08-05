import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Image, ImageUrl } from '../model/image.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  imagesChanged = new Subject<Image[]>();
  imagesHandDrawingChanged = new Subject<Image[]>();
  imagesAdded = new Subject<Image[]>();
  private images: Image[] = [];
  private imagesHandDrawing: Image[] = [];
  private imagesAdd: Image[] = [];
  isLoading=false;
  isLoadingChanged=new Subject<boolean>();
  errorMessage=null;
  errorMessageChanged=new Subject<string>();
  successMessage: string=null;
  successMessageChanged=new Subject<string>();
  uploadedDataSource: BehaviorSubject<ImageUrl[]> = new BehaviorSubject([]);
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

    this.imagesAdd =  this.images;
    this.imagesAdded.next(this.imagesAdd.slice());
  }
  cleanImages() {
    this.imagesAdd = [];
    this.imagesAdded.next(this.imagesAdd.slice());
  }
   createImage(payload: Image) {
    payload.id =Math.floor(Math.random() * 100) + 1;
    payload.imageUrls =[];
    this.imagesAdd.push(payload);
    this.imagesAdded.next(this.imagesAdd.slice());

  }
  getImagesAdded(){
    return this.imagesAdd.slice();
  }
}
