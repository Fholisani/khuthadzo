import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GalleryImages } from 'src/app/model/post.model';
import { UploadService } from 'src/app/service/upload.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class VideoResolverService implements Resolve<GalleryImages[]>{

  constructor(
    private dataStorageService: DataStorageService,
    private uploadService: UploadService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): GalleryImages[] | Observable<GalleryImages[]> | Promise<GalleryImages[]> {
    const images = [];

    if (images.length === 0) {
      this.onFetchVideos()
      return ;
    } else {
      this.onFetchVideos()
      return images;
    }
  }

  onFetchVideos() {
    const pageNo=0;
    const pageSize=100;
    this.uploadService.cleanVideosMasterMemory();
    this.dataStorageService.fetchImages('video', pageNo, pageSize).subscribe((videos: GalleryImages[])=>{
      console.log('Portfolio video reolver starts..' )
      this.uploadService.setVideos(videos);
      this.uploadService.setLoadingIndicator(false);
    },errorMessage =>{
   
      console.log('HTTP Error', errorMessage)
      let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
      this.uploadService.setErrorMessage(errMsg);
      this.uploadService.setLoadingIndicator(false);
    });
  }
}
