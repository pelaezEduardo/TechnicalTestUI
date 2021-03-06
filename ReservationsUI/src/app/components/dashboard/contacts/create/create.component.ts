import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactsService } from "../../../../services/contacts/contacts.service";
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class ContactsCreateComponent implements OnInit {

  form: FormGroup;
  today: string;
  contactTypes: any = [];

  constructor(private fb: FormBuilder, private api: ContactsService, private router: Router) {
    this.form = this.fb.group({
      ContactName: ['', [Validators.required]],
      BirthDate: ['', [Validators.required]],
      ContactTypeId: ['', [Validators.required]],
      PhoneNumber: ['']
    });
  }

  ngOnInit(): void {
    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.getTypes();
  }

  // gets the id and description of contact types table
  getTypes() {
    this.api.getContactTypes().subscribe(res => {
      if (res.error) {
        alert('error');
      }
      else {
        for (let index = 0; index < res.length; index++) {
          this.contactTypes.push(res[index]);
        }
      }
    });
  }

  createContact() {
    if (this.form.status == "VALID") {
      // create json object to send to api
      let contact = {
        ContactName: this.form.controls.ContactName.value,
        BirthDate: this.form.controls.BirthDate.value,
        ContactTypeId: this.form.controls.ContactTypeId.value,
        PhoneNumber: this.form.controls.PhoneNumber.value
      }

      this.api.postContact(contact).subscribe(
        data => {  },
        err => { console.log(err) }
      );

      alert('Sucessfully created')
      this.router.navigateByUrl('contacts/list');
    } 
    else {
      alert('Incorrect or missing values!');
    }
  }
}
