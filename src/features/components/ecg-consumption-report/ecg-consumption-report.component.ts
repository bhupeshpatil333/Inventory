import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../../shared/services/common.service';
import moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ecg-consumption-report',
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './ecg-consumption-report.component.html',
  styleUrl: './ecg-consumption-report.component.scss'
})
export class EcgConsumptionReportComponent implements OnInit {

  displayedColumns: string[] = ['district', 'facility', 'pationtSaved', 'xrayDone', 'action'];
  selectedMonths: any;
  selectedDays: any;

  districtList: any[] = [];
  facilityList: any[] = [];
  ecgReports = [
    { key: 'key1', district: 'District A', facility: 'Facility 1', pationtSaved: 10, xrayDone: 5, createdAt: 1754321187090, updatedAt: 1754321187090 },
    { key: 'key2', district: 'District B', facility: 'Facility 2', pationtSaved: 15, xrayDone: 8, createdAt: 1754321185090, updatedAt: 1754321185090 },
    { key: 'key3', district: 'District C', facility: 'Facility 3', pationtSaved: 20, xrayDone: 12, createdAt: 1754331183090, updatedAt: 1754331183090 },
  ];
  filteredReports: any[] = [];
  daysList: any[] = [
    { key: '0', name: 'Sunday' },
    { key: '1', name: 'Monday' },
    { key: '2', name: 'Tuesday' },
    { key: '3', name: 'Wednesday' },
    { key: '4', name: 'Thursday' },
    { key: '5', name: 'Friday' },
    { key: '6', name: 'Saturday' }
  ]
  monthsList: any[] = [
    { key: '0', name: 'January' },
    { key: '1', name: 'February' },
    { key: '2', name: 'March' },
    { key: '3', name: 'April' },
    { key: '4', name: 'May' },
    { key: '5', name: 'June' },
    { key: '6', name: 'July' },
    { key: '7', name: 'August' },
    { key: '8', name: 'September' },
    { key: '9', name: 'October' },
    { key: '10', name: 'November' },
    { key: '11', name: 'December' }
  ];

  constructor(private commonService: CommonService, private router: Router) { }

  async ngOnInit() {
    await this.loadEcgReports();
  }

  async loadEcgReports() {

  }

  viewReport(report: any) {
    console.log('Viewing report:', report);

    this.router.navigate(['dashboard/emp-report', report.key], {
      state: { report: report }
    });
  }

  get filteredData() {
    return this.ecgReports.filter(report => {
      const createdAt = moment(report.createdAt);
      if (this.selectedMonths != null && createdAt.month() !== Number(this.selectedMonths)) {
        return false;
      }
      if (this.selectedDays != null && createdAt.day() !== Number(this.selectedDays)) {
        return false;
      }
      return true;
    });
  }


}
