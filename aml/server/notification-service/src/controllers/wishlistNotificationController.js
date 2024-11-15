const WishlistRecords = require('./dummyRecords'); // Adjust path to your dummy records
const sendEmail = require('../config/mail-service'); // Adjust path to your mail service

// Endpoint handler to trigger the wishlist availability notification
exports.sendWishlistNotificationEndpoint = async (req, res) => {
  try {
    // Loop through each wishlist record
    for (const record of WishlistRecords) {
      // Construct styled HTML email content for each record
      const emailContent = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4CAF50; text-align: center;">Media Item Now Available!</h2>
          <p>Dear User,</p>
          <p>We are excited to inform you that a media item on your wishlist is now available for borrowing.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Media Item ID:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.mediaID}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Added to Wishlist:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${record.createdAt}</td>
            </tr>
          </table>
          <p style="margin-top: 20px;">You can now access this media item. Thank you for using our service!</p>
          <p style="margin-top: 20px; font-size: 12px; color: #888;">Best Regards,<br>Your Library Team</p>
          <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 20px;">
            This is an automated message, please do not reply.
          </p>
        </div>
      `;

      console.log(`Sending email to user ${record.userID} for media ID ${record.mediaID}`);

      // Send the email notification
      await sendEmail(
        `farshad389@gmail.com`, 
        'Wishlist Media Item Now Available',
        emailContent
      );
      console.log(`Email sent to user ${record.userID} for media ID ${record.mediaID}`);
    }

    // Respond with a success message
    res.status(200).json({ message: 'Wishlist notifications sent to all users' });
  } catch (error) {
    console.error('Failed to send wishlist notification emails:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
};
