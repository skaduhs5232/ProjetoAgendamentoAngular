// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Login {
  email: string;
  senha: string;
}

@Injectable({
  providedIn: 'root' 
})
export class ApiService {
  private baseUrl = 'http://localhost:3333'

  constructor(private http: HttpClient) { }

  getPosts(teste: Login): Observable<Login> {
    return this.http.post<Login>(`${this.baseUrl}/getLogin`, teste);
  }

  createPost(postData: Login): Observable<Login> {
    return this.http.post<Login>(`${this.baseUrl}/createLogin`, postData);
  }

 
}
