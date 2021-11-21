import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  loginState: {
    isLoggedIn: boolean,
    message: string
  }
  loading: boolean;
  constructor(private router: Router, private authService: AuthService) {
    this.username = '';
    this.password = '';
    this.loginState = {
      isLoggedIn: false,
      message: ''
    };
    this.loading = false;
  }

  ngOnInit(): void {
  }

  login(): void {
    this.loading = true;
    this.authService.login(this.username, this.password)
      .subscribe((response: AuthResponse) => {
        console.log(response);
        if (response && response.message && response.message === 'Auth sucessful') {
          this.handleLoginStates(true, response.message);
          localStorage.setItem('token', response.token);
          this.navigate();
        } else {
          this.handleLoginStates(false, 'Please try again');
        }
        this.loading = false;
      }, () => {
        this.loading = false;
        this.handleLoginStates(false, 'Please try again');
      })
  }

  handleLoginStates(status: boolean, msg: string) {
    this.loginState.isLoggedIn = status;
    this.loginState.message = msg;
  }

  navigate() {
    setTimeout(() => {
      this.router.navigate(['/map']);
    }, 500);
  }
}
