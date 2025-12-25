"use server";

import { render } from '@react-email/components';
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ReactElement } from 'react';

let transporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;

const getTransporter = (): Transporter<SMTPTransport.SentMessageInfo> => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST as string,
      port: parseInt(process.env.EMAIL_PORT as string),
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
      },
    } as SMTPTransport.Options);
  }
  return transporter;
};

export const sendEmail = async ({
  to,
  subject,
  component,
}: {
  to: string;
  subject: string;
  component: ReactElement;
}) => {
  const transport = getTransporter();

  const emailHtml = await render(component);

  return transport.sendMail({
    from: "info@autospaopus.com",
    to: to,
    subject: subject,
    html: emailHtml,
  });
};