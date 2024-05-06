export class CreateCustomSettingDto {
  name: string;
  slug: string;
  type: string;
  value: string;
  status: number;

  constructor() {
    this.name = '';
    this.slug = '';
    this.type = '';
    this.value = '';
    this.status = 0;
  }
}
