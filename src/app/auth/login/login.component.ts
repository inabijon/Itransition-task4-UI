import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  error: string | null = null;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.errorListener.subscribe((error) => {
      this.error = error;

      setTimeout(() => {
        this.error = null;
      }, 3000);
    });
  }
  loginForm(login: NgForm) {
    if (login.invalid) {
      return;
    }

    this.authService.login(login.value);

    login.resetForm();
  }
}
