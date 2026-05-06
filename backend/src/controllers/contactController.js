const nodemailer = require('nodemailer')

// Send contact form email
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ msg: 'Please fill in all fields' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Please enter a valid email address' })
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    // Email to admin (you receive the message)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `E-Library Contact Form - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Message</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Contact Details</h2>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p style="margin: 5px 0;"><strong style="color: #667eea;">Name:</strong> ${name}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p style="margin: 5px 0;"><strong style="color: #667eea;">Email:</strong> ${email}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p style="margin: 5px 0;"><strong style="color: #667eea;">Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <p style="margin: 5px 0 10px 0;"><strong style="color: #667eea;">Message:</strong></p>
              <p style="margin: 0; line-height: 1.6; color: #555;">${message}</p>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; background: #e9ecef; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              This message was sent from E-Library Contact Form
            </p>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">
              Reply directly to: ${email}
            </p>
          </div>
        </div>
      `
    }

    // Email to user (acknowledgment)
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting E-Library',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Thank You for Contacting Us!</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">Hi ${name},</h2>
            
            <p style="color: #555; line-height: 1.8; font-size: 16px;">
              We have received your message and appreciate you reaching out to us. 
              Our team will review your inquiry and get back to you as soon as possible.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <p style="margin: 0 0 10px 0;"><strong style="color: #667eea;">Your Message Summary:</strong></p>
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 5px 0;"><strong>Message:</strong> ${message}</p>
            </div>
            
            <p style="color: #555; line-height: 1.8; font-size: 16px;">
              In the meantime, feel free to explore our vast collection of books and resources.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/home" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Browse Library
              </a>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; background: #e9ecef; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              Best regards,<br>
              <strong>E-Library Team</strong>
            </p>
          </div>
        </div>
      `
    }

    // Send both emails
    await transporter.sendMail(adminMailOptions)
    await transporter.sendMail(userMailOptions)

    res.status(200).json({ 
      msg: 'Message sent successfully! Check your email for confirmation.' 
    })

  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ 
      msg: 'Failed to send message. Please try again later.' 
    })
  }
}

module.exports = { sendContactMessage }
