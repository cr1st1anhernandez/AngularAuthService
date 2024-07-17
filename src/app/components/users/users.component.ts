import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toast } from 'ngx-sonner';
import { blockIcon, trashIcon, unblockIcon } from '../../icons/icons';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  selectAll = false;
  blockIcon: SafeHtml;
  unblockIcon: SafeHtml;
  trashIcon: SafeHtml;

  constructor(
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {
    this.blockIcon = this.sanitizer.bypassSecurityTrustHtml(blockIcon);
    this.unblockIcon = this.sanitizer.bypassSecurityTrustHtml(unblockIcon);
    this.trashIcon = this.sanitizer.bypassSecurityTrustHtml(trashIcon);
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  toggleSelectAll() {
    this.users.forEach(user => (user.selected = this.selectAll));
  }

  checkboxChanged() {
    if (this.isAllCheckBoxSelected()) this.selectAll = true;
    else this.selectAll = false;
  }

  isAllCheckBoxSelected() {
    return this.users.every(user => user.selected);
  }

  getSelectedCheckboxes() {
    return this.users.filter(user => user.selected);
  }

  getCurrentUserId(): number {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.id;
    }
    return 0;
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: data => {
        this.users = data.map(user => ({
          ...user,
          lastLogin: this.getLastLogin(),
          createdAt: this.datePipe.transform(user.createdAt, 'short'),
          status: user.active ? 'Active' : 'Blocked',
          selected: false,
        }));
      },
      error: error => {
        console.error('Error fetching users', error);
      },
    });
  }

  getLastLogin(): string {
    const loginTime = localStorage.getItem('loginTime');
    return loginTime ? new Date(loginTime).toLocaleString() : 'short';
  }

  isAllUsersSelected(): boolean {
    return this.users.every(user => user.selected);
  }

  handleSuccess = (user?: User, action?: string) => {
    if (action === 'delete') {
      if (user) {
        this.users = this.users.filter(u => u.id !== user.id);
        toast.success(`${user.name} has been deleted`);
        if (user.id === this.getCurrentUserId()) {
          this.authService.logout();
        }
      } else {
        this.users = [];
        this.authService.logout();
        toast.success('All users have been deleted');
      }
    } else {
      if (user) {
        user.status = action === 'block' ? 'Blocked' : 'Active';
        user.active = action === 'block' ? false : true;
        if (user.id === this.getCurrentUserId() && action === 'block') {
          this.authService.logout();
        }
        toast.success(`${user.name} has been ${action}`);
      } else {
        this.users.forEach(user => {
          user.status = action === 'block' ? 'Blocked' : 'Active';
          user.active = action === 'block' ? false : true;
        });
        toast.success(`All users have been ${action}`);
        if (action === 'block') this.authService.logout();
      }
    }
  };

  handleError = (user?: User, action?: string) => (error: unknown) => {
    const actionVerb =
      action === 'block'
        ? 'blocking'
        : action === 'unblock'
          ? 'unblocking'
          : 'deleting';
    const errorMessage = user
      ? `Error ${actionVerb} user ${user.name}`
      : `Error ${actionVerb} all users`;
    console.error(errorMessage, error);
    toast.error(errorMessage);
  };

  handleUserAction(action: 'block' | 'unblock' | 'delete') {
    const selectedUsers = this.getSelectedCheckboxes();
    if (selectedUsers.length <= 0) return;

    const getUserServiceFunction = (user?: User) => {
      if (action === 'block')
        return user
          ? this.userService.blockUser(user.id)
          : this.userService.blockAllUsers();
      if (action === 'unblock')
        return user
          ? this.userService.unblockUser(user.id)
          : this.userService.unblockAllUsers();
      if (action === 'delete')
        return user
          ? this.userService.deleteUser(user.id)
          : this.userService.deleteAllUsers();
      return null;
    };

    if (this.isAllUsersSelected()) {
      const userService = getUserServiceFunction();
      if (!userService) return;
      userService.subscribe({
        next: () => this.handleSuccess(undefined, action),
        error: this.handleError(undefined, action),
      });
    } else {
      selectedUsers.forEach(user => {
        const userService = getUserServiceFunction(user);
        if (!userService) return;
        userService.subscribe({
          next: () => this.handleSuccess(user, action),
          error: this.handleError(user, action),
        });
      });
    }
  }
}
