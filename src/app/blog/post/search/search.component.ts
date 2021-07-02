import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit() {
 

    //this.recipeService.newPost(this.recipeForm.value);
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
