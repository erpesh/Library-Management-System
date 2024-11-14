const Borrowingrecords = require('./Borrowingrecords'); // Adjust path as necessary
const sendEmail = require('../config/mail-service'); 

// Function to fetch a borrowing record by user ID
const getBorrowingRecord = (userId) => {
  console.log(`Attempting to fetch record for userID: ${userId}`); // Log userId being fetched
  const record = Borrowingrecords.find(record => record.userID === userId);
  console.log('Fetched Borrowing Record:', record); // Log the fetched record
  return record;
};

// Function to send a return notification
const remindUserToReturnBook = async (userId) => {
  console.log(`Looking up borrowing record for userID: ${userId}`); // Log the user ID being processed
  const record = getBorrowingRecord(userId);

  if (record) {
    console.log('Record found:', record); // Log the fetched record
    const today = new Date();
    console.log('Today’s Date:', today);

    const returnDate = new Date(record.returnAt);
    console.log('Return Date:', returnDate);

    const daysLeft = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24));
    console.log('Days left until return:', daysLeft);

    if (daysLeft <= 7) {
      const emailContent = `
        Dear User,

        This is a reminder that you have 7 days left to return the borrowed media item (ID: ${record.mediaID}).
        Please return it by ${returnDate.toISOString().split('T')[0]} to avoid any late fees.

        Thank you!
      `;
      console.log('Email content:', emailContent);

      try {
        await sendEmail('farshad389@gmail.com', 'Return Reminder', emailContent); // Replace with actual user email
        console.log('Reminder email sent successfully');
      } catch (error) {
        console.error('Failed to send reminder email:', error);
      }
    } else {
      console.log('No reminder needed; return date is beyond 7 days');
    }
  } else {
    console.log('No borrowing record found for the specified user');
  }
};

// Endpoint handler to trigger the reminder function
exports.sendReturnNotification = async (req, res) => {
  try {
    console.log('Received request to send return notification');
    console.log('Request body:', req.body);

    await remindUserToReturnBook(req.body.userId);
    res.status(201).json({ message: 'Return notification sent successfully' });
  } catch (error) {
    console.error('Error in sendReturnNotification:', error);
    res.status(400).json({ error: error.message });
  }
};
