import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Post } from 'src/app/model/post.model';
import { BlogService } from 'src/app/service/blog-service.service';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css']
})
export class PostNewComponent implements OnInit {

  post?: Post;
  newPostForm: FormGroup;
  imageurlsLocal = [];
  urlsBackground = [];
  base64String: string;
  name: string;
  imagePath: string;
  editMode = false;
  id: number;
  numberOfPosts: number;
  isPostAvailable = false;
  isCreatePost = true;
  isImageUpload=false;
  isImgAvailable: boolean;
  isCreateImg=false;

  // ViewChild is used to access the input element.

  @ViewChild('takeInput', { static: false })


  // this InputVar is a reference to our input.

  InputVarSingle: ElementRef;

  @ViewChild('takeMultipleInput', { static: false })
  InputVarMultiple: ElementRef;




  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });


    if (this.post) {
      this.newPostForm.setValue({
        postId: this.post.id,
        heading: this.post.heading,
        subHeading: this.post.subHeading,
        backgroundImage: this.post.backgroundImage,
        body: this.post.body,
        imageurls: this.post.imageurls,
      });
    }
  }


  private initForm() {
    let postId = 0;
    let postSlug = '';
    let postBackgroundImage = new FormArray([]);
    let postHeading = '';
    let postSubHeading = '';
    let postMeta = '';
    let postBody = '';
    let postImageurls = new FormArray([]);


    if (this.editMode) {
      const postData = this.blogService.getPost(this.id);
      postId = postData.id;
      postSlug = postData.slug;
      postHeading = postData.heading;
      postSubHeading = postData.subHeading;
      postMeta = postData.meta;
      postBody = postData.body;
      if (postData.backgroundImage) {
        for (let bgImage of postData.backgroundImage) {
          this.urlsBackground.push(bgImage.url);
          postBackgroundImage.push(
            new FormGroup({
              name: new FormControl(bgImage.name, Validators.required),
              url: new FormControl(bgImage.url, Validators.required),
            })
          );
        }
      }

      if (postData['imageurls']) {
        for (let url of postData.imageurls) {
          this.imageurlsLocal.push({ base64String: url.url, });
          postImageurls.push(
            new FormGroup({
              name: new FormControl(url.name, Validators.required),
              url: new FormControl(url.url, Validators.required),
            })
          );
        }
      }
    }


    this.newPostForm = new FormGroup({
      id: new FormControl(postId),
      heading: new FormControl(postHeading, Validators.required),
      subHeading: new FormControl(postSubHeading, Validators.required),
      backgroundImage: postBackgroundImage,
      body: new FormControl(postBody, Validators.required),
      imageurls: postImageurls,

    });
    this.dataEmit();
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
  
  onSubmit() {
    if (this.newPostForm.status === 'VALID') {
      if (this.editMode) {
        this.blogService.updatePost(this.id, this.newPostForm.value);
        this.router.navigate(['/search']);
      } else {

        this.blogService.createPost(this.newPostForm.value);
      }

      this.dataEmit()
      //this.onCancel();


    }



    // tslint:disable-next-line: forin
    // for (const key in this.newPostForm.controls) {
    //   const control = this.newPostForm.controls[key];
    //   control.markAllAsTouched();
   
    // }

    this.reset();

  }



  reset() {

    this.newPostForm.reset();
    this.imageurlsLocal = [];
    this.urlsBackground = [];

    this.InputVarSingle.nativeElement.value = "";
    this.InputVarMultiple.nativeElement.value = "";
 
    this.initForm();
  }




  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  removeImage(i) {
    this.imageurlsLocal.splice(i, 1);
    (<FormArray>this.newPostForm.get('imageurls')).removeAt(i)
  }

  removeImageBackground(i) {
    this.urlsBackground.splice(i, 1);
    (<FormArray>this.newPostForm.get('backgroundImage')).removeAt(i)

  }



  onSelectFileBackground(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          if (this.urlsBackground.length > 0) {
            this.removeImageBackground(0);
          }
          this.urlsBackground.push(event.target.result);
          (<FormArray>this.newPostForm.get('backgroundImage')).push(new FormGroup({
            name: new FormControl("image" + (+1), Validators.required),
            url: new FormControl(event.target.result,
              Validators.required)
          }));
        }

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageurlsLocal.push({ base64String: event.target.result, });
          (<FormArray>this.newPostForm.get('imageurls')).push(new FormGroup({
            name: new FormControl("image" + (+1), Validators.required),
            url: new FormControl(event.target.result,
              Validators.required)
          }));

        }
        reader.readAsDataURL(event.target.files[i]);
      }

    }
  }


}
