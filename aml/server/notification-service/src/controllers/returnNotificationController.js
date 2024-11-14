const Borrowingrecords = require('../controllers/Borrowingrecords'); // Adjust path as necessary
const sendEmail = require('../config/mail-service'); // Adjust path as necessary

// Function to fetch a borrowing record by user ID
const getBorrowingRecord = (userId) => {
  return Borrowingrecords.find(record => record.userID === userId);
};

// Function to send a return notification
const remindUserToReturnBook = async (userId) => {
  const record = getBorrowingRecord(userId);

  if (record) {
    const today = new Date();
    const returnDate = new Date(record.returnAt);
    const daysLeft = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 7) {
      const emailContent = `
        Dear User,

        This is a reminder that you have 7 days left to return the borrowed media item (ID: ${record.mediaID}).
        Please return it by ${returnDate.toISOString().split('T')[0]} to avoid any late fees.

        Thank you!
      `;

      try {
        await sendEmail('farshad389@gmail.com', 'Return Reminder', emailContent); // Replace with actual user email
      } catch (error) {
        console.error('Failed to send reminder email:', error);
      }
    }
  }
};

// Endpoint handler to trigger the reminder function
exports.sendReturnNotification = async (req, res) => {
  try {
    await remindUserToReturnBook(req.body.userId);
    res.status(201).json({ message: 'Return notification sent successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
