const sendEmail = require('../config/mail-service'); 

exports.sendWishlistNotificationEndpoint = async (req, res) => {
  const { wishlistRecords, media } = req.body; // Expecting WishlistData from the payload
  try {
    for (const record of wishlistRecords) {
      const mediaDetails = media.find(item => item._id === record.mediaId);

      if (!mediaDetails) {
        console.error(`Media with ID ${record.mediaId} not found for record ${record._id}`);
        continue; // Skip sending email for this record
      }

      const emailContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Wishlist Notification</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    line-height: 1.6;
                    color: #020817;
                    background-color: #ffffff;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    max-width: 42rem;
                    margin: 0 auto;
                    padding: 10px;
                }
                .card {
                    background-color: #ffffff;
                    border-radius: 0.5rem;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                    overflow: hidden;
                    padding: 20px;
                    margin-bottom: 20px;
                }
                .card-header {
                    background-color: #000000;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                    border-radius: 0.5rem 0.5rem 0 0;
                }
                .card-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin: 0;
                }
                .card-content {
                    padding: 20px;
                    line-height: 1.8;
                }
                .media-card {
                    border: 1px solid #e2e8f0;
                    border-radius: 0.375rem;
                    padding: 1rem;
                    margin-top: 1rem;
                    margin-bottom: 1.5rem;
                    text-align: center;
                }
                .media-details {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .media-info {
                    flex: 1;
                }
                .media-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 0;
                    margin-bottom: 0.5rem;
                }
                .media-image {
                    max-width: 100%;
                    border-radius: 0.375rem;
                    margin-top: 10px;
                }
                .button {
                    display: inline-block;
                    background-color: #000000;
                    color: #ffffff !important;
                    font-weight: 500;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    text-decoration: none;
                    text-align: center;
                    margin-top: 1rem;
                }
                .card-footer {
                    background-color: #f1f5f9;
                    color: #64748b;
                    text-align: center;
                    font-size: 0.875rem;
                    padding: 1rem;
                    margin-top: 20px;
                    border-radius: 0 0 0.5rem 0.5rem;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <div class="card-header">
                        <h1 class="card-title">Media Item Now Available!</h1>
                    </div>
                    <div class="card-content">
                        <p>Dear Library Member,</p>
                        <p>We are excited to inform you that the media item you added to your wishlist is now available:</p>
                        <div class="media-card">
                            <div class="media-details">
                                <div class="media-info">
                                    <h2 class="media-title">${mediaDetails.title}</h2>
                                    <p><strong>Media Type:</strong> ${mediaDetails.mediaType}</p>
                                    <p><strong>Genre:</strong> ${mediaDetails.genre}</p>
                                    <img src="${mediaDetails.imageUrl}" alt="${mediaDetails.title}" class="media-image" />
                                    <a href="${process.env.CLIENT_URL}/media/${record.mediaId}" class="button">View Media Details</a>
                                </div>
                            </div>
                        </div>
                        <p>Thank you for using our library services!</p>
                        <p>Best regards,<br>Cantor Library Team</p>
                    </div>
                    <div class="card-footer">
                        <p>If you have any questions, please contact us at cantorlibrarynotification@gmail.com or call (+44) 0114 273 4727.</p>
                        <p>&copy; 2024 Cantor Library. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `;

      // Send the email notification
      await sendEmail(
        record.email,
        'Wishlist Media Item Now Available',
        emailContent
      );
    }

    // Respond with a success message
    res.status(200).json({ message: 'Emails sent for all wishlist records.' });
  } catch (error) {
    console.error('Error sending wishlist emails:', error);
    res.status(500).json({ error: 'Failed to send emails.' });
  }
};
