import { Request, Response } from 'express';
import Contact, { IContact } from '../models/Contact.model.js';
import emailService from '../services/email.service.js';

// Utility function to get client IP
const getClientIP = (req: Request): string => {
  return (req.headers['x-forwarded-for'] as string) || 
         (req.headers['x-real-ip'] as string) || 
         req.socket.remoteAddress || 
         'unknown';
};

// Utility function to get user agent
const getUserAgent = (req: Request): string => {
  return req.headers['user-agent'] || 'unknown';
};

// Spam protection - Check if similar message was sent recently
const checkForSpam = async (email: string, ipAddress: string): Promise<boolean> => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    // Check for multiple submissions from same email or IP in last 5 minutes
    const recentSubmissions = await Contact.countDocuments({
      $or: [
        { email, createdAt: { $gte: fiveMinutesAgo } },
        { ipAddress, createdAt: { $gte: fiveMinutesAgo } }
      ]
    });

    console.log(`🛡️ Spam check: ${recentSubmissions} submissions in last 5 minutes from ${email} / ${ipAddress}`);
    return recentSubmissions >= 2; // ✅ 2 submissions in 5 minutes = spam
  } catch (error) {
    console.error('Spam check error:', error);
    return false;
  }
};

export const contactController = {
  // Create new contact submission with email notifications
  createContact: async (req: Request, res: Response) => {
    try {
      const { name, email, subject, message } = req.body;

      // Basic validation
      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required: name, email, subject, message'
        });
      }

      // Email validation regex
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Trim inputs
      const trimmedName = name.trim();
      const trimmedEmail = email.toLowerCase().trim();
      const trimmedSubject = subject.trim();
      const trimmedMessage = message.trim();

      // Get client info
      const ipAddress = getClientIP(req);
      const userAgent = getUserAgent(req);

      // Spam protection
      const isSpam = await checkForSpam(trimmedEmail, ipAddress);
      if (isSpam) {
        return res.status(429).json({
          success: false,
          message: 'Too many submissions. Please try again later.'
        });
      }

      // Create new contact
      const newContact: IContact = new Contact({
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
        ipAddress,
        userAgent,
        status: isSpam ? 'spam' : 'pending'
      });

      // Save to database
      await newContact.save();

      // Send email notifications (in background, don't await)
      try {
        // Send notification to admin
        emailService.sendContactNotification({
          name: trimmedName,
          email: trimmedEmail,
          subject: trimmedSubject,
          message: trimmedMessage,
          ipAddress
        }).catch(error => {
          console.error('Failed to send admin notification:', error);
        });

        // Send auto-reply to user
        emailService.sendAutoReply(trimmedEmail, trimmedName)
          .catch(error => {
            console.error('Failed to send auto-reply:', error);
          });

      } catch (emailError) {
        console.error('Email service error:', emailError);
        // Don't fail the request if email fails
      }

      res.status(201).json({
        success: true,
        message: 'Thank you for your message! I will get back to you soon.',
        data: {
          id: newContact._id,
          name: newContact.name,
          email: newContact.email,
          subject: newContact.subject
        }
      });

    } catch (error: any) {
      console.error('Contact creation error:', error);
      
      // MongoDB duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Duplicate submission detected'
        });
      }

      // MongoDB validation error
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error. Please try again later.'
      });
    }
  },

  // Get all contacts (for admin - will add auth later)
  getAllContacts: async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      
      const filter: any = {};
      if (status && ['pending', 'replied', 'spam'].includes(status as string)) {
        filter.status = status;
      }

      const contacts = await Contact.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit))
        .select('-__v');

      const total = await Contact.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: contacts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      console.error('Get contacts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch contacts'
      });
    }
  },

  // Get contact by ID
  getContactById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const contact = await Contact.findById(id);
      
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      res.status(200).json({
        success: true,
        data: contact
      });

    } catch (error) {
      console.error('Get contact error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch contact'
      });
    }
  },

  // Mark contact as read
  markAsRead: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const contact = await Contact.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Contact marked as read',
        data: contact
      });

    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update contact'
      });
    }
  },

  // Mark contact as replied
  markAsReplied: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const contact = await Contact.findByIdAndUpdate(
        id,
        { 
          status: 'replied',
          repliedAt: new Date()
        },
        { new: true }
      );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Contact marked as replied',
        data: contact
      });

    } catch (error) {
      console.error('Mark as replied error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update contact'
      });
    }
  }
};

export default contactController;