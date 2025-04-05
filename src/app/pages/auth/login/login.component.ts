import { Component } from '@angular/core';
import { LoginFormComponent } from '@app/components/auth';

@Component({
  selector: 'app-login',
  imports: [LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
