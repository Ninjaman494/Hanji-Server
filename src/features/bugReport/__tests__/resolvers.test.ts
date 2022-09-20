import { WebClient } from '@slack/web-api';
import casual from 'casual';
import { BugReportType } from 'generated/graphql';
import { values } from 'lodash';
import resolvers from '../resolvers';

jest.mock('@slack/web-api', () => {
  const upload = jest.fn().mockResolvedValue({ ok: true });
  const postMessage = jest.fn().mockResolvedValue({ ok: true });
  return {
    WebClient: jest.fn().mockImplementation(() => ({
      files: { upload },
      chat: { postMessage },
    })),
  };
});

const mockUpload = new WebClient().files.upload;
const mockPostMessage = new WebClient().chat.postMessage;
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
const image = Promise.resolve({
  createReadStream: jest.fn().mockReturnValue('file'),
});

describe('bugReport resolver', () => {
  it('submits bug reports', async () => {
    const expected = (str: string) => ({
      channel: 'CCEG9MVCG',
      text: expect.stringContaining(str),
    });

    const { success, message } = await (
      resolvers.Mutation.sendBugReport as any
    )(null, report);

    expect(mockPostMessage).toHaveBeenCalledWith(expected(report.feedback));
    expect(mockPostMessage).toHaveBeenCalledWith(expected(report.email));
    values(report.deviceInfo).forEach((val) =>
      expect(mockPostMessage).toHaveBeenCalledWith(expected(val)),
    );
    expect(success).toBeTruthy();
    expect(message).toEqual('Report sent successfully');
  });

  it('submits bug reports with images', async () => {
    const expected = (str: string) => ({
      channels: 'CCEG9MVCG',
      initial_comment: expect.stringContaining(str),
      file: 'file',
    });

    const { success, message } = await (
      resolvers.Mutation.sendBugReport as any
    )(null, { ...report, image });

    expect(mockPostMessage).not.toHaveBeenCalled();
    expect(mockUpload).toHaveBeenCalledWith(expected(report.feedback));
    expect(mockUpload).toHaveBeenCalledWith(expected(report.email));
    values(report.deviceInfo).forEach((val) =>
      expect(mockUpload).toHaveBeenCalledWith(expected(val)),
    );
    expect(success).toBeTruthy();
    expect(message).toEqual('Report and screenshot sent successfully');
  });

  it('handles errors', async () => {
    (mockPostMessage as jest.Mock).mockReturnValueOnce({
      ok: false,
      error: 'ruh roh',
    });

    const { success, message } = await (
      resolvers.Mutation.sendBugReport as any
    )(null, report);

    expect(mockPostMessage).toHaveBeenCalled();
    expect(success).toBeFalsy();
    expect(message).toEqual('ruh roh');
  });
});
