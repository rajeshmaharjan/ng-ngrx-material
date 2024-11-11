import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  exports: [
    MatFormFieldModule,
    MatInputModule,
    ScrollingModule,
  ],
})
export class MaterialModule { }
