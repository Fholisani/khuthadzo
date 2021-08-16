import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PostDetailResponse } from 'src/app/model/post-response.model';
import { BlogService } from 'src/app/service/blog-service.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PostDetailResolverService implements Resolve<PostDetailResponse>{

  constructor(
    private dataStorageService: DataStorageService,
    private blogService: BlogService,
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PostDetailResponse
    | Observable<PostDetailResponse> | Promise<PostDetailResponse> {
    console.log("=== Params : " + route.params.id);
    const postDetailResponse = this.blogService.getPostDetailResponse();

    if (postDetailResponse === null) {
      console.log('postDetailResponse === null');
      this.onFetchData(route.params.id);
      return;
    } else {

      return postDetailResponse;
    }

  }

  onFetchData(postId: number) {
    return this.dataStorageService.fetchDetailPosts(postId).subscribe(postDetail => {

      this.blogService.setPostDetailResponse(postDetail);
      this.blogService.setLoadingIndicator(false);
    }, errorMessage => {

      console.log('HTTP Error', errorMessage)
      let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
      this.blogService.setErrorMessage(errMsg);
      this.blogService.setLoadingIndicator(false);
    });
  }
}
