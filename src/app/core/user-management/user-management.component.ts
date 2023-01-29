import { Component, OnInit } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { User } from 'src/app/interface/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit {
  selectAllCheckbox: boolean = false;

  users: User[] = [];

  getCurrentUser: any;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.selectedUsers();
    this.getCurrentUser = this.authService.getDecodedToken();

    this.userService
      .getUsers()
      .pipe(
        map((data) => {
          return data.users;
        }),
        map((users) => {
          return users.map((user) => {
            return {
              ...user,
              selected: false,
            };
          });
        })
      )
      .subscribe((data) => {
        this.users = data;
      });
  }

  selectAll() {
    this.selectAllCheckbox = !this.selectAllCheckbox;
    this.users.forEach((user) => {
      user.selected = this.selectAllCheckbox;
    });
    this.selectedUsers();
  }

  selectedUser(user: User) {
    user.selected = !!user.selected;
    this.selectedUsers();
  }

  selectedUsers() {
    return this.users.filter((user) => user.selected);
  }

  blockUsers() {
    this.userService
      .blockUsers(this.selectedUsers().map((user) => user._id))
      .pipe(
        switchMap(() => {
          return this.userService.getUsers();
        })
      )
      .subscribe(
        (data) => {
          this.users = data.users;

          this.users.find((user) => {
            if (user._id === this.getCurrentUser._id) {
              if (user.is_blocked === true) {
                this.authService.logout();
              }
            }
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  unblockUsers() {
    this.userService
      .unblockUsers(this.selectedUsers().map((user) => user._id))
      .pipe(
        switchMap(() => {
          return this.userService.getUsers();
        })
      )
      .subscribe(
        (data) => {
          this.users = data.users;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  deleteUsers() {
    this.userService
      .deleteUsers(this.selectedUsers().map((user) => user._id))
      .pipe(
        switchMap(() => {
          return this.userService.getUsers();
        })
      )
      .subscribe(
        (data) => {
          this.users = data.users;

          if (data.users.length === 0) {
            this.authService.logout();
          }

          this.users.find((user) => {
            console.log(user._id, this.getCurrentUser._id);
            if (user._id === this.getCurrentUser._id) {
              return;
            } else {
              this.authService.logout();
            }
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
