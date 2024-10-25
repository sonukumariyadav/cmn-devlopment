import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormBuilder, FormGroup, and Validators
import { SettingServicesService } from '../../../services/setting/setting-services.service'; // Import the service

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent { 

 // Declare form groups
 updateWalletAddressForm: FormGroup;
 createTransactionPasswordForm: FormGroup;
 changeTransactionPasswordForm: FormGroup;
 convertWalletForm:FormGroup
 token: any;

 constructor(
   private settingServicesService: SettingServicesService,
   private fb: FormBuilder // Inject FormBuilder
 ) {
  this.createTransactionPasswordForm = this.fb.group({
    password: ['', Validators.required],
    cnfPassword: ['', Validators.required]
  });

  this.changeTransactionPasswordForm = this.fb.group({
    prevPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    cnfPassword: ['', Validators.required]
  });

  this.updateWalletAddressForm = this.fb.group({
    address: ['', Validators.required]
  });

  this.convertWalletForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(1)]]
  });
 }

 ngOnInit(): void {
   this.token = localStorage.getItem('authToken');
 }

 

 createTransactionPassword() {
   if (this.createTransactionPasswordForm.valid) {
     const createTransactionPassword = this.createTransactionPasswordForm.value; // Get the value from the form
     // const withdrawPassword = this.withdrawForm.value.withdrawPassword; // Get the password from the form

     this.settingServicesService.createTransactionPasswordData(createTransactionPassword, this.token).subscribe({
       next: (response) => {
         console.log('createTransactionPassword successfully:', response);
         // Handle success notification here
       },
       error: (err) => {
         console.error('createTransactionPassword error:', err);
         // Handle error notification here
       }
     });
   }
 }
 changeTransactionPassword() {
   if (this.changeTransactionPasswordForm.valid) {
     const changeTransactionPassword = this.changeTransactionPasswordForm.value; // Get the value from the form
     // const withdrawPassword = this.withdrawForm.value.withdrawPassword; // Get the password from the form

     this.settingServicesService.changeTransactionPasswordData(changeTransactionPassword, this.token).subscribe({
       next: (response) => {
         console.log('changeTransactionPassword successfully:', response);
         // Handle success notification here
       },
       error: (err) => {
         console.error('changeTransactionPassword error:', err);
         // Handle error notification here
       }
     });
   }
 }

 updateWalletAddress() {
  if (this.updateWalletAddressForm.valid) {
    const updateWalletAddress = this.updateWalletAddressForm.value; // Get the value from the form
    this.settingServicesService.updateWalletAddressData(updateWalletAddress, this.token).subscribe({
      next: (response) => {
        console.log('updateWalletAddress successfully:', response);
        // Handle success notification here
      },
      error: (err) => {
        console.error('updateWalletAddress error:', err);
        // Handle error notification here
      }
    });
  }
}
 convertWallet() {
   if (this.convertWalletForm.valid) {
     const convertWallet = this.convertWalletForm.value; // Get the value from the form
     // const withdrawPassword = this.withdrawForm.value.withdrawPassword; // Get the password from the form

     this.settingServicesService.convertWalletFormData(convertWallet, this.token).subscribe({
       next: (response) => {
         console.log('convertWallet successfully:', response);
         // Handle success notification here
       },
       error: (err) => {
         console.error('convertWallet error:', err);
         // Handle error notification here
       }
     });
   }
 }
}

