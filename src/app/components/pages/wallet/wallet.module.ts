import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // <-- Import FormsModule
import { HttpClientModule } from '@angular/common/http';

import { WalletRoutingModule } from './wallet-routing.module';
import { WalletComponent } from './wallet.component';


@NgModule({
  declarations: [
    WalletComponent
  ],
  imports: [
    CommonModule,
    WalletRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class WalletModule { }
