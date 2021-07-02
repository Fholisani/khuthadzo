import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostCard } from 'src/app/model/post-card.model';
import { Post } from 'src/app/model/post.model';
import { BlogService } from 'src/app/service/blog-service.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  postCards: PostCard[];
  numberOfPosts: number;
  posts: Post[];
  isPostAvailable = false;
  isCreatePost = false;
  subscription: Subscription;
  

  constructor(private blogService: BlogService) { }


  ngOnInit(): void {
    // this.postCards = [new PostCard("Card title",
    // "Some quick example text to build on the card title and make up the bulk of the card's content.",
    // "https://mdbootstrap.com/img/Photos/Horizontal/Work/4-col/img%20%2821%29.jpg", 1),
    // new PostCard("Card title",
    // "Some quick example text to build on the card title and make up the bulk of the card's content.",
    // "https://mdbootstrap.com/img/Photos/Horizontal/Work/4-col/img%20%2821%29.jpg", 2),
    // new PostCard("Card title",
    // "Some quick example text to build on the card title and make up the bulk of the card's content.",
    // "https://mdbootstrap.com/img/Photos/Horizontal/Work/4-col/img%20%2821%29.jpg", 3),
    // new PostCard("Card title",
    // "Some quick example text to build on the card title and make up the bulk of the card's content.",
    // "https://mdbootstrap.com/img/Photos/Horizontal/Work/4-col/img%20%2821%29.jpg",4),
    // new PostCard("Card title",
    // "Some quick example text to build on the card title and make up the bulk of the card's content.",
    // "https://mdbootstrap.com/img/Photos/Horizontal/Work/4-col/img%20%2821%29.jpg",5)];


    this.subscription = this.blogService.postsChanged
      .subscribe(
        (posts: Post[]) => {
          this.posts = posts;
          this.newPostsAvailable();
        }
      );

    this.subscription = this.blogService.postsAdded
      .subscribe(
        (posts: Post[]) => {
          this.dataEmit();
        }
      );
    this.posts = this.blogService.getPosts();
    this.newPostsAvailable();
    this.dataEmit();
  }

  newPostsAvailable() {
    var localPostCards = [];
    this.posts.forEach(post => {
      const postCard = new PostCard(post.heading, post.subHeading, post.postCardImage, post.id);
      localPostCards.push(postCard);
    });
    this.postCards = localPostCards;

  }

  dataEmit() {
    const posts = this.blogService.getPostsAdded();
   
    if (posts.length > 0) {
      this.numberOfPosts = posts.length;
      this.isPostAvailable = true;
    } else {
      this.numberOfPosts = 0;
      this.isPostAvailable = false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
