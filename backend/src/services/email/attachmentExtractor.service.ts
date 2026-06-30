import { EmailAttachment, EmailEventInput } from "../../types/email.types";

export const extractAttachments = (email: EmailEventInput): EmailAttachment[] => {
  return (email.attachments || []).map((attachment) => ({
    filename: attachment.filename.trim(),
    mimeType: attachment.mimeType,
    size: attachment.size,
    url: attachment.url,
  }));
};
