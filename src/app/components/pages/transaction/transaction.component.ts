import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionServicesService } from '../../../services/transaction/transaction-services.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  transactions: any[] = [];
  loading = false;
  error: string | null = null;
  token: any;
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

  constructor(private transactionService: TransactionServicesService) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken');
    this.fetchTransactions(this.currentPage, this.pageSize);
  }

  fetchTransactions(page: number, size: number): void {
    this.loading = true;

    // Construct parameters object
    const params: any = {
        page: page.toString(),
        sizePerPage: size.toString(),
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
            this.loading = false;
        },
        error: (err) => {
            this.error = 'Failed to load transactions';
            this.loading = false;
        }
    });
}


  applyFilters(): void {
    this.filteredTransactions = this.transactions.filter(transaction => {
      const matchesTransactionType = this.transactionType ? transaction.transactionType === this.transactionType : true;
      const matchesStatus = this.status ? transaction.status === this.status : true;
      const matchesStartDate = this.startDate ? new Date(transaction.createdAt) >= new Date(this.startDate) : true;
      const matchesEndDate = this.endDate ? new Date(transaction.createdAt) <= new Date(this.endDate) : true;

      return matchesTransactionType && matchesStatus && matchesStartDate && matchesEndDate;
    });
    
    this.totalTransactions = this.filteredTransactions.length; // Update total transactions for paginator
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
