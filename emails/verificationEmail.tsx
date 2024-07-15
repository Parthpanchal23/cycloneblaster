import * as React from "react";

interface EmailTemplateProps {
  username: string;
  otp: string;
}

export const VerificationEmailTemplate: React.FC<
  Readonly<EmailTemplateProps>
> = ({ username, otp }) => (
  <div>
    <h1>Welcome, {username}!</h1>
    <p> Your verification otp is:- {otp ? otp : ""}</p>
  </div>
);
