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

  constructor(private transactionService: TransactionServicesService) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken');
    this.fetchTransactions(this.currentPage, this.pageSize);
  }

  fetchTransactions(page: number, size: number): void {
    this.loading = true;
    this.transactionService.getTransactions(page, size, this.token).subscribe({
      next: (response: any) => {
        this.transactions = response.data.docs;
        this.totalTransactions = response.data.totalDocs; // total count for pagination
        this.calculateTotals();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transactions';
        this.loading = false;
      }
    });
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
