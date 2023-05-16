import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cLog from './cLog.js';
import boom from '@hapi/boom';

dotenv.config();

async function sendEmail(infoEmail) {
	try {
		// Generate email
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_APP_PASS,
			},
		});

		// send mail with defined transport object
		let info = await transporter.sendMail(infoEmail);

		cLog.magenta(`[nodemailer] Message sent: \n\tid: ${info.messageId}\n\tto: ${infoEmail.to}`);

		return { message: 'mail sent' };
	} catch (err) {
		throw boom.boomify(err, {
			message: 'Conflict on send email',
			statusCode: 409,
		});
	}
}

export { sendEmail };
