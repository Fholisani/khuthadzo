import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ContetFile } from '../model/content-file.model';
import { ImageUrl } from '../model/image.model';
import { PostCardResponse } from '../model/post-card-response.model';
import { PostDetailResponse } from '../model/post-response.model';
import { PostUpdate } from '../model/post-update.model';
import { Post } from '../model/post.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {



  postsChanged = new Subject<Post[]>();
  postCardsChanged = new Subject<PostCardResponse[]>();
  postsAdded = new Subject<Post[]>();

  postUpdateChanged = new Subject<PostUpdate>();
  
  private posts: Post[] = [];
  // private fileImageUrls: ImageUrl[] = [];
  private postCards: PostCardResponse[] = [];
  private postDetailResponse: PostDetailResponse = null;
  private postUpdate: PostUpdate = null;
  postDetailResponseChanged = new Subject<PostDetailResponse>();
  private postsAdd: Post[] = [];
  isLoading=false;
  isLoadingChanged=new Subject<boolean>();
  errorMessage:string=null;
  errorMessageChanged=new Subject<string>();
  successMessage: string=null;
  successMessageChanged=new Subject<string>();
  postDeleteChanged = new Subject<number>();
  
  

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
  setPosts(posts: Post[]){
    this.posts = posts;
    this.postsChanged.next(this.posts.slice());
  }
  setPostCards(postCards: PostCardResponse[]){
    this.postCards = postCards;
    this.postCardsChanged.next(this.postCards.slice());
  }
  setPostDetailResponse(postDetailResponse: PostDetailResponse){
    this.postDetailResponse = postDetailResponse;
    this.postDetailResponseChanged.next(this.postDetailResponse);
  }
  updatePost(postUpdated: PostUpdate) {
    this.postUpdate = postUpdated;
    this.postUpdateChanged.next(this.postUpdate);

  }
  getUpdatedPost(){
    return this.postUpdate;
  }

  getPosts(){
    return this.posts.slice();
  }
  getPostCards(){
    return this.postCards.slice();
  }
  getPostDetailResponse(){
    return this.postDetailResponse;
  }
  getPostsAdded(){
    return this.postsAdd.slice();
  }
  getPost(index: number) {
    return this.posts[index];
  }

  createPost(payload: Post) {

    payload.id =Math.floor(Math.random() * 100) + 1;
  
    payload.date =  new Date("2019-01-16");
    payload.author = "*Khuthi*";
    payload.readTime = 20;
    payload.slug = "Slug";
    // payload.bgImage = "https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-medium.jpeg";

    this.postsAdd.push(payload);
    this.postsAdded.next(this.postsAdd.slice());
  }

  cleanPosts() {
    this.postsAdd = [];
    this.postsAdded.next(this.postsAdd.slice());
  }



  deletePost(postId: number) {
    this.postDeleteChanged.next(postId);
  }

  constructor() { }
}
