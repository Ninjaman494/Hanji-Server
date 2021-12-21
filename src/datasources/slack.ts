import { DataSource } from 'apollo-datasource';
import { BugReportResponse, DeviceInfo, ReportType } from './types';
import { FileUpload } from 'graphql-upload';
import { WebClient } from '@slack/web-api';

export default class SlackAPI extends DataSource {
  slackClient: WebClient;

  constructor() {
    super();

    this.slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
  }

  async sendBugReport(
    feedback: string,
    type: ReportType,
    deviceInfo: DeviceInfo,
    email?: string,
    image?: Promise<FileUpload>,
  ): Promise<BugReportResponse> {
    const typeMap = {
      [ReportType.BUG]: 'CCEG9MVCG',
      [ReportType.NEW_FEATURE]: 'CCEPA5CE4',
      [ReportType.OTHER]: 'CCFF24HMY',
    };

    const message =
      `*New Bug Report:* ${feedback} \n` +
      `------ Application ------ \n` +
      `- Email: ${email ?? 'not provided'} \n` +
      `- Version: ${deviceInfo.version} \n` +
      `------ Device ------ \n` +
      `- Brand: ${deviceInfo.brand} \n` +
      `- Manufacturer: ${deviceInfo.manufacturer} \n` +
      `- Model: ${deviceInfo.model} \n` +
      `- SDK Version: ${deviceInfo.sdkVersion} \n`;

    if (image) {
      const file = (await image).createReadStream();

      const { ok, error } = await this.slackClient.files.upload({
        channels: typeMap[type],
        initial_comment: message,
        file: file,
      });
      return {
        success: ok,
        message: ok
          ? 'Report and screenshot sent successfully'
          : error ?? 'An error occured',
      };
    }

    const { ok, error } = await this.slackClient.chat.postMessage({
      channel: typeMap[type],
      text: message,
    });

    return {
      success: ok,
      message: ok ? 'Report sent successfully' : error ?? 'An error occured',
    };
  }
}
