import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  currentDate = new Date();

  stats = [
    { label: 'Total Incidents', value: 12, icon: '📊', color: '#2563eb', bg: '#eff6ff' },
    { label: 'Resolved', value: 8, icon: '✅', color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Pending', value: 3, icon: '⏳', color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Critical', value: 1, icon: '🚨', color: '#dc2626', bg: '#fef2f2' }
  ];

  quickActions = [
    { title: 'Report Incident', desc: 'Submit a new cybersecurity incident report', icon: '🛡️', color: '#2563eb' },
    { title: 'View Incidents', desc: 'Browse and filter all reported incidents', icon: '📋', color: '#7c3aed' },
    { title: 'My Reports', desc: 'View incidents you have submitted', icon: '📄', color: '#0891b2' }
  ];

  recentActivity = [
    { id: 'INC-2024-001', type: 'Phishing Attack', status: 'Resolved', severity: 'High', date: '2024-09-20' },
    { id: 'INC-2024-002', type: 'Malware Detected', status: 'In Progress', severity: 'Critical', date: '2024-09-21' },
    { id: 'INC-2024-003', type: 'Unauthorized Access', status: 'Pending', severity: 'Medium', date: '2024-09-22' },
    { id: 'INC-2024-004', type: 'Data Breach Attempt', status: 'Resolved', severity: 'High', date: '2024-09-23' },
    { id: 'INC-2024-005', type: 'DDoS Attack', status: 'Pending', severity: 'Low', date: '2024-09-24' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Resolved': return 'status--resolved';
      case 'In Progress': return 'status--progress';
      case 'Pending': return 'status--pending';
      default: return '';
    }
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'Critical': return 'severity--critical';
      case 'High': return 'severity--high';
      case 'Medium': return 'severity--medium';
      case 'Low': return 'severity--low';
      default: return '';
    }
  }
}
