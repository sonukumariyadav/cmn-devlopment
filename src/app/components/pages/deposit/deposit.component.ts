import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { WalletServiceService } from 'src/app/services/wallet/wallet-service.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {
  depositForm: FormGroup;
  token: any;
  page = 1;
  sizePerPage = 10;
  transactionType = 'DEPOSIT';
  transactions: any = [];
  totalTransactions: number = 0; 
  loading = false;

  constructor(
    private walletService: WalletServiceService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    // Initialize the form groups in the constructor
    this.depositForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken');
    this.fetchWalletTransactions(this.page, this.sizePerPage);
  }

  deposit() {
    if (this.depositForm.valid) {
      const depositFormAmount = this.depositForm.value;

      this.walletService.deposit(depositFormAmount, this.token).subscribe({
        next: (response) => {
          this.toastr.success(response.body.message, '', {
            toastClass: 'toast-custom toast-success',
            positionClass: 'toast-bottom-center',
            closeButton: false,
            timeOut: 3000,
            progressBar: true
          });
          this.depositForm.reset();
          this.fetchWalletTransactions(this.page, this.sizePerPage); // Refresh transactions after deposit
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Error validating deposit';
        
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

  fetchWalletTransactions(page: number, sizePerPage: number) {
    if (this.token) {
      this.walletService.getWalletTransactions(page, sizePerPage, this.transactionType, this.token).subscribe({
        next: (response) => {
          this.transactions = response.data.docs; // Adjust based on your response structure
          this.totalTransactions = response.total; // Assuming your response contains the total transaction count
          console.log(this.transactions);
        },
        error: (error) => {
          console.error('Error fetching wallet transactions:', error);
        }
      });
    }
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1; // MatPaginator pageIndex starts from 0
    this.sizePerPage = event.pageSize;
    this.fetchWalletTransactions(this.page, this.sizePerPage);
  }
}
