import { Component } from "@angular/core";
import { FormsModule, NgForm, } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-register-form',
  imports: [FormsModule, RouterLink],
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
    success= false;
    loading = false;
    public missouriCounties: string[] =["Mississippi", "Scott", "New Madrid", "Pemiscot", "Butler","Bollinger", "Dunklin", "Cape Girardeau","Perry","Saint Francois", "Stoddard","Saint Genevieve"];


    submit(form: NgForm) {
      this.submitted = true;
      this.success = false;

      if (form.invalid) return;
      const payload = {
        name: this.fullName,
        email: this.email,
        phone: this.phone,
        county: this.missouriCounties,
        trainingType: this.trainingType,
        heardFrom: this.heardFrom,
        heardOther: this.heardOther,
        comments: this.comments,
      };
      console.log('[Registration]', payload);
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.success = true;
        form.resetForm();
        this.submitted = false;
     }, 1000);
    }
  }
