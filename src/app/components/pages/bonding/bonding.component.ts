import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WalletServiceService } from 'src/app/services/wallet/wallet-service.service';

@Component({
  selector: 'app-bonding',
  templateUrl: './bonding.component.html',
  styleUrls: ['./bonding.component.scss']
})
export class BondingComponent {
  stakeForm: FormGroup;
  token: any;

  constructor(
    private walletService: WalletServiceService,
    private fb: FormBuilder, // Inject FormBuilder
    private toastr: ToastrService
  ) {
    // Initialize the form groups in the constructor
    this.stakeForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
    });
   
    
   
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken');
   
  }

  stake() {
    if (this.stakeForm.valid) {
      const stakeAmount = this.stakeForm.value; // Get the value from the form
      this.walletService.stake(stakeAmount, this.token).subscribe({
        next: (response:any) => {
          console.log("response",response);
          
          this.toastr.success(response.body.message, '', {
            toastClass: 'toast-custom toast-success',
            positionClass: 'toast-bottom-center',
            closeButton: false,
            timeOut: 3000,
            progressBar: true
          });
          this.stakeForm.reset()
          // Handle success notification here
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
