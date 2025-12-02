# Express NodeMailer Server

A simple Express.js server with NodeMailer integration for sending HTML emails.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `env.example`:
```bash
# Copy env.example to .env and update with your email credentials
```

3. Configure your email settings in `.env`:
   - For Gmail: Enable 2-Step Verification and generate an App Password
   - Use your email and app password in the `.env` file

## Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

### POST `/contact`

Handle contact form submissions and send formatted HTML emails to multiple recipients.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "message": "Your message here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully.",
  "messageId": "<message-id>"
}
```

**Recipients:**
Emails are automatically sent to:
- biz.dev@texpro-kgroup.com.tn
- slim.tounsi@texpro-kgroup.com.tn
- m.abidi.contact@gmail.com

**Note:** Update the `API_URL` in `contact.html` to point to your server URL in production (replace `http://localhost:3000` with your actual server URL).

### POST `/send-email`

Send an HTML email.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "html": "<h1>Hello</h1><p>This is an HTML email.</p>",
  "text": "Hello - This is a plain text fallback (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<message-id>"
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "html": "<h1>Hello!</h1><p>This is a test email from Express server.</p>"
  }'
```

### GET `/`

Health check endpoint that returns server status.

## Email Configuration

### Gmail Setup:
1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Use the generated App Password in `EMAIL_PASSWORD`

### Other Email Providers:
- **Outlook/Hotmail**: `smtp-mail.outlook.com`, port `587`
- **Yahoo**: `smtp.mail.yahoo.com`, port `587`
- **Custom SMTP**: Update `SMTP_HOST` and `SMTP_PORT` in `.env`

