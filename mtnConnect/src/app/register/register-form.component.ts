import { Component } from "@angular/core";
import { FormsModule, NgForm, } from '@angular/forms';


@Component({
  selector: 'app-register-form',
  imports: [FormsModule,],
  standalone: true,
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
})

export class RegistrationFormComponent {
    fullName = "";
    email = "";
    phone = "";
    dob = "";
    education = "";
    trainingType = "";
    heardFrom = "";
    heardOther = "";
    comments = "";
    submitted = false;
    form: any;
    public missouriCounties: string[] =["Mississippi", "Scott", "New Madrid", "Pemiscot", "Butler","Bollinger", "Dunklin", "Cape Girardeau","Perry","Saint Francois", "Stoddard","Saint Genevieve"];

    submit(form: NgForm) {
      this.submitted = true;
      if (form.invalid) return;
      console.log("[Contact Form]", {
        name: this.fullName,
        email: this.email,
        phone: this.phone,
        county: this.missouriCounties,
        trainingType: this.trainingType,
        heardFrom: this.heardFrom,
        heardOther: this.heardOther,
        comments: this.comments,
      });
      form.resetForm();
      this.submitted = false;
    }
  }
