"use server";

import { render } from "@react-email/components";
import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { ReactElement } from "react";

/** Singleton transporter instance for connection reuse */
let transporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;

export type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

/**
 * Gets or creates the SMTP transporter instance.
 *
 * @returns Configured Nodemailer transporter
 */
const getTransporter = (): Transporter<SMTPTransport.SentMessageInfo> => {
  try {
    if (!transporter) {
      if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Missing email configuration environment variables");
      }

      const port = parseInt((process.env.EMAIL_PORT as string) || "587");
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST as string,
        port,
        secure: port === 465,
        auth: {
          user: process.env.EMAIL_USER as string,
          pass: process.env.EMAIL_PASS as string,
        },
        tls: {
          rejectUnauthorized: false,
        },
      } as SMTPTransport.Options);
    }
    return transporter;
  } catch (error) {
    console.error("Failed to initialize email transporter:", error);
    throw error;
  }
};

/**
 * Sends an email using a React Email component as the template.
 *
 * @param to - Recipient email address
 * @param subject - Email subject line
 * @param component - React Email component to render as HTML
 * @param attachments - Optional array of file attachments
 * @returns Promise resolving to the sent message info
 */
export const sendEmail = async ({
  to,
  subject,
  component,
  attachments,
}: {
  to: string;
  subject: string;
  component: ReactElement;
  attachments?: EmailAttachment[];
}) => {
  try {
    const transport = getTransporter();

    const emailHtml = await render(component);

    return await transport.sendMail({
      from: `Autospa Opus <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: emailHtml,
      attachments: attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType || "application/octet-stream",
      })),
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to send email");
  }
};
