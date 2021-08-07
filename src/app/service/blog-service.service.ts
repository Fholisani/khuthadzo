import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../model/post.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {



  postsChanged = new Subject<Post[]>();
  postsAdded = new Subject<Post[]>();
  private posts: Post[] = [];
  private postsAdd: Post[] = [];
  isLoading=false;
  isLoadingChanged=new Subject<boolean>();
  errorMessage:string=null;
  errorMessageChanged=new Subject<string>();
  successMessage: string=null;
  successMessageChanged=new Subject<string>();

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
  getPosts(){
    return this.posts.slice();
  }
  getPostsAdded(){
    return this.postsAdd.slice();
  }
  getPost(index: number) {
    return this.posts[index];
  }
  updatePost(index: number, newPost: Post) {


    newPost.postCardImage ="https://mdbootstrap.com/img/Photos/Horizontal/Work/4-col/img%20%2821%29.jpg";
    newPost.galleryImages = [
      {
        small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-small.jpeg',
        medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-medium.jpeg',
        big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-big.jpeg',
        description: 'Testing 1'
      },
      {
        small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-small.jpeg',
        medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-medium.jpeg',
        big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-big.jpeg',
        description: 'Testing 2'
      },
      {
        small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-small.jpeg',
        medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-medium.jpeg',
        big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-big.jpeg',
        description: 'Testing 3'
      },
      {
        small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-small.jpeg',
        medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-medium.jpeg',
        big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-big.jpeg',
        description: 'Testing 4'
      }
    ];

    newPost.date =  new Date("2019-01-16");
    newPost.author = "*Khuthi*";
    newPost.readTime = 20;
    newPost.slug = "Slug";
    newPost.bgImage = "https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-medium.jpeg";


    this.posts[index] = newPost;
    this.postsChanged.next(this.posts.slice());

    //this.postsAdd.push(newPost);
    this.postsAdd =  this.posts;
    this.postsAdded.next(this.postsAdd.slice());
  }
  createPost(payload: Post) {

    payload.id =Math.floor(Math.random() * 100) + 1;
    // payload.postCardImage ="https://mdbootstrap.com/img/Photos/Horizontal/Work/4-col/img%20%2821%29.jpg";
    // payload.galleryImages = [
    //   {
    //     small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-small.jpeg',
    //     medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-medium.jpeg',
    //     big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-big.jpeg',
    //     description: 'Testing 1'
    //   },
    //   {
    //     small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-small.jpeg',
    //     medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-medium.jpeg',
    //     big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-big.jpeg',
    //     description: 'Testing 2'
    //   },
    //   {
    //     small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-small.jpeg',
    //     medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-medium.jpeg',
    //     big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-big.jpeg',
    //     description: 'Testing 3'
    //   },
    //   {
    //     small: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-small.jpeg',
    //     medium: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-medium.jpeg',
    //     big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-big.jpeg',
    //     description: 'Testing 4'
    //   }
    // ];

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



  deletePost(index: number) {
    this.posts.splice(index, 1);
    this.postsChanged.next(this.posts.slice());

    this.postsAdd =  this.posts;
    this.postsAdded.next(this.postsAdd.slice());
  }

  constructor() { }
}
