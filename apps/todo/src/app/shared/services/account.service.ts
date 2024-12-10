import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BASE_URL} from "../../core/constant/ApiConstant";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  httpClient = inject(HttpClient);

  signIn(body: ISignInBody) {
    const url = `${BASE_URL}/sign-in`;
    return this.httpClient.post(url, body);
  }

  signUp(body: ISignUpBody) {
    const url = `${BASE_URL}/sign-up`;
    return this.httpClient.post(url, body);
  }

  getProfile() {
    const url = `${BASE_URL}/me`;
    return this.httpClient.get(url);
  }
}

export interface ISignInBody {
  email: string;
  password: string;
}

export interface ISignUpBody {
  username: string;
  email: string;
  password: string;
}

export interface IProfile {
  id: number,
  username: string,
  email: string,
  avatar: string
}