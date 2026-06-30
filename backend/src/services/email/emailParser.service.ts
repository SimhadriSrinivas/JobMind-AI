import { EmailEventInput, EmailProviderMessage } from "../../types/email.types";

export const parseEmailMessage = (message: EmailProviderMessage): EmailEventInput => {
  return {
    ...message,
    from: message.from.trim().toLowerCase(),
    to: message.to.map((recipient) => recipient.trim().toLowerCase()),
    subject: message.subject.trim(),
    body: message.body.trim(),
    receivedAt: new Date(message.receivedAt),
    attachments: message.attachments || [],
  };
};

export const getSearchableEmailText = (email: {
  subject: string;
  body: string;
}): string => {
  return `${email.subject} ${email.body}`.toLowerCase();
};
