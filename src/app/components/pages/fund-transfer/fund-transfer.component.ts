import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WalletServiceService } from 'src/app/services/wallet/wallet-service.service';

@Component({
  selector: 'app-fund-transfer',
  templateUrl: './fund-transfer.component.html',
  styleUrls: ['./fund-transfer.component.scss']
})
export class FundTransferComponent {
  fundTransferForm: FormGroup;
  token: any;

  constructor(
    private walletService: WalletServiceService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    // Initialize the form groups in the constructor
    this.fundTransferForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      referralCode: ['', Validators.required], // Add referral code control
      password: ['', Validators.required], // Add password control
    });
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken');
  }

  fundTransfer() {
    if (this.fundTransferForm.valid) {
      const depositFormData = {
        amount: this.fundTransferForm.value.amount,
        referralCode: this.fundTransferForm.value.referralCode,
        password: this.fundTransferForm.value.password
      };

      this.walletService.fundTransferData(depositFormData, this.token).subscribe({
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
          const errorMessage = err.error?.message || 'Error processing the transaction';
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
