import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { AppComponent } from './app.component';

@Component({
  selector: 'a',
  template: 'about'
})
export class AboutComponent {

}


const appRoutes: Route[] = [
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'home',
    component: AboutComponent,
    children: [
      {
        path: 'homehome',
        loadChildren: './lazy.ts#LazyModule'
      },
    ]
  },
  {
    path: '',
    loadChildren: './lazy.ts#LazyModule'
  },
  {
    path: 'hello',
    loadChildren: './lazy.ts#LazyModule'
  }
];


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule.withServerTransition({ appId: 'my-app' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
