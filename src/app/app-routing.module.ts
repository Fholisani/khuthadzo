import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { AboutComponent } from './blog/about/about.component';
import { ContactComponent } from './blog/contact/contact.component';
import { FilesDetailComponent } from './blog/files/files-detail/files-detail.component';
import { FilesEditComponent } from './blog/files/files-edit/files-edit.component';
import { FilesStartComponent } from './blog/files/files-start/files-start.component';
import { FilesComponent } from './blog/files/files.component';
import { HomeComponent } from './blog/home/home.component';
import { ArchitectureComponent } from './blog/portfolio/architecture/architecture.component';
import { HandDrawingComponent } from './blog/portfolio/hand-drawing/hand-drawing.component';
import { HanddrawingResolverService } from './blog/portfolio/handdrawing-resolver.service';
import { ImageUploadImplComponent } from './blog/portfolio/image-upload-impl/image-upload-impl.component';
import { PortfolioResolverService } from './blog/portfolio/portfolio-resolver.service';
import { PostDetailComponent } from './blog/post/post-detail/post-detail.component';
import { PostEditComponent } from './blog/post/post-edit/post-edit.component';
import { PostNewComponent } from './blog/post/post-new/post-new.component';
import { PostResolverService } from './blog/post/post-resolver.service';
import { PostStartComponent } from './blog/post/post-start/post-start.component';
import { PostComponent } from './blog/post/post.component';
import { SearchResultsComponent } from './blog/post/search/search-results/search-results.component';



const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent,resolve:[PostResolverService] },
  { path: 'about', component: AboutComponent,},
  { path: 'contact', component: ContactComponent,},
  { path: 'post', component: PostComponent,  children: [
    { path: '', component: PostStartComponent,  },
    { path: 'new', component: PostNewComponent, canActivate: [AuthGuard],},
    //{ path: 'new/image', component: PostImageComponent, canActivate: [AuthGuard],},
    { path: ':id', component: PostDetailComponent, /*resolve:[PostDetailResolverService]*/},
    { path: ':id/edit', component: PostEditComponent, children: [
        {path:'', component: FilesStartComponent},
        {path:'new/:component', component: FilesEditComponent},
        {path:':id/:id2', component: FilesDetailComponent},
        {path:':id/:id2/edit', component: FilesEditComponent}
    ] /*canActivate: [AuthGuard],resolve:[PostResolverService]*/},
  ] },
  { path: 'search', component: SearchResultsComponent,  },
  { path: 'architecture', component: ArchitectureComponent, resolve:[PortfolioResolverService] },
  { path: 'hand-drawings', component: HandDrawingComponent, resolve:[HanddrawingResolverService]  },
  { path: 'upload', component: ImageUploadImplComponent,  canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent },
  {path:'files', component: FilesComponent, children:[
    {path:'', component: FilesStartComponent},
    {path:'new/:component', component: FilesEditComponent},
    {path:':id/:id2', component: FilesDetailComponent},
    {path:':id/:id2/edit', component: FilesEditComponent}
]},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
