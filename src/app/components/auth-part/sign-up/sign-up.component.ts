import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServicesService } from '../../../services/auth/auth-services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  signUpForm: any;
  otpForm: any;  // Add an OTP form for user input
  isOtpSent: boolean = false; // Track if OTP has been sent
  isDarkMode: boolean = false;  
  isPasswordVisible: boolean = false;  

  constructor(
    private fb: FormBuilder,
    private authServices: AuthServicesService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cnfPassword: ['', Validators.required],
      referral: ['', Validators.required],
      termsConditions: [false, Validators.requiredTrue],
    });

    // Initialize the OTP form
    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    });
  }

  ngOnInit() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
      this.isDarkMode = true;
    }
  }

  toggleDarkMode(data: boolean) {
    this.isDarkMode = !this.isDarkMode;
    const rootElement = document.documentElement; 
    if (data) {
      rootElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      rootElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const userData = this.signUpForm.value;

      this.authServices.signUp(userData).subscribe({
        next: (response: any) => {
          this.toastr.success('Staked successfully!', 'Otp is sent successfully', {
            progressBar: true,
            closeButton: true,
            toastClass: 'toast-success' // Custom class for success
          });
          this.sendOtp(userData.mobile, userData.email); // Send OTP after successful signup
        },
        error: (err) => {
          this.toastr.error(err.error.message || 'Signup failed. Please try again.', 'Error', {
            progressBar: true,
            closeButton: true,
            toastClass: 'toast-error' // Custom class for error
          });
        }
      });
    } else {
      this.toastr.error('Form is invalid', 'Error', {
        progressBar: true,
        closeButton: true,
        toastClass: 'toast-error' // Custom class for error
      });
      console.log('Form is invalid');
    }
  }

  sendOtp(mobile: string, email: string) {
    this.authServices.sendEmailOtp(email, mobile).subscribe({
      next: (response) => {
        this.isOtpSent = true; // Set flag to true indicating OTP has been sent
        this.toastr.success('OTP sent to your email and mobile.');
      },
      error: (err) => {
        this.toastr.error('Failed to send OTP. Please try again.', err);
      }
    });
  }

  verifyOtp() {
    const otpValue = this.otpForm.value.otp;
    const mobile = this.signUpForm.value.mobile;
    const email = this.signUpForm.value.email;

    this.authServices.verifyOtp(mobile, email, otpValue).subscribe({
      next: (response) => {
        this.toastr.success('OTP verified successfully.');
        this.router.navigate(['/login']); // Redirect to login page
      },
      error: (err) => {
        this.toastr.error('OTP verification failed. Please try again.', err);
      }
    });
  }
}
