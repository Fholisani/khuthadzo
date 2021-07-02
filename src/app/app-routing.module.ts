import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './blog/about/about.component';
import { ContactComponent } from './blog/contact/contact.component';
import { HomeComponent } from './blog/home/home.component';
import { ArchitectureComponent } from './blog/portfolio/architecture/architecture.component';
import { HandDrawingComponent } from './blog/portfolio/hand-drawing/hand-drawing.component';
import { ImageComponent } from './blog/portfolio/image/image.component';
import { PostDetailComponent } from './blog/post/post-detail/post-detail.component';
import { PostEditComponent } from './blog/post/post-edit/post-edit.component';
import { PostNewComponent } from './blog/post/post-new/post-new.component';
import { PostStartComponent } from './blog/post/post-start/post-start.component';
import { PostComponent } from './blog/post/post.component';
import { SearchResultsComponent } from './blog/post/search/search-results/search-results.component';



const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, },
  { path: 'about', component: AboutComponent,},
  { path: 'contact', component: ContactComponent,},
  { path: 'post', component: PostComponent, children: [
    { path: '', component: PostStartComponent,  },
    { path: 'new', component: PostNewComponent, },
    { path: ':id', component: PostDetailComponent, },
    { path: ':id/edit', component: PostNewComponent, },
  ] },
  { path: 'search', component: SearchResultsComponent },
  { path: 'architecture', component: ArchitectureComponent },
  { path: 'hand-drawings', component: HandDrawingComponent },
  { path: 'upload', component: ImageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
