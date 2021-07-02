import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Post } from '../model/post.model';
import { BlogService } from '../service/blog-service.service';
import { UploadService } from '../service/upload.service';
import { Image } from '../model/image.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private blogService: BlogService,
     private uploadService: UploadService) { }

  storePosts() {
    const posts = this.blogService.getPostsAdded();
    this.http
      .put(
        'https://ng-course-recipe-book-b8129-default-rtdb.firebaseio.com/posts.json',
        posts
      )
      .subscribe(response => {
        console.log(response);
        this.blogService.cleanPosts()
        console.log("Empty : "+ this.blogService.getPostsAdded())
      });
  }

  fetchPosts() {
    return this.http
      .get<Post[]>(
        'https://ng-course-recipe-book-b8129-default-rtdb.firebaseio.com/posts.json'
      )
      .pipe(
        map(posts => {
          return posts.map(post => {
            return {
              ...post,
              galleryImages: post.galleryImages ? post.galleryImages : []
            };
          });
        }),
        tap(posts => {
          this.blogService.setPosts(posts);
        })
      )
  }


  storeImage() {
    const images = this.uploadService.getImagesAdded();
    this.http
      .put(
        'https://ng-course-recipe-book-b8129-default-rtdb.firebaseio.com/images.json',
        images
      )
      .subscribe(response => {
        console.log(response);
        this.uploadService.cleanImages()
        console.log("Empty : "+ this.uploadService.getImagesAdded())
      });
  }

  fetchImages() {
    return this.http
      .get<Image[]>(
        'https://ng-course-recipe-book-b8129-default-rtdb.firebaseio.com/images.json'
      )
      .pipe(
        map(images => {
          return images.map(image => {
            return {
              ...image,
              imageUrl: image.imageUrl ? 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80' : 
              'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80'
            };
          });
        }),
        tap(images => {
          this.uploadService.setImages(images);
        })
      )
  }
}
