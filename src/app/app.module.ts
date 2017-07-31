import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const appRoutes = [{
  path: '',
  loadChildren: './lazy.ts#LazyModule'
}];


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule.withServerTransition({appId: 'my-app'})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
