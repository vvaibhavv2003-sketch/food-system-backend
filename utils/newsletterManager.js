const transporter = require('./mailer');
const Newsletter = require('../models/Newsletter');

const sendNewsletterEmail = async (subject, htmlContent) => {
    try {
        const subscribers = await Newsletter.find({ status: 'subscribed' });
        const subscriberEmails = subscribers.map(s => s.email);

        if (subscriberEmails.length === 0) {
            console.log('No subscribers found. Skipping email notification.');
            return;
        }

        console.log(`Preparing to send email to ${subscriberEmails.length} subscribers...`);

        // Update HTML content to include unsubscribe link for each subscriber? 
        // Actually, for bulk sending with BCC, a generic link like http://site.com/unsubscribe is easier, 
        // but the user might need to enter their email again or we need a way to identify them.
        // A simple way is to link to an unsubscribe page on the frontend.
        const footer = `
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #888; font-size: 12px;">
                <p>Gourmet Paradise, 123 Food Street, Tasty City</p>
                <p>If you wish to stop receiving these emails, you can 
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe" style="color: #ff4757; text-decoration: underline;">unsubscribe here</a>.
                </p>
            </div>
        `;

        const fullHtmlContent = htmlContent + footer;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send a copy to self
            bcc: subscriberEmails,
            subject: subject,
            html: fullHtmlContent
        };

        // Use promise for async/await support if needed, but for now just send it
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error in sendNewsletterEmail:', error);
            } else {
                console.log('Newsletter emails dispatched successfully:', info.messageId);
            }
        });
    } catch (error) {
        console.error('Failed to process newsletter emails:', error);
    }
};

module.exports = { sendNewsletterEmail };
