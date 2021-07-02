import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  isOnPost = false;
  isMenuCollapsed = true;

  constructor() { }

  ngOnInit(): void {
   
  }


  navbarOpen = false;

  toggleNavbar() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }




}
