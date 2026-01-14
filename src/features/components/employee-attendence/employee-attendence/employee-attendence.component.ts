import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-attendence',
  imports: [MaterialModule, CommonModule],
  templateUrl: './employee-attendence.component.html',
  styleUrl: './employee-attendence.component.scss'
})
export class EmployeeAttendenceComponent implements OnInit {
  constructor() { }

  report: any;
  workingDays = 31;
  presentDays = 20;
  absentDays = 11;
  xrayDone = 646;
  logs: any[] = [
    { date: '1 Apr, 2023', clockIn: '9:06', xrayDone: 30, clockOut: '7:08', totalTime: '10:02' }
    // Add more dummy entries as needed
  ];


  ngOnInit(): void {
    this.report = history.state.report;
  }


}