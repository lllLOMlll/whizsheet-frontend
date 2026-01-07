import {
  Component,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  form,
  Field,
  required,
  email,
  submit,
} from '@angular/forms/signals';

interface LoginData {
  email: string;
}

@Component({
  selector: 'app-login',
  imports: [Field],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class LoginComponent {
  loginModel = signal<LoginData>({
    email:'',
  });

  loginForm = form(this.loginModel, (field) =>{
    required(field.email, {
      message: 'Email is required',
    });
    email(field.email, {
      message: 'Enter a valid email address',
    });
  });

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.loginForm, async () => {
      const { email } = this.loginModel();

      console.log('Login requeste for:', email);

      // Étape 2 : appel au AuthService.login(email)
    });
  }

   loginWithGoogle() {
      console.log('Rerdirect to Google login');
    }

}
