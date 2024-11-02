import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreeListRoutingModule } from './tree-list-routing.module';
import { TreeListComponent } from './tree-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TreeListComponent
  ],
  imports: [
    CommonModule,
    TreeListRoutingModule,
    MatPaginatorModule,
    FormsModule
  ]
})
export class TreeListModule { }
