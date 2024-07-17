import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toast } from 'ngx-sonner';
import { blockIcon, trashIcon, unblockIcon } from '../../icons/icons';
import { User } from '../../models/user.model';
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
    private datePipe: DatePipe
  ) {
    this.blockIcon = this.sanitizer.bypassSecurityTrustHtml(blockIcon);
    this.unblockIcon = this.sanitizer.bypassSecurityTrustHtml(unblockIcon);
    this.trashIcon = this.sanitizer.bypassSecurityTrustHtml(trashIcon);
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe(
      data => {
        this.users = data.map(user => ({
          ...user,
          lastLogin: this.getLastLogin(),
          createdAt: this.datePipe.transform(user.createdAt, 'short'),
          status: user.active ? 'Active' : 'Blocked',
          selected: false,
        }));
      },
      error => {
        console.error('Error fetching users', error);
      }
    );
  }

  getLastLogin(): string {
    const loginTime = localStorage.getItem('loginTime');
    return loginTime ? new Date(loginTime).toLocaleString() : 'short';
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

  blockUsers() {
    const selectedUsers = this.getSelectedCheckboxes();
    selectedUsers.forEach(user => {
      this.userService.blockUser(user.id).subscribe(
        () => {
          user.status = 'Blocked';
          user.active = false;
          toast.success(`${user.name} has been blocked`);
        },
        error => {
          console.error(`User ${user.name} already blocked`, error);
          toast.error(`User ${user.name} already blocked`);
        }
      );
    });
  }

  unblockUsers() {
    const selectedUsers = this.getSelectedCheckboxes();
    selectedUsers.forEach(user => {
      this.userService.unblockUser(user.id).subscribe(
        () => {
          user.status = 'Active';
          user.active = true;
          toast.success(`${user.name} has been unblocked`);
        },
        error => {
          console.error(`User ${user.name} already unblocked`, error);
          toast.error(`User ${user.name} already unblocked`);
        }
      );
    });
  }

  deleteUsers() {
    const selectedUsers = this.getSelectedCheckboxes();
    selectedUsers.forEach(user => {
      this.userService.deleteUser(user.id).subscribe(
        () => {
          this.users = this.users.filter(u => u.id !== user.id);
          toast.success(`${user.name} has been deleted`);
        },
        error => {
          console.error(`Error deleting user ${user.name}`, error);
          toast.error(`Error deleting user ${user.name}`);
        }
      );
    });
  }
}
