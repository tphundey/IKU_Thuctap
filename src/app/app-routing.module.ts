import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './layouts/userLayout/user-layout/user-layout.component';
import { HomepageComponent } from './pages/user/homepage/homepage.component';
import { DetailpageComponent } from './pages/user/detailpage/detailpage/detailpage.component';

const routes: Routes = [
  {
    path: '', component: UserLayoutComponent, children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", component: HomepageComponent },
      { path: "detailpage", component: DetailpageComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
