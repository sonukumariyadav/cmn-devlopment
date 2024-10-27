import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.staging';

@Injectable({
  providedIn: 'root'
})
export class WalletServiceService {
  private baseUrl = `${environment.apiUrl}`; // Replace with your actual base URL

  constructor(private http: HttpClient) {}

  stake(body: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', token);
    
    // // Ensure amount is converted to string if necessary
    // const body = new HttpParams().set('amount', amount.toString());

    return this.http.post(`${this.baseUrl}/user/staking`, body, { headers, observe: 'response' })
      .pipe(
        catchError(this.handleError) // Handle error gracefully
      );
  }

  withdraw(body: any,  token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', token);

    return this.http.post(`${this.baseUrl}/user/wallet/withdraw/usdt`, body, { headers, observe: 'response' })
      .pipe(
        catchError(this.handleError) // Handle error gracefully
      );
  }
  deposit(body: any,  token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', token);

    return this.http.post(`${this.baseUrl}/user/wallet/deposit`, body, { headers, observe: 'response' })
      .pipe(
        catchError(this.handleError) // Handle error gracefully
      );
  }

  convertWalletFormData( token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', token);

    return this.http.post(`${this.baseUrl}/user/wallet/convert`, { headers, observe: 'response' })
      .pipe(
        catchError(this.handleError) // Handle error gracefully
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
