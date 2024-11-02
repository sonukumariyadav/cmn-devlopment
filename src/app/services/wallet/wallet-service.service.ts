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

    return this.http.post(`${this.baseUrl}/user/wallet/convert`,{} ,{ headers })
      .pipe(
        catchError(this.handleError) // Handle error gracefully
      );
  }

  fundTransferData(depositData: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': token,
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    // Convert the object to URL-encoded format
    const body = new URLSearchParams();
    body.set('amount', depositData.amount);
    body.set('referralCode', depositData.referralCode);
    body.set('password', depositData.password);

    return this.http.post(`${this.baseUrl}/user/wallet/transfer`, body.toString(), { headers });
  }


  getWalletTransactions(page: number, sizePerPage: number, transactionType: string, token: string): Observable<any> {
    const url = `${this.baseUrl}/user/wallet/?page=${page}&sizePerPage=${sizePerPage}&transactionType=${transactionType}`;
    const headers = new HttpHeaders({
      'Authorization': token
    });

    return this.http.get(url, { headers });
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }

  
}
