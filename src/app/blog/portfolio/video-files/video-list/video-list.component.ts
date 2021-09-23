import { OnDestroy } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContetFile } from 'src/app/model/content-file.model';
import { GalleryImages } from 'src/app/model/post.model';
import { UploadService } from 'src/app/service/upload.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements   OnInit, OnDestroy {
  @Input() uploadedVideos:  ContetFile[] =[];
  private subscription: Subscription;
  private subscriptionVideos: Subscription;
  private subscriptionError: Subscription;
  private subscriptionSuccess: Subscription;
  isLoading = false;
  errorMessage: string = null;
  successMessage: string = null;
  config: any;
  constructor(private router: Router,
    private route: ActivatedRoute, private uploadService: UploadService,
    private dataStorageService: DataStorageService,) { }

  ngOnInit(): void {

    const pageNo=0;
    const pageSize=100;
    this.onFetchVideo(pageNo, pageSize);
    this.subscriptionVideos = this.uploadService.contentVideosChanged
    .subscribe(
      (videos: ContetFile[]) => {
        
        this.uploadedVideos = videos;
        this.videosAvailable();
       
      }
    );
    this.subscription = this.uploadService.isLoadingChanged
    .subscribe(
      (isLoading: boolean) => {
        this.isLoading = isLoading;
      }
    );
    this.subscriptionError = this.uploadService.errorMessageChanged
    .subscribe(
      (errorMessage: string) => {
        this.errorMessage = errorMessage;
      }
    );
  this.subscriptionSuccess = this.uploadService.successMessageChanged
    .subscribe(
      (successMessage: string) => {
        this.successMessage = successMessage;

      }
    );

  }
  videosAvailable() {
    if(this.uploadedVideos !== undefined){
      //TODO Something with videos
    }
  }
  onNewFile(){

    this.router.navigate(['new'], {relativeTo: this.route});
  }
  onFetchVideo(pageNo: number, pageSize: number) {

    this.dataStorageService.fetchVideos('video', pageNo, pageSize).subscribe((videos: ContetFile[]) => {
      // console.log('HTTP IMG' + images)
      this.uploadService.setContentVideos(videos);

      this.uploadService.setLoadingIndicator(false);
    }, errorMessage => {

      console.log('HTTP Error', errorMessage)
      let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
      this.uploadService.setErrorMessage(errMsg);
      this.uploadService.setLoadingIndicator(false);
    });
  }
  ngOnDestroy() {


    this.subscription.unsubscribe();
    this.subscriptionVideos.unsubscribe();
    this.subscriptionError.unsubscribe();
    this.subscriptionSuccess.unsubscribe();
  
    
   
  }

}
