# File Upload Setup - Manual Deposit System

## Overview
This document describes the file upload infrastructure for the manual deposit system, enabling users to submit payment screenshots (JazzCash & Easypaisa) for verification.

## Architecture

### File Storage
- **Location**: `uploads/deposits/` (created automatically on first upload)
- **Naming**: `{timestamp}-{randomString}-{originalname}`
- **Example**: `1704067200000-a1b2c3d4e-payment.png`
- **Served At**: `http://localhost:3000/uploads/deposits/filename.png`

### Multer Configuration
```typescript
// Location: server/routes/api.ts
const uploadDeposit = multer({
  storage: diskStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
    } else {
      cb(null, true);
    }
  },
});
```

## API Endpoint

### POST `/api/wallet/deposit-manual`
**Authentication**: Required (Bearer token)

**Request**:
```
POST /api/wallet/deposit-manual
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- amount: number (> 0)
- paymentMethod: 'jazzcash' | 'easypaisa'
- transactionReference: string (non-empty)
- screenshot: File (image, max 5MB)
- investment: string (MongoDB ID, optional)
```

**Response (Success)**:
```json
{
  "message": "Deposit request submitted successfully. Awaiting admin verification.",
  "deposit": {
    "_id": "ObjectId",
    "user": "ObjectId",
    "amount": 1000,
    "paymentMethod": "jazzcash",
    "transactionReference": "TX123456789",
    "screenshotUrl": "uploads/deposits/1704067200000-a1b2c3d4e-payment.png",
    "status": "pending",
    "investment": "ObjectId",
    "createdAt": "2024-01-01T12:00:00Z"
  },
  "transaction": { /* transaction record */ }
}
```

**Response (Error)**:
- `400 Invalid amount` - Amount <= 0
- `400 Invalid payment method` - Not jazzcash or easypaisa
- `400 Transaction reference/ID is required` - Empty reference
- `400 Payment screenshot is required` - No file uploaded
- `400 Only image files are accepted` - File is not an image
- `413 Payload Too Large` - File exceeds 5MB

## Database Schema

### Deposit Model
```typescript
interface IDeposit {
  user: ObjectId;                    // User who made deposit
  amount: number;                    // Deposit amount in PKR
  paymentMethod: 'jazzcash' | 'easypaisa';
  transactionReference: string;      // User's payment reference ID
  screenshotUrl: string;             // Path to uploaded screenshot
  status: 'pending' | 'approved' | 'rejected';
  investment?: ObjectId;             // Linked investment (optional)
  approvedBy?: ObjectId;             // Admin who approved
  approvedAt?: Date;                 // When approved
  adminRemarks?: string;             // Rejection reason
  isUsed: boolean;                   // Prevent re-use after approval
  createdAt: Date;
  updatedAt: Date;
}
```

## Frontend Integration

### Using DepositModal Component
```tsx
import { DepositModal, DepositFormData } from '../components/DepositModal.tsx';

// In your component:
const handleDepositSubmit = async (formData: DepositFormData) => {
  const formDataObj = new FormData();
  formDataObj.append('amount', planAmount.toString());
  formDataObj.append('paymentMethod', formData.paymentMethod);
  formDataObj.append('transactionReference', formData.transactionReference);
  formDataObj.append('screenshot', formData.screenshot);
  formDataObj.append('investment', investmentId);

  const response = await fetch('/api/wallet/deposit-manual', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formDataObj, // FormData automatically sets Content-Type
  });
};

// Component usage:
<DepositModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  planName="Gold Plan"
  amount={5000}
  onSubmit={handleDepositSubmit}
/>
```

### DepositModal Features
- ✅ Copy-to-clipboard buttons for payment accounts (JazzCash, Easypaisa)
- ✅ Transaction reference input field
- ✅ Screenshot upload with preview
- ✅ File validation (type, size)
- ✅ Professional animations (Framer Motion)
- ✅ Responsive design (mobile/desktop)
- ✅ Success/error alerts

## File Access

### View Uploaded File
```
GET http://localhost:3000/uploads/deposits/{filename}
```

### In Admin Panel
```tsx
<img 
  src={`/uploads/deposits/${deposit.screenshotUrl.split('/').pop()}`}
  alt="Payment proof"
  className="max-w-md rounded-lg"
/>
```

## Testing Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server
```bash
npm run dev
```

### 3. Test Upload Endpoint
```bash
# Using curl
curl -X POST http://localhost:3000/api/wallet/deposit-manual \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "amount=1000" \
  -F "paymentMethod=jazzcash" \
  -F "transactionReference=TX123456" \
  -F "screenshot=@/path/to/image.png" \
  -F "investment=INVESTMENT_ID"
```

### 4. Verify File Upload
- Check `uploads/deposits/` directory for created file
- Retrieve file via browser: `http://localhost:3000/uploads/deposits/filename.png`

### 5. Test Frontend Flow
- Navigate to Plans page
- Click "Invest Now" on any plan
- Fill deposit modal form
- Upload screenshot
- Submit form
- Check browser console for response
- Verify deposit record created in MongoDB

## Security Considerations

1. **File Validation**
   - ✅ MIME type checked (image/* only)
   - ✅ File size limited to 5MB
   - ✅ Filename sanitized with timestamp+random ID

2. **Access Control**
   - ✅ Authentication required (JWT token)
   - ✅ Payment methods restricted to enum (no custom input)
   - ✅ Transaction reference required (prevents empty submissions)

3. **Future Enhancements**
   - [ ] Scan uploaded image for malware
   - [ ] Generate image thumbnails for admin preview
   - [ ] Encrypt sensitive screenshots at rest
   - [ ] Add image watermarking with timestamp
   - [ ] Implement file retention policy (auto-delete after 30 days if not approved)

## Admin Verification Workflow

### Pending Deposits Endpoint
```
GET /api/admin/deposits/pending
Authorization: Bearer {token}
```

### Approve/Reject Deposit
```
POST /api/admin/deposits/{depositId}/approve
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "status": "approved" | "rejected",
  "adminRemarks": "Optional message" 
}
```

## Deployment Notes

### Environment Setup
- ✅ Uploads directory is `.gitignored` (won't be committed)
- ✅ Directory created automatically if missing
- ✅ Works in both development and production

### Production Considerations
- [ ] Store uploads in cloud storage (AWS S3, Azure Blob) instead of filesystem
- [ ] Implement CDN for image serving
- [ ] Add backup strategy for uploaded files
- [ ] Monitor disk usage in production
- [ ] Implement rate limiting on upload endpoint

## Troubleshooting

### Issue: "Only image files are allowed"
**Cause**: File MIME type doesn't start with `image/`
**Solution**: Ensure you're uploading an actual image file (PNG, JPG, GIF, WebP)

### Issue: "Payment screenshot is required"
**Cause**: Field name mismatch or FormData not properly constructed
**Solution**: Verify FormData uses `screenshot` as the field name

### Issue: File uploaded but not visible
**Cause**: Wrong file path format or static route not configured
**Solution**: Check `/uploads` route in server.ts and verify file exists in `uploads/deposits/`

### Issue: 413 Payload Too Large
**Cause**: File exceeds 5MB limit
**Solution**: Compress image before uploading or reduce file size

### Issue: Images not loading in admin panel
**Cause**: CORS or static file serving issue
**Solution**: Verify `/uploads` middleware is registered before Vite middleware

## Next Steps

1. **Admin Panel UI** - Create component to display pending deposits
2. **Image Lightbox** - Add modal for viewing full-size screenshots
3. **Email Notifications** - Send approval/rejection emails to users
4. **Deposit History** - Show user's past deposits in wallet page
5. **Cloud Storage Migration** - Move from filesystem to S3/Blob (production)
