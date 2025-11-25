import { Request, Response } from 'express';
import File from '../models/File.model.js';
import cloudinaryUtils from '../config/cloudinary.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const filesController = {
  // Upload single file
  uploadFile: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const { category = 'other', description, tags, isPublic = true } = req.body;
      
      // Validate category
      const validCategories = ['resume', 'project', 'certificate', 'avatar', 'other'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
      }

      // Upload to Cloudinary
      const uploadResult: any = await cloudinaryUtils.uploadFile(
        req.file.buffer,
        `portfolio/${category}`
      );

      // Create file record
      const file = new File({
        filename: uploadResult.public_id,
        originalName: req.file.originalname,
        description,
        storageProvider: 'cloudinary',
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
        format: uploadResult.format,
        resourceType: uploadResult.resource_type,
        size: uploadResult.bytes,
        width: uploadResult.width,
        height: uploadResult.height,
        duration: uploadResult.duration,
        category,
        tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
        isPublic: isPublic === 'true',
        uploadedBy: req.user._id
      });

      await file.save();

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          file: {
            id: file._id,
            filename: file.filename,
            originalName: file.originalName,
            url: file.url,
            size: file.size,
            category: file.category,
            isPublic: file.isPublic
          }
        }
      });

    } catch (error: any) {
      console.error('File upload error:', error);
      
      if (error.message.includes('Cloudinary is not configured')) {
        return res.status(500).json({
          success: false,
          message: 'File upload service is not configured'
        });
      }

      res.status(500).json({
        success: false,
        message: 'File upload failed',
        error: error.message
      });
    }
  },

  // Upload multiple files
  uploadMultipleFiles: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const { category = 'other', description, tags, isPublic = true } = req.body;
      const files = req.files as Express.Multer.File[];

      const uploadResults = [];

      for (const file of files) {
        try {
          const uploadResult: any = await cloudinaryUtils.uploadFile(
            file.buffer,
            `portfolio/${category}`
          );

          const fileRecord = new File({
            filename: uploadResult.public_id,
            originalName: file.originalname,
            description,
            storageProvider: 'cloudinary',
            publicId: uploadResult.public_id,
            url: uploadResult.secure_url,
            format: uploadResult.format,
            resourceType: uploadResult.resource_type,
            size: uploadResult.bytes,
            width: uploadResult.width,
            height: uploadResult.height,
            category,
            tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
            isPublic: isPublic === 'true',
            uploadedBy: req.user._id
          });

          await fileRecord.save();
          uploadResults.push(fileRecord);
        } catch (fileError) {
          console.error(`Failed to upload file ${file.originalname}:`, fileError);
          // Continue with other files even if one fails
        }
      }

      res.status(201).json({
        success: true,
        message: `Successfully uploaded ${uploadResults.length} out of ${files.length} files`,
        data: {
          files: uploadResults.map(file => ({
            id: file._id,
            filename: file.filename,
            originalName: file.originalName,
            url: file.url,
            size: file.size,
            category: file.category
          }))
        }
      });

    } catch (error: any) {
      console.error('Multiple files upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Files upload failed',
        error: error.message
      });
    }
  },

  // Get all files (with filtering and pagination)
 getFiles: async (req: Request, res: Response) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        category, 
        search,
        isPublic = 'true'
      } = req.query;

      const filter: any = { isPublic: isPublic === 'true' };
      
      if (category) {
        filter.category = category;
      }

      if (search) {
        const searchString = search as string; // ✅ FIXED: Type assertion
        filter.$or = [
          { originalName: { $regex: searchString, $options: 'i' } },
          { description: { $regex: searchString, $options: 'i' } },
          { tags: { $in: [new RegExp(searchString, 'i')] } } // ✅ FIXED
        ];
      }

      const files = await File.find(filter)
        .populate('uploadedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit))
        .select('-__v');

      const total = await File.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: files,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      console.error('Get files error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch files'
      });
    }
  },


  // Get file by ID
  getFileById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const file = await File.findById(id)
        .populate('uploadedBy', 'name email');

      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      res.status(200).json({
        success: true,
        data: file
      });

    } catch (error) {
      console.error('Get file error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch file'
      });
    }
  },

  // Delete file
  deleteFile: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const file = await File.findById(id);

      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      // Check if user owns the file or is admin
      if (file.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only delete your own files.'
        });
      }

      // Delete from Cloudinary
      if (file.storageProvider === 'cloudinary') {
        await cloudinaryUtils.deleteFile(file.publicId);
      }

      // Delete from database
      await File.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });

    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete file'
      });
    }
  },

  // Update file metadata
  updateFile: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { description, tags, isPublic, category } = req.body;

      const file = await File.findById(id);

      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      // Check if user owns the file or is admin
      if (file.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update your own files.'
        });
      }

      // Update fields
      if (description !== undefined) file.description = description;
      if (tags !== undefined) file.tags = tags.split(',').map((tag: string) => tag.trim());
      if (isPublic !== undefined) file.isPublic = isPublic === 'true';
      if (category !== undefined) file.category = category;

      await file.save();

      res.status(200).json({
        success: true,
        message: 'File updated successfully',
        data: file
      });

    } catch (error) {
      console.error('Update file error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update file'
      });
    }
  }
};

export default filesController;