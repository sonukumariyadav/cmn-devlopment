import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { AuthServicesService } from 'src/app/services/auth/auth-services.service';

@Component({
  selector: 'app-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.scss']
})
export class TreeListComponent implements OnInit {

  loading = false;
  isDarkMode: boolean = false;
  token: any;
  referralTree: any[] = [];
  filteredReferrals: any[] = [];
  searchQuery: string = '';
  pageSize: number = 10;
  currentPage: number = 1;
  selectedReferral: any   // Store selected referral for the modal


  constructor(
    private authService: AuthServicesService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken');
    this.fetchReferralTree();
  }

  fetchReferralTree(): void {
    this.loading = true;
    this.authService.getReferralTree(this.token).subscribe({
      next: (response: any) => {
        this.referralTree = response.data; // Adjust this according to actual API response
        this.filterReferrals();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch referral tree', err);
        this.toastr.error('Failed to fetch referral data');
        this.loading = false;
      }
    });
  }

  filterReferrals(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredReferrals = this.referralTree.filter(referral =>
      referral.referralCode.toLowerCase().includes(query) ||
      referral.name.toLowerCase().includes(query) ||
      referral.email.toLowerCase().includes(query) ||
      referral.mobile.toLowerCase().includes(query)
    );
  }
  getReferralInfo(referralCode: string): void {
    this.authService.getReferralInfomation(referralCode, this.token).subscribe({
      next: (response: any) => {
        this.selectedReferral = response.data

        console.log('Referral Info:', response.data);
        // Process the referral information as needed
      },
      error: (err) => {
        console.error('Failed to retrieve referral info', err);
        this.toastr.error('Failed to retrieve referral data');
      }
    });
  }

  onSearchChange(): void {
    this.filterReferrals();
    this.currentPage = 1; // Reset to first page on new search
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1; // MatPaginator pageIndex starts from 0
    this.pageSize = event.pageSize;
  }


}
