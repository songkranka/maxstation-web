import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = localStorage.getItem('jwt');
    const modifiedReq = req.clone({ 
      headers: req.headers.set('Authorization', `Bearer ${jwtToken}`),
    });
    return next.handle(modifiedReq);
  }
}