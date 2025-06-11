import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    accountNumber: '1234567890',
    joinDate: new Date('2023-01-15'),
  };

  kycStatus: string = 'Not Verified'; // Can be 'Not Verified', 'Pending', or 'Verified'

  ngOnInit(): void {
    // Initialize component, fetch user data and KYC status if needed
  }
}
