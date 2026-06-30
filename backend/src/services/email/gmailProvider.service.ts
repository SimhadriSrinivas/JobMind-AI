import { EmailProviderMessage, EmailSyncInput } from "../../types/email.types";

export interface EmailProvider {
  fetchMessages(userId: string, input: EmailSyncInput): Promise<EmailProviderMessage[]>;
}

class MockGmailProvider implements EmailProvider {
  async fetchMessages(
    userId: string,
    input: EmailSyncInput
  ): Promise<EmailProviderMessage[]> {
    const now = new Date();
    const messages: EmailProviderMessage[] = [
      {
        messageId: `mock-gmail-${userId}-interview`,
        threadId: `mock-thread-${userId}-interview`,
        from: "recruiter@acme.example",
        to: ["candidate@example.com"],
        subject: "Interview invitation for Software Engineer",
        body:
          "Hi, your technical round interview with Acme for Software Engineer is scheduled on 2026-07-05 at 10:30 AM. Join using Google Meet: https://meet.google.com/abc-defg-hij.",
        receivedAt: now,
        attachments: [],
        applicationId: input.applicationId,
        campaignId: input.campaignId,
      },
      {
        messageId: `mock-gmail-${userId}-offer`,
        threadId: `mock-thread-${userId}-offer`,
        from: "hr@northstar.example",
        to: ["candidate@example.com"],
        subject: "Offer letter for Backend Engineer",
        body:
          "Congratulations. We are pleased to offer you the Backend Engineer role at Northstar with salary INR 1800000. Your joining date is 2026-08-01.",
        receivedAt: new Date(now.getTime() - 60 * 60 * 1000),
        attachments: [
          {
            filename: "offer-letter.pdf",
            mimeType: "application/pdf",
            size: 245000,
          },
        ],
        applicationId: input.applicationId,
        campaignId: input.campaignId,
      },
      {
        messageId: `mock-gmail-${userId}-rejection`,
        threadId: `mock-thread-${userId}-rejection`,
        from: "careers@zenith.example",
        to: ["candidate@example.com"],
        subject: "Update on your application",
        body:
          "Thank you for your interest. After careful consideration, we will not be moving forward with your application at this time.",
        receivedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        attachments: [],
        applicationId: input.applicationId,
        campaignId: input.campaignId,
      },
    ];

    return messages.slice(0, input.limit || messages.length);
  }
}

export const gmailProvider: EmailProvider = new MockGmailProvider();
