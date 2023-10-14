import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLayoutComponent } from './layouts/userLayout/user-layout/user-layout.component';
import { HomepageComponent } from './pages/user/homepage/homepage.component';
import { DetailpageComponent } from './pages/user/detailpage/detailpage/detailpage.component';
import { ListbookComponent } from './pages/user/listbook/listbook.component';
import { AdminLayoutComponent } from './layouts/adminLayout/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard/dashboard.component';
import { AddProductComponent } from './pages/admin/products/add-product/add-product.component';
import { UpdateProductComponent } from './pages/admin/products/update-product/update-product/update-product.component';

const routes: Routes = [
  {
    path: '', component: UserLayoutComponent, children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", component: HomepageComponent },
      { path: ":id/detailpage", component: DetailpageComponent },
      { path: "listpage", component: ListbookComponent },
    ]
  },
  {
    path: 'admin', component: AdminLayoutComponent, children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },
      { path: "addproduct", component: AddProductComponent },
      { path: "updateproduct/:id", component: UpdateProductComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
