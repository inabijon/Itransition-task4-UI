import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit, OnDestroy {
  error: string | null = null;
  message: string | null = null;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.errorListener
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        this.error = error;

        setTimeout(() => {
          this.error = null;
        }, 3000);
      });

    this.authService.messageListener
      .pipe(takeUntil(this.destroy$))
      .subscribe((message) => {
        this.message = message;
        setTimeout(() => {
          this.error = null;
        }, 3000);
      });
  }

  signupForm(signup: NgForm) {
    this.authService.signup(signup.value);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
