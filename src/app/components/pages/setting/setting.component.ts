import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormBuilder, FormGroup, and Validators
import { WalletServiceService } from '../../../services/wallet/wallet-service.service'; // Import the service

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent { 

 // Declare form groups
 stakeForm: FormGroup;
 withdrawForm: FormGroup;
 depositForm: FormGroup;
 token: any;

 constructor(
   private walletService: WalletServiceService,
   private fb: FormBuilder // Inject FormBuilder
 ) {
   // Initialize the form groups in the constructor
   this.stakeForm = this.fb.group({
     amount: [0, [Validators.required, Validators.min(1)]],
   });
   // Initialize the form groups in the constructor
   this.depositForm = this.fb.group({
     amount: [0, [Validators.required, Validators.min(1)]],
   });

   this.withdrawForm = this.fb.group({
     amount: [0, [Validators.required, Validators.min(1)]],
     password: ['', [Validators.required]],
   });
 }

 ngOnInit(): void {
   this.token = localStorage.getItem('authToken');
 }

 stake() {
   if (this.stakeForm.valid) {
     const stakeAmount = this.stakeForm.value; // Get the value from the form
     this.walletService.stake(stakeAmount, this.token).subscribe({
       next: (response) => {
         console.log('Staked successfully:', response);
         // Handle success notification here
       },
       error: (err) => {
         console.error('Staking error:', err);
         // Handle error notification here
       }
     });
   }
 }

 withdraw() {
   if (this.withdrawForm.valid) {
     const withdrawAmount = this.withdrawForm.value; // Get the value from the form
     // const withdrawPassword = this.withdrawForm.value.withdrawPassword; // Get the password from the form

     this.walletService.withdraw(withdrawAmount, this.token).subscribe({
       next: (response) => {
         console.log('Withdrawn successfully:', response);
         // Handle success notification here
       },
       error: (err) => {
         console.error('Withdrawal error:', err);
         // Handle error notification here
       }
     });
   }
 }
 deposit() {
   if (this.depositForm.valid) {
     const depositFormAmount = this.depositForm.value; // Get the value from the form
     // const withdrawPassword = this.withdrawForm.value.withdrawPassword; // Get the password from the form

     this.walletService.deposit(depositFormAmount, this.token).subscribe({
       next: (response) => {
         console.log('Withdrawn successfully:', response);
         // Handle success notification here
       },
       error: (err) => {
         console.error('Withdrawal error:', err);
         // Handle error notification here
       }
     });
   }
 }
}

