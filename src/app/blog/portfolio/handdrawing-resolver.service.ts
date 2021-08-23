import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Image } from 'src/app/model/image.model';
import { GalleryImages } from 'src/app/model/post.model';
import { UploadService } from 'src/app/service/upload.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class HanddrawingResolverService implements Resolve<GalleryImages[]> {

  constructor(
    private dataStorageService: DataStorageService,
    private uploadService: UploadService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const images = [];

    if (images.length === 0) {
      this.onFetchDataImgHandDrawing()
      return ;
    } else {
      this.onFetchDataImgHandDrawing()
      return images;
    }
  }

  onFetchDataImgHandDrawing() {
    this.dataStorageService.fetchImages('HandDrawing').subscribe((images: GalleryImages[])=>{
      console.log('HTTP IMG' + images)
      this.uploadService.setHandDrawingImages(images);
      this.uploadService.setLoadingIndicator(false);
    },errorMessage =>{
   
      console.log('HTTP Error', errorMessage)
      let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
      this.uploadService.setErrorMessage(errMsg);
      this.uploadService.setLoadingIndicator(false);
    });
  }
}
