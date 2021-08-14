const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const dotenv = require("dotenv");
dotenv.config();

// TODO (SIGNIFICANT) 메일 전송 Google OAuth2 Refresh 시킬 방법 고안.
// 추측컨대 deploy가 새로 되는 경우 오류가 발생하는 것 같음.

const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REFRESH_TOKEN } =
    process.env;

const OAuth2Client = new OAuth2(
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

OAuth2Client.setCredentials({
    refresh_token: OAUTH_REFRESH_TOKEN,
});

function html(secret: string) {
    return `
    <span>
        새로운 계정 생성을 위해 <b>${secret}</b>을 정확히 입력해 주세요
    </span>;
`;
}

export async function sendMail(to: string, secret: string) {
    const accessToken = OAuth2Client.getAccessToken();

    const googleTransport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: true,
            auth: {
                type: "OAuth2",
                user: "eagloo.yonsei@gmail.com",
                clientId: OAUTH_CLIENT_ID,
                clientSecret: OAUTH_CLIENT_SECRET,
                refreshToken: OAUTH_REFRESH_TOKEN,
                accessToken,
                expires: 3600,
            },
        }),
        mailOptions = {
            from: "이글루 Eagloo <eagloo.yonsei@gmail.com>",
            to: `${to}@yonsei.ac.kr`,
            subject: "이글루 회원가입 인증 메일입니다",
            html: html(secret),
        };

    try {
        await googleTransport.sendMail(mailOptions);
        console.info(`${to}@yonsei.ac.kr 메일 전송`);
        googleTransport.close();
        return true;
    } catch (error) {
        console.error(`${to}@yonsei.ac.kr 메일 전송에 실패하였습니다`);
        console.error(error);
        return false;
    }
}
