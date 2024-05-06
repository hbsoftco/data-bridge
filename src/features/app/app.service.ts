import { Injectable } from '@nestjs/common';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { DatabaseService } from '@src/core/database/database.service';
import { convertBigIntToString } from '@src/core/utils/convertBigIntToString.util';
import { CreateCustomSettingDto } from './dto/create-custom-sestting.dto';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createAppDto: CreateAppDto) {
    // Define the properties that you want to create settings for
    const properties = [
      { name: 'appVersion', value: createAppDto.appVersion },
      { name: 'googlePlayLink', value: createAppDto.googlePlayLink },
      { name: 'email', value: createAppDto.email },
      { name: 'instagram', value: createAppDto.instagram },
      { name: 'youtube', value: createAppDto.youtube },
      { name: 'telegram', value: createAppDto.telegram },
      { name: 'updateText', value: createAppDto.updateText },
      { name: 'englishUpdateText', value: createAppDto.englishUpdateText },
      { name: 'forceUpdate', value: createAppDto.forceUpdate },
      { name: 'policyLink', value: createAppDto.policyLink },
      { name: 'aboutLink', value: createAppDto.aboutLink },
    ];

    // Iterate over the properties
    for (const property of properties) {
      // Create a new setting for each property
      const customSetting = {
        name: property.name,
        slug: property.name,
        type: 'setting',
        value: String(property.value),
        status: 1,
      };

      await this.createSetting(customSetting);
    }

    return 'Settings saved successfully!';
  }

  async findAppSetting() {
    const settings = await this.databaseService.custom_settings.findMany({
      where: {
        type: 'setting',
      },
      select: {
        name: true,
        value: true,
        type: true,
      },
    });

    // Create a new CreateAppDto object
    const createAppDto = new CreateAppDto();

    if (settings.length) {
      // Assign the values from the settings array to the corresponding properties of the CreateAppDto object
      for (const setting of settings) {
        if (setting.name) {
          createAppDto[setting.name] = setting.value;
        }
      }

      // Convert string 'true' or 'false' to boolean for forceUpdate property
      if (typeof createAppDto.forceUpdate === 'string') {
        createAppDto.forceUpdate = createAppDto.forceUpdate === 'true';
      }
    }

    return createAppDto;
  }

  async findByKey(key: string) {
    const setting = await this.databaseService.custom_settings.findFirst({
      where: {
        name: key,
        type: 'setting',
      },
    });

    // Convert BigInt values to string
    return convertBigIntToString(setting);
  }

  async update(updateAppDto: UpdateAppDto) {
    // Define the properties that you want to update
    const properties = [
      { name: 'appVersion', value: updateAppDto.appVersion },
      { name: 'googlePlayLink', value: updateAppDto.googlePlayLink },
      { name: 'email', value: updateAppDto.email },
      { name: 'instagram', value: updateAppDto.instagram },
      { name: 'youtube', value: updateAppDto.youtube },
      { name: 'telegram', value: updateAppDto.telegram },
      { name: 'updateText', value: updateAppDto.updateText },
      { name: 'englishUpdateText', value: updateAppDto.englishUpdateText },
      { name: 'forceUpdate', value: String(updateAppDto.forceUpdate) },
      { name: 'policyLink', value: updateAppDto.policyLink },
      { name: 'aboutLink', value: updateAppDto.aboutLink },
    ];

    // Iterate over the properties
    for (const property of properties) {
      // Get the setting that you want to update
      const settingToUpdate =
        await this.databaseService.custom_settings.findFirst({
          where: {
            name: property.name,
            type: 'setting',
          },
        });

      // Check if the setting exists
      if (settingToUpdate) {
        // Update the setting
        await this.databaseService.custom_settings.update({
          where: {
            id: settingToUpdate.id,
          },
          data: {
            value: property.value,
          },
        });
      }
    }

    return 'Settings have been updated';
  }

  async createSetting(createCustomSettingDto: CreateCustomSettingDto) {
    const setting = await this.databaseService.custom_settings.create({
      data: createCustomSettingDto,
    });
    return setting;
  }

  async subscriptions(page: number, pageSize: number) {
    const whereClause: any = {};

    const subscriptions = await this.databaseService.subscriptions.findMany({
      where: whereClause,
      skip: (page - 1) * Number(pageSize),
      take: Number(pageSize),
      include: {
        users: {
          select: {
            first_name: true,
            profile_picture: true,
            id: true,
            gender: true,
          },
        },
      },
    });

    // Convert BigInt values to string for each user
    return subscriptions.map(convertBigIntToString);
  }

  async subscriptionsCount() {
    try {
      return await this.databaseService.subscriptions.count({});
    } catch (error) {}
  }
}
