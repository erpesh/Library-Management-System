const WishlistRecords = require('./dummyRecords'); // Adjust path to your dummy records
const sendEmail = require('../config/mail-service'); // Adjust path to your mail service

// Endpoint handler to trigger the wishlist availability notification
exports.sendWishlistNotificationEndpoint = async (req, res) => {
  const { userId, mediaID } = req.body;

  try {
    // Find the user's wishlist record for the specific media item
    const record = WishlistRecords.find(record => record.userID === userId && record.mediaID === mediaID);

    if (record) {
      const emailContent = `
        Dear User,

        We are excited to inform you that a media item on your wishlist is now available for borrowing.

        Media Item ID: ${mediaID}
        Added to Wishlist: ${new Date(record.createdAt).toISOString().split('T')[0]}

        You can now access this media item. Thank you for using our service!

        Best Regards,
        Your Library Team
      `;

      // Send the email notification
      await sendEmail('farshad389@gmail.com', 'Wishlist Media Item Now Available', emailContent); // reflecace with dynamic email
      console.log('Availability notification email sent successfully');
      
      // Respond with a success message
      res.status(201).json({ message: 'Wishlist availability notification sent successfully' });
    } else {
      // If no matching wishlist record is found, respond with an error message
      res.status(404).json({ message: 'No matching wishlist record found for the specified user and media item' });
    }
  } catch (error) {
    console.error('Failed to send wishlist notification email:', error);
    res.status(500).json({ error: 'Failed to send availability notification email' });
  }
};
