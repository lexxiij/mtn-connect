// models/interest.model.ts
// Shape of one interest-list sign-up. Matches backend/models/Interest.js.

export interface Interest {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  county: string;
  dob?: string;
  education?: string;
  trainingType: string;
  comments?: string;
  source?: string;
  createdAt?: Date;
}
