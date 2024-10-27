import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServicesService } from '../../../services/auth/auth-services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isDarkMode = false;
  isPasswordVisible: boolean = false;
  loginForm: FormGroup; // Define the login form

  constructor(
    private fb: FormBuilder,
    private authServices: AuthServicesService,
    private router: Router,
    private toastr: ToastrService
  ) {
    // Initialize the login form with validation
    this.loginForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
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

  ngOnInit() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
      this.isDarkMode = true;
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    if (this.loginForm) {
      const loginData = this.loginForm.value;
      console.log('Login data', loginData);

      this.authServices.login(loginData).subscribe({
        next: (response: any) => {
          const token = response.data.token;
          if (token) {
            localStorage.setItem('authToken', token); // Save token to localStorage
            this.toastr.success(response.message, '', {
              toastClass: 'toast-custom toast-success',
              positionClass: 'toast-bottom-center',
              closeButton: false,
              timeOut: 3000,
              progressBar: true
            });
            this.router.navigate(['/dashboard']); // Navigate to the dashboard
          } else {
            this.toastr.error(response.message, '', {
              toastClass: 'toast-custom toast-error',
              positionClass: 'toast-bottom-center',
              closeButton: false,
              timeOut: 3000,
              progressBar: true
            });
          }
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Something went wrong';
          this.toastr.error(errorMessage, '', {
            toastClass: 'toast-custom toast-error',
            positionClass: 'toast-bottom-center',
            closeButton: false,
            timeOut: 3000,
            progressBar: true
          });
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
