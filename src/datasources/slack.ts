import { DataSource } from 'apollo-datasource';
import { BugReportResponse, ReportType } from './types';
import { FileUpload } from 'graphql-upload';

export default class SlackAPI extends DataSource {
  constructor() {
    super();
  }

  sendBugReport(
    feedback: string,
    type: ReportType,
    email?: string,
    image?: FileUpload,
  ): BugReportResponse {
    console.log('feedback:', feedback);
    console.log('email:', email);
    console.log('type:', type);
    console.log('file:', image);

    return {
      success: true,
      message: 'Not yet implemented',
    };
  }
}
