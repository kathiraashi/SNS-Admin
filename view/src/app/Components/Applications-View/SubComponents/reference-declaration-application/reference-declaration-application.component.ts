import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reference-declaration-application',
  templateUrl: './reference-declaration-application.component.html',
  styleUrls: ['./reference-declaration-application.component.css']
})
export class ReferenceDeclarationApplicationComponent implements OnInit {

  @Input() CandidateData: Object;

  constructor() { }

  ngOnInit() {
  }

}
