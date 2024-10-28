import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WalletServiceService } from 'src/app/services/wallet/wallet-service.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent  implements OnInit {
  depositForm: FormGroup;
  token: any;
  constructor(
    private walletService: WalletServiceService,
    private fb: FormBuilder, // Inject FormBuilder
    private toastr: ToastrService
  ) {
    
    // Initialize the form groups in the constructor
    this.depositForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
    });

   
  }

  
  ngOnInit(): void {
    this.token = localStorage.getItem('authToken');

  }

  deposit() {
    if (this.depositForm.valid) {
      const depositFormAmount = this.depositForm.value; // Get the value from the form
      // const withdrawPassword = this.withdrawForm.value.withdrawPassword; // Get the password from the form

      this.walletService.deposit(depositFormAmount, this.token).subscribe({
        next: (response) => {
          this.toastr.success(response.message, '', {
            toastClass: 'toast-custom toast-success',
            positionClass: 'toast-bottom-center',
            closeButton: false,
            timeOut: 3000,
            progressBar: true
          });
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Error validating referral code';
        
          this.toastr.error(errorMessage, '', {
            toastClass: 'toast-custom toast-error',
            positionClass: 'toast-bottom-center',
            closeButton: false,
            timeOut: 3000,
            progressBar: true
          });
        }
      });
    }
  }
}


