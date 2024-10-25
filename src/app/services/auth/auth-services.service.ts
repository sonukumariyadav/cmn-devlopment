import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.staging';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthServicesService {



  private apiUrl = `${environment.apiUrl}`; // Adjust the endpoint according to your API

  constructor(private http: HttpClient) { }

  // Method to sign up a user
  signUp(userData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/user/auth/register`, userData, { headers });
  }
  // Method to sign up a user
  login(userData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/user/auth/login`, userData, { headers });
  }

  // Method to send OTP to email
  sendEmailOtp(email: string, mobile: string): Observable<any> {
    const body = { email, mobile };
    return this.http.post(`${this.apiUrl}/user/auth/send/otp`, body);
  }


  // Method to verify OTP
  verifyOtp(mobile: string, email: string, otp: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('mobile', mobile);
    body.set('email', email);
    body.set('otp', otp);

    return this.http.patch(`${this.apiUrl}/verify/otp`, body.toString(), { headers });
  }


  getProfile(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token
    });
    return this.http.get(`${this.apiUrl}/user/profile`, { headers });
  } 

 

  // Method to sign up a user
  updateProfile(token: string, updatedData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': token, 'Content-Type': 'application/json' });

  
    return this.http.put(`${this.apiUrl}/user/profile/update`, updatedData, { headers });
  }
}
