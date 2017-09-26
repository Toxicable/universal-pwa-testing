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
    component: AboutComponent,
    children: [
      {
        path: 'homehome',
        loadChildren: './lazy.ts#LazyModule'
      },
    ]
  },
  {
<<<<<<< HEAD
    path: 'function-load-children',
    loadChildren: loadLazyModule
  },
  {
=======
>>>>>>> 51c014129cf0963b616925930e8016ed98d2e9ce
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
