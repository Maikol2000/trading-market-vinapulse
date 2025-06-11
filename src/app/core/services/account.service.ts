import { Injectable } from '@angular/core';
import { IResponse } from '@app/shared/models';
import { ApiService } from '@app/shared/services';
import { IAccount } from '../models';

@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(private service: ApiService) {}

  getProfile() {
    return this.service.get<IResponse<IAccount>>('/account/profile');
  }
}
