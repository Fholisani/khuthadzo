import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Image } from '../model/image.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  imagesChanged = new Subject<Image[]>();
  imagesAdded = new Subject<Image[]>();
  private images: Image[] = [];
  private imagesAdd: Image[] = [];
  isLoading=false;
  isLoadingChanged=new Subject<boolean>();
  errorMessage=null;
  errorMessageChanged=new Subject<string>();
  successMessage: string=null;
  successMessageChanged=new Subject<string>();
  constructor() { }

  setErrorMessage(errorMessage: string) {
    this.errorMessage = errorMessage;
    this.errorMessageChanged.next(this.errorMessage);
  }

  setSuccessMessage(successMessage: string) {
    this.successMessage = successMessage;
    this.successMessageChanged.next(this.successMessage);
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
    this.imagesAdd.push(payload);
    this.imagesAdded.next(this.imagesAdd.slice());

  }
  getImagesAdded(){
    return this.imagesAdd.slice();
  }
}
