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

  constructor() { }
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
    payload.id =Math.random();
    this.imagesAdd.push(payload);
    this.imagesAdded.next(this.imagesAdd.slice());

  }
  getImagesAdded(){
    return this.imagesAdd.slice();
  }
}
