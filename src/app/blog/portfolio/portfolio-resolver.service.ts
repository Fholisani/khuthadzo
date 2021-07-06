import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Image } from 'src/app/model/image.model';
import { UploadService } from 'src/app/service/upload.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioResolverService implements Resolve<Image[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private uploadService: UploadService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const images = this.uploadService.getImages();

    if (images.length === 0) {
      this.onFetchDataImg()
      return ;
    } else {
      return images;
    }
  }

  onFetchDataImg() {
    this.dataStorageService.fetchImages().subscribe(images=>{
     
      this.uploadService.setImages(images);
      this.uploadService.setLoadingIndicator(false);
    },errorMessage =>{
   
      console.log('HTTP Error', errorMessage)
      let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
      this.uploadService.setErrorMessage(errMsg);
      this.uploadService.setLoadingIndicator(false);
    });
  }
}