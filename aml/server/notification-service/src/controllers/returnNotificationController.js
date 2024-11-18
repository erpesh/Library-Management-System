const Borrowingrecords = require('../controllers/Borrowingrecords');
const sendEmail = require('../config/mail-service');

const getBorrowingRecord = (userId) => {
  return Borrowingrecords.find(record => record.userID === userId);
};

const remindUserToReturnBook = async (userId) => {
  const record = getBorrowingRecord(userId);

  if (record) {
    const today = new Date();
    const returnDate = new Date(record.returnAt);
    const daysLeft = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 7) {
      const emailContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Media Return Reminder</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    line-height: 1.6;
                    color: #020817;
                    background-color: #ffffff;
                    margin: 0;
                    padding: 20px;
                }
                li {
                     list-style-type: none; 
                    }

                li a {
                    color: white;
                    text-decoration: none; /* Remove underline from links */
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
                }
                .media-details {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .media-image {
                    width: 150px;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 0.375rem;
                    margin-right: 1rem;
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
                .due-date {
                    color: #dc2626;
                    font-weight: bold;
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
                @media (min-width: 768px) {
                    .media-details {
                        flex-direction: row;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <div class="card-header">
                        <h1 class="card-title">Media Return Reminder</h1>
                    </div>
                    <div class="card-content">
                        <p>Dear Valued Library Member,</p>
                        <p>This is a friendly reminder that the following item is due for return soon:</p>
                        
                        <div class="media-card">
                            <div class="media-details">
                                <img src="https://placeholder.com/150x200" alt="Media Cover" class="media-image">
                                <div class="media-info">
                                    <h2 class="media-title">Media ID: ${record.mediaID}</h2>
                                    <p><strong>Type:</strong> Media</p>
                                    <p><strong>Due Date:</strong> <span class="due-date">${returnDate.toISOString().split('T')[0]}</span></p>
                                    <a href="${process.env.CLIENT_URL}/media/${record.mediaID}" class="button">Return Media Now</a>
                                </div>
                            </div>
                        </div>
                        
                        <p>Please ensure that you return this item by the due date to avoid any late fees. If you need an extension, please contact our library staff.</p>
                        
                        <p>Thank you for using our library services!</p>
                        
                        <p>Best regards,<br>City Public Library Team</p>
                    </div>
                    <div class="card-footer">
                        <p>If you have any questions, please contact us at library@example.com or call (123) 456-7890.</p>
                        <p>&copy; 2023 City Public Library. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `;

      try {
        await sendEmail('farshad389@gmail.com', 'Media Return Reminder', emailContent);
      } catch (error) {
        console.error('Failed to send reminder email:', error);
      }
  }
}};

exports.sendReturnNotification = async (req, res) => {
  try {
    await remindUserToReturnBook(req.body.userId);
    res.status(201).json({ message: 'Return notification sent successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
