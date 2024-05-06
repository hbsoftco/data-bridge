export class CreateAppDto {
  [key: string]: string | number | boolean | null;

  appVersion: string;
  googlePlayLink: string;
  email: string;
  telegram: string;
  instagram: string;
  youtube: string;
  updateText: string;
  englishUpdateText: string;
  forceUpdate: boolean;
  policyLink: string;
  aboutLink: string;

  constructor() {
    this.appVersion = '';
    this.googlePlayLink = '';
    this.email = '';
    this.telegram = '';
    this.instagram = '';
    this.youtube = '';
    this.updateText = '';
    this.englishUpdateText = '';
    this.forceUpdate = false;
    this.policyLink = '';
    this.aboutLink = '';
  }
}
