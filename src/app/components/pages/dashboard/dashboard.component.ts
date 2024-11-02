import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { AuthServicesService } from 'src/app/services/auth/auth-services.service';
import { TransactionServicesService } from 'src/app/services/transaction/transaction-services.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {


  token: any;
  loading = false;
  userBlance: any = 0
  totalStakedBalance: any = 0
  totalWithdrawalBalance: any = 0
  totalTeamTurnoverBalance: any = 0
  totalDirectTeamTurnoverBalance: any = 0
  totalInternalTransferBalance: any = 0
  totalUnlockRewardBalnce: any = 0
  totalReferralRewardBalance: any = 0
  totalRewardBalance: any = 0
  avaliableRewards: any = 0
  refferalcode: any = ''
  bondBalance: any = ''
  totalCredited: number = 0;
  totalDebited: number = 0;
  totalTransactions: number = 0; // total transactions for paginator
  pageSize: number = 10;
  currentPage: number = 1;
  filteredTransactions: any[] = []; // Store filtered transactions
  // Filter properties
  transactionType: string = '';
  status: string = '';
  startDate: string = '';
  endDate: string = '';
  transactions: any[] = [];
  error: any;
  constructor(private authService: AuthServicesService,
    private toastr: ToastrService ,private transactionService: TransactionServicesService) {

  }
  ngOnInit(): void {



    // Retrieve the token and profile info
    this.token = localStorage.getItem('authToken');
    this.getProfileInfo();

    this.fetchTransactions(this.currentPage, this.pageSize);
  }



  getProfileInfo(): void {
    this.loading = true;
    this.authService.getProfile(this.token).subscribe({
      next: (response) => {

        this.userBlance = response.data.BUSDBalance
        this.totalStakedBalance = response.data.totalStakedBalance
        this.totalWithdrawalBalance = response.data.totalWithdrawalBalance
        this.totalDirectTeamTurnoverBalance = response.data.totalDirectTeamTurnoverBalance
        this.totalInternalTransferBalance = response.data.totalInternalTransferBalance
        this.totalUnlockRewardBalnce = response.data.totalUnlockRewardBalnce
        this.totalReferralRewardBalance = response.data.totalReferralRewardBalance
        // this.totalRewardBalance = response.data.totalRewardBalance
        this.bondBalance = response.data.totalStakingRewardBalance
        // this.bondBalance = response.data.totalReferralRewardBalance
        this.refferalcode = response.data.referralCode
        this.avaliableRewards = response.data.totalRewardBalance - this.totalUnlockRewardBalnce
        localStorage.setItem('balance', this.avaliableRewards)
        localStorage.setItem('isTrxPassCreated', response.data.isTrxPassCreated)
        localStorage.setItem('isWalletAdded', response.data.isWalletAdded)
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to load profile information', 'Error');
        this.loading = false;
      }
    });
  }

  fetchTransactions(page: number, size: number): void {
    this.loading = true;

    // Construct parameters object
    const params: any = {
      page: page.toString(),
      sizePerPage:'10',
      // limit: '10', // Limit to the latest 10 transactions
    };

    // Add filtering parameters only if they have values
    if (this.transactionType) {
      params.transactionType = this.transactionType;
    }
    if (this.status) {
      params.status = this.status;
    }
    if (this.startDate) {
      params.startDate = this.startDate;
    }
    if (this.endDate) {
      params.endDate = this.endDate;
    }

    this.transactionService.getTransactions(page, size, this.token!, params).subscribe({
      next: (response: any) => {
        this.transactions = response.data.docs;
        this.filteredTransactions = [...this.transactions]; // Initialize filtered transactions
        this.totalTransactions = response.data.totalDocs; // total count for pagination
        this.calculateTotals(); // Calculate totals when transactions are fetched
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transactions';
        this.loading = false;
      }
    });
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.refferalcode).then(() => {
      alert('Referral code copied to clipboard!'); // Optional: show a success message
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  applyFilters(): void {
    // Reset current page to 1 when applying new filters
    this.currentPage = 1;
    // Call fetchTransactions with updated filters
    this.fetchTransactions(this.currentPage, this.pageSize);
  }


  calculateTotals(): void {
    this.totalCredited = this.transactions
      .filter(transaction => transaction.amount > 0)
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    this.totalDebited = this.transactions
      .filter(transaction => transaction.amount < 0)
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  }
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1; // MatPaginator pageIndex starts from 0
    this.pageSize = event.pageSize;
    this.fetchTransactions(this.currentPage, this.pageSize);
  }


}
