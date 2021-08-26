import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Image } from 'src/app/model/image.model';
import { GalleryImages } from 'src/app/model/post.model';
import { UploadService } from 'src/app/service/upload.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioResolverService implements Resolve<GalleryImages[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private uploadService: UploadService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const images = [];

    if (images.length === 0) {
      this.onFetchDataImg()
      return ;
    } else {
      this.onFetchDataImg()
      return images;
    }
  }

  onFetchDataImg() {
    const pageNo=0;
    const pageSize=200;
    this.uploadService.cleanImagesMasterMemory();
    this.dataStorageService.fetchImages('Architecture', pageNo, pageSize).subscribe((images: GalleryImages[])=>{
      console.log('Portfolio Architecture reolver starts..' )
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