import { Injectable } from '@angular/core';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor, HttpEventType, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.authService.currentUserValue;
    if(user){
      const token = user.token;
      const newrequest = request.clone({
        setHeaders: {
          Authorization: 'Bearer '+token
        }
      });

      return next.handle(newrequest).pipe(
        catchError(err => {
          if (err.status === 401) {
            this.authService.logout();
            window.location.reload();
            
        }
        
        const error = err.error.message || err.statusText;
        return throwError(error);
        })
      );
    }

    return next.handle(request);
  }
}
