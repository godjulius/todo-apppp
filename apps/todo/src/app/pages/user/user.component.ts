import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccountService, IProfile} from "../../shared/services/account.service";
import {finalize, Observable} from "rxjs";
import {LoadingService} from "../../shared/app-loading/loading.service";
import {Store} from "@ngrx/store";
import {selectProfile} from "../../store/user.selector";
import {MatDialog} from "@angular/material/dialog";
import {UserSettingsComponent} from "./user-settings/user-settings.component";
import {BASE_URL} from "../../core/constant/ApiConstant";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatListItem} from "@angular/material/list";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-user',
  standalone: true,
    imports: [CommonModule, MatTooltipModule, MatListItem, TranslatePipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  accountService = inject(AccountService);
  destroyRef = inject(DestroyRef)
  dialog = inject(MatDialog)
  loadingService = inject(LoadingService)
  store = inject(Store<{ profile: IProfile}>)
  avatarUrl = BASE_URL
  profile$: Observable<IProfile>
  profile = signal<IProfile>({
    id: -1,
    username: '',
    email: '',
    avatar: ''
  });
  constructor (
  ) {
    this.profile$ = this.store.select(selectProfile);
  }

  ngOnInit() {
    const profileSubs = this.profile$.subscribe((profile) => {
      this.profile.set(profile);
      this.avatarUrl += profile.avatar
    })
    this.destroyRef.onDestroy(() => {
      profileSubs.unsubscribe();
    });
  }

  openDialog() {
    const data = this.profile();
    this.dialog.open(UserSettingsComponent, {
      data,
    });
  }

  handleErrorAvatar() {
    this.avatarUrl = './assets/images/default_avt.jpg';
  }

}
