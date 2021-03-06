import { Component, Input, OnInit } from '@angular/core';
import { FileUpload } from 'src/app/model/file-upload.model';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.scss']
})
export class UploadDetailsComponent implements OnInit {

  @Input() fileUpload: FileUpload;

  constructor(private uploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  deleteFileUpload(fileUpload): void {
    this.uploadService.deleteFile(fileUpload);
  }
}
