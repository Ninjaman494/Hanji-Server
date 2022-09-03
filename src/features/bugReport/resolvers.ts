import { BugReportType, Resolvers } from 'generated/graphql';
import { GraphQLUpload } from 'graphql-upload';
import { WebAPICallResult, WebClient } from '@slack/web-api';

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

const typeMap = {
  [BugReportType.Bug]: 'CCEG9MVCG',
  [BugReportType.NewFeature]: 'CCEPA5CE4',
  [BugReportType.Other]: 'CCFF24HMY',
};

const resolvers: Resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    sendBugReport: async (_, { feedback, email, type, deviceInfo, image }) => {
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

      let response: WebAPICallResult, text: string;
      if (image) {
        const file = (await image).createReadStream();

        response = await slackClient.files.upload({
          channels: typeMap[type],
          initial_comment: message,
          file,
        });
        text = 'Report and screenshot sent successfully';
      } else {
        response = await slackClient.chat.postMessage({
          channel: typeMap[type],
          text: message,
        });
        text = 'Report sent successfully';
      }

      return {
        success: response.ok,
        message: response.ok ? text : response.error ?? 'An error occured',
      };
    },
  },
};

export default resolvers;
