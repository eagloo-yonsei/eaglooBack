const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const { SMTP_PASSWORD } = process.env;

const smtpConfig = {
  host: "mail.codingbear.kr",
  port: 465,
  secure: true,
  auth: {
    user: "hello@eagloo.kr",
    pass: SMTP_PASSWORD,
  },
};

function html(secret: string) {
  return `
    <span>
        새로운 계정 생성을 위해 <b>${secret}</b>을 정확히 입력해 주세요
    </span>;
`;
}

function htmlReset(secret: string) {
  return `
    <span>
        비밀번호 초기화를 위해 <b>${secret}</b>을 정확히 입력해 주세요
    </span>;
    `;
}

export async function sendMail(to: string, secret: string) {
  const transport = nodemailer.createTransport(smtpConfig);
  const mailOptions = {
    from: "이글루 Eagloo <hello@eagloo.kr>",
    to: `${to}@yonsei.ac.kr`,
    subject: "이글루 회원가입 인증 메일입니다",
    html: html(secret),
  };

  try {
    await transport.sendMail(mailOptions);
    console.info(`${to}@yonsei.ac.kr 메일 전송 완료`);
    transport.close();
    return true;
  } catch (error) {
    console.error(`${to}@yonsei.ac.kr 메일 전송에 실패하였습니다`);
    console.error(error);
    return false;
  }
}

export async function sendResetMail(to: string, secret: string) {
  const transport = nodemailer.createTransport(smtpConfig);
  const mailOptions = {
    from: "이글루 Eagloo <hello@eagloo.kr>",
    to: `${to}@yonsei.ac.kr`,
    subject: "이글루 비밀번호 재설정 메일입니다",
    html: htmlReset(secret),
  };

  try {
    await transport.sendMail(mailOptions);
    console.info(`${to}@yonsei.ac.kr 메일 전송 완료`);
    transport.close();
    return true;
  } catch (error) {
    console.error(`${to}@yonsei.ac.kr 메일 전송에 실패하였습니다`);
    console.error(error);
    return false;
  }
}
