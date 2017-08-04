import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lazy',
  template: ` lazy comp`,
})
export class Lazy {
}

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: Lazy },
      {path: 'lazyAbout', component: Lazy}
    ])
  ],
  declarations: [Lazy],
  entryComponents: [Lazy]
})
export class LazyModule { }
