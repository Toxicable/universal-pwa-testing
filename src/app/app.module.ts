import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { AppComponent } from './app.component';
import { LazyModule } from "./lazy";

@Component({
  selector: 'a',
  template: 'about'
})
export class AboutComponent {

}

export function loadLazyModule() {
  return LazyModule;
}

const appRoutes: Route[] = [
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'home',
    component: AboutComponent
  },
  {
    path: 'function-load-children',
    loadChildren: loadLazyModule
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
