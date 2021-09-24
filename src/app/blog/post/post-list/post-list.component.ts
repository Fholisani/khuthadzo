import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostCardResponse } from 'src/app/model/post-card-response.model';
import { Post } from 'src/app/model/post.model';
import { BlogService } from 'src/app/service/blog-service.service';
import { ShareService } from 'src/app/service/share.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
 // postCards: PostCard[];
  numberOfPosts: number;
  posts: Post[];
  postCards: PostCardResponse[];
  isPostAvailable = false;
  isCreatePost = false;
  subscription: Subscription;
  isLoading = false;
  errorMessage: string=null;
  successMessage: string=null;
  host: string= environment.host;
  config: any;


  constructor(private blogService: BlogService,
    private dataStorageService: DataStorageService, private shareService:ShareService) {
    this.host = environment.host;
    this.config = {
      currentPage: 1,
      itemsPerPage: 6,
      totalItems:1
      };
  }


  ngOnInit(): void {
    this.shareService.setFacebookTags(
      "https://khuthadzo-kg.co.za/",
      "Khuthadzo - Freelance interior designer",
      "Post detail Description",
      "https://khuthadzo-kg.co.za/");
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
    this.postCards = this.blogService.getPostCards();

    this.subscription = this.blogService.postCardsChanged
      .subscribe(
        (postCards: PostCardResponse[]) => {
          console.log("Update post");
          this.postCards = postCards;
          this.newPostsAvailable();

        }
      );

    this.subscription = this.blogService.postsAdded
      .subscribe(
        (posts: Post[]) => {
          console.log('Delete post did not get fired');
          this.dataEmit();
        }
      );

    this.subscription = this.blogService.isLoadingChanged
      .subscribe(
        (isLoading: boolean) => {
          this.isLoading = isLoading;
        }
      );
      this.subscription = this.blogService.errorMessageChanged
      .subscribe(
        (errorMessage: string) => {
          console.log('fire search error')
          this.errorMessage = errorMessage;
        }
      );

      this.subscription = this.blogService.successMessageChanged
      .subscribe(
        (successMessage: string) => {
          this.successMessage = successMessage;
        }
      );
    this.posts = this.blogService.getPosts();
  //  this.newPostsAvailable();
    this.dataEmit();
  }

  newPostsAvailable() {
    if(this.postCards !== undefined){
      var localPostCards = [];
      this.postCards.forEach(post => {
        //const postCard = new PostCard(post.heading, post.subHeading, post.postCardImage, post.id);
        const postCard = new PostCardResponse(post.postId,post.heading, post.subHeading, post.backgroundImage, post.readTime,
        post.reference,post.date, post.totalItems,post.timeElapsed);
        this.config.totalItems = post.totalItems;
        localPostCards.push(postCard);
      });
      this.postCards = localPostCards;
      this.errorMessage=null;
      this.successMessage=null;

    }


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
  pageChange(newPage: number) {
    console.log("Paging : " + newPage);
    this.config.currentPage = newPage;
    this.onFetchData(newPage -1, this.config.itemsPerPage);
   // this.router.navigate([''], { queryParams: { page: newPage } });
  }

  onFetchData(pageNo: number, pageSize: number) {

    return this.dataStorageService.fetchPosts(pageNo,pageSize).subscribe(postCards=>{
      console.log("Paging : Done fetching ");
      this.blogService.setPostCards(postCards);
      this.blogService.setLoadingIndicator(false);
    },errorMessage =>{

      console.log('HTTP Error', errorMessage)
      let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
      this.blogService.setErrorMessage(errMsg);
      this.blogService.setLoadingIndicator(false);
    });
  }

  viewDetail(id: number) {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
