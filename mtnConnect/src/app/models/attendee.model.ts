export interface attendee {
  _id?: string;
  name: string;
  email: string;
  dob: string;
  education: string;
  county: string;
  phone?: string;
  trainingType: string;
  heardFrom: string;
  heardOther: string;
  comments: string;
  eventId?: string;
  createdAt?: Date;
}
