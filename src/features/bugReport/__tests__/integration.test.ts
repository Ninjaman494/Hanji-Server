import { WebClient } from '@slack/web-api';
import { ApolloServer, gql } from 'apollo-server';
import casual from 'casual';
import { values } from 'lodash';
import { BugReportType } from 'generated/graphql';
import resolvers from '../resolvers';
import { General, BugReport } from 'features';

jest.mock('@slack/web-api', () => {
  const postMessage = jest.fn().mockResolvedValue({ ok: true });
  return {
    WebClient: jest.fn().mockImplementation(() => ({
      chat: { postMessage },
    })),
  };
});
const mockPostMessage = new WebClient().chat.postMessage;

const query = gql`
  mutation SendBugReport(
    $feedback: String!
    $type: BugReportType!
    $email: String
    $image: Upload
    $deviceInfo: DeviceInfo!
  ) {
    sendBugReport(
      feedback: $feedback
      type: $type
      email: $email
      image: $image
      deviceInfo: $deviceInfo
    ) {
      success
      message
    }
  }
`;

const report = {
  feedback: casual.sentence,
  email: casual.email,
  type: BugReportType.Bug,
  deviceInfo: {
    version: casual.string,
    brand: casual.string,
    manufacturer: casual.string,
    model: casual.string,
    sdkVersion: casual.string,
  },
};

const server = new ApolloServer({
  typeDefs: [General, BugReport],
  resolvers,
});

describe('bugReport feature', () => {
  it('handles createBugReport mutations', async () => {
    const expected = (str: string) => ({
      channel: 'CCEG9MVCG',
      text: expect.stringContaining(str),
    });

    const { errors, data } = await server.executeOperation({
      query,
      variables: report,
    });
    const { success, message } = data.sendBugReport;

    expect(mockPostMessage).toHaveBeenCalledWith(expected(report.feedback));
    expect(mockPostMessage).toHaveBeenCalledWith(expected(report.email));
    values(report.deviceInfo).forEach((val) =>
      expect(mockPostMessage).toHaveBeenCalledWith(expected(val)),
    );

    expect(errors).toBeUndefined();
    expect(success).toBeTruthy();
    expect(message).toEqual('Report sent successfully');
  });

  it('handles errors', async () => {
    (mockPostMessage as jest.Mock).mockReturnValueOnce({
      ok: false,
      error: 'ruh roh',
    });

    const { errors, data } = await server.executeOperation({
      query,
      variables: report,
    });
    const { success, message } = data.sendBugReport;

    expect(mockPostMessage).toHaveBeenCalled();

    expect(errors).toBeUndefined();
    expect(success).toBeFalsy();
    expect(message).toEqual('ruh roh');
  });
});
