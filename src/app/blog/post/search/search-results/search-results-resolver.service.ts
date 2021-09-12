import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { PostCardResponse } from 'src/app/model/post-card-response.model';

import { PostDetailResponse } from 'src/app/model/post-response.model';
import { BlogService } from 'src/app/service/blog-service.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';


@Injectable({
  providedIn: 'root'
})
export class SearchResultsResolverService implements Resolve<PostCardResponse[]> {

  constructor(
    private dataStorageService: DataStorageService,
    private blogService: BlogService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)  {
    const posts = this.blogService.getPostCards();
   
    console.log('Current State url search : ' + state.url 
    + ' - Posts available locally : ' + posts.length);
    if (posts.length === 0 ) {
      return ;
    } else {
      return posts ;
    }
  }
  onFetchData() {
    const pageNo=0;
    const pageSize=6;
    return this.dataStorageService.fetchPosts(pageNo,pageSize).subscribe(postCards=>{
     
      this.blogService.setPostCards(postCards);
      this.blogService.setLoadingIndicator(false);
    },errorMessage =>{
   
      console.log('HTTP Error', errorMessage)
      let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
      this.blogService.setErrorMessage(errMsg);
      this.blogService.setLoadingIndicator(false);
    });
  }
}
