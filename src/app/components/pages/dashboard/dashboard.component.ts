import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthServicesService } from 'src/app/services/auth/auth-services.service';

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


  constructor(private authService: AuthServicesService,
    private toastr: ToastrService) {

  }
  ngOnInit(): void {



    // Retrieve the token and profile info
    this.token = localStorage.getItem('authToken');
    this.getProfileInfo();
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
        this.totalRewardBalance = response.data.totalRewardBalance
        this.avaliableRewards = response.data.totalRewardBalance - this.totalUnlockRewardBalnce

        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to load profile information', 'Error');
        this.loading = false;
      }
    });
  }


}
