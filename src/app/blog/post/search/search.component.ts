import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'src/app/service/blog-service.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataStorageService: DataStorageService,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit() {
 

    //this.recipeService.newPost(this.recipeForm.value);

    console.log('Search ' + this.searchForm.value.search);
    this.dataStorageService.fetchPosts().subscribe(posts=>{
     
      this.blogService.setPosts(posts);
      this.blogService.setLoadingIndicator(false);
    },errorMessage =>{
   
      console.log('HTTP Error', errorMessage)
      let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
      this.blogService.setErrorMessage(errMsg);
      this.blogService.setLoadingIndicator(false);
    });
    this.onSearchResults();
   
  }
 
   onSearchResults() {
    this.router.navigate(['/search'], { relativeTo: this.route });
  }
   private initForm() {
     let searchText = '';
     this.searchForm = new FormGroup({
       search: new FormControl(searchText, Validators.required),
      
     });
   }

}
