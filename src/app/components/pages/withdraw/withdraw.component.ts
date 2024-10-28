import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WalletServiceService } from 'src/app/services/wallet/wallet-service.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent {

  withdrawForm: FormGroup;
  token: any;

  constructor(
    private walletService: WalletServiceService,
    private fb: FormBuilder, // Inject FormBuilder
    private toastr: ToastrService
  ) {
    // Initialize the form groups in the constructor
    
    this.withdrawForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      password: ['', [Validators.required]],
    });
   
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken');
  }

  withdraw() {
    if (this.withdrawForm.valid) {
      const withdrawAmount = this.withdrawForm.value; // Get the value from the form
      // const withdrawPassword = this.withdrawForm.value.withdrawPassword; // Get the password from the form

      this.walletService.withdraw(withdrawAmount, this.token).subscribe({
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
