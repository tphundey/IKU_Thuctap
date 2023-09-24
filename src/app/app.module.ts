import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/adminLayout/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/userLayout/user-layout/user-layout.component';
import { AdminFooterComponent } from './components/admin/adminFooter/admin-footer/admin-footer.component';
import { AdminHeaderComponent } from './components/admin/adminHeader/admin-header/admin-header.component';
import { AdminSidebarComponent } from './components/admin/adminSidebar/admin-sidebar/admin-sidebar.component';
import { FooterComponent } from './components/user/footer/footer/footer.component';
import { HeaderComponent } from './components/user/header/header/header.component';
import { SidebarComponent } from './components/user/sidebar/sidebar/sidebar.component';
import { HomepageComponent } from './pages/user/homepage/homepage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-bootstrap/carousel';
@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    UserLayoutComponent,
    AdminFooterComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    HomepageComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CarouselModule.forRoot() 
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
