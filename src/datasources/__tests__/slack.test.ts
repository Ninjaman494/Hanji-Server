jest.mock('@slack/web-api');

import { WebClient } from '@slack/web-api';
import casual from 'casual';
import SlackAPI from '../slack';
import { ReportType } from '../types';

const upload = jest.fn().mockResolvedValue({ ok: true });
const postMessage = jest.fn().mockResolvedValue({ ok: true });
(WebClient as unknown as jest.Mock).mockImplementation(() => ({
  files: { upload },
  chat: { postMessage },
}));

const datasource = new SlackAPI();

const feedback = casual.string;
const type = ReportType.BUG;
const email = casual.email;
const deviceInfo = {
  version: casual.string,
  brand: casual.string,
  manufacturer: casual.string,
  model: casual.string,
  sdkVersion: casual.string,
};
const image = Promise.resolve({
  createReadStream: jest.fn().mockReturnValue('file'),
});

describe('SlackAPI datasource', () => {
  it('can send a bug report', async () => {
    const { success, message } = await datasource.sendBugReport(
      feedback,
      type,
      deviceInfo,
      email,
    );

    expect(success).toBeTruthy();
    expect(message).toEqual('Report sent successfully');

    // Validate Slack message
    expect(upload).not.toHaveBeenCalled();
    expect(postMessage).toHaveBeenCalledWith({
      channel: 'CCEG9MVCG',
      text: expect.stringContaining(feedback),
    });
    expect(postMessage).toHaveBeenCalledWith({
      channel: 'CCEG9MVCG',
      text: expect.stringContaining(email),
    });
  });

  it('can send a bug report with an image', async () => {
    const { success, message } = await datasource.sendBugReport(
      feedback,
      type,
      deviceInfo,
      email,
      image as any,
    );

    expect(success).toBeTruthy();
    expect(message).toEqual('Report and screenshot sent successfully');

    // Validate Slack message
    expect(postMessage).not.toHaveBeenCalled();
    expect(upload).toHaveBeenCalledWith({
      channels: 'CCEG9MVCG',
      initial_comment: expect.stringContaining(feedback),
      file: 'file',
    });
    expect(upload).toHaveBeenCalledWith({
      channels: 'CCEG9MVCG',
      initial_comment: expect.stringContaining(email),
      file: 'file',
    });
  });

  it('can handle an error', async () => {
    postMessage.mockResolvedValueOnce({ ok: false, error: 'foobar' });

    const { success, message } = await datasource.sendBugReport(
      feedback,
      type,
      deviceInfo,
      email,
    );

    expect(success).toBeFalsy();
    expect(message).toEqual('foobar');
  });

  it('can handle an error with screenshot', async () => {
    upload.mockResolvedValueOnce({ ok: false });

    const { success, message } = await datasource.sendBugReport(
      feedback,
      type,
      deviceInfo,
      email,
      image as any,
    );

    expect(success).toBeFalsy();
    expect(message).toEqual('An error occured');
  });
});
