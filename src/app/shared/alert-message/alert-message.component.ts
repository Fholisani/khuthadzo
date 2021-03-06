import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent implements OnInit {
  @Input() isLoading = false;
  @Input() errorMessage: string=null;
  @Input() successMessage: string=null;
  constructor() { }

  ngOnInit(): void {
  }
  reset(){
    this.errorMessage =null;
    this.successMessage =null;
  }

}
