import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema matching the frontend
const contactFormSchema = z.object({
    name: z
        .string()
        .min(2, 'お名前は2文字以上で入力してください')
        .max(50, 'お名前は50文字以内で入力してください'),
    email: z
        .string()
        .email('正しいメールアドレスを入力してください')
        .min(1, 'メールアドレスは必須です'),
    subject: z
        .string()
        .min(5, '件名は5文字以上で入力してください')
        .max(100, '件名は100文字以内で入力してください'),
    message: z
        .string()
        .min(10, 'メッセージは10文字以上で入力してください')
        .max(1000, 'メッセージは1000文字以内で入力してください'),
});

// Rate limiting (simple in-memory store - in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per 15 minutes

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const userLimit = rateLimitStore.get(ip);

    if (!userLimit || now > userLimit.resetTime) {
        // Reset or create new limit
        rateLimitStore.set(ip, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW,
        });
        return true;
    }

    if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }

    userLimit.count++;
    return true;
}

// Simulate email sending (in production, use services like SendGrid, Nodemailer, etc.)
async function sendEmail(data: z.infer<typeof contactFormSchema>): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log the message (in production, send actual email) - ログ出力を無効化
    // console.log('📧 Contact Form Submission:', {
    //     timestamp: new Date().toISOString(),
    //     name: data.name,
    //     email: data.email,
    //     subject: data.subject,
    //     message: data.message,
    //     sendTo: 'tao.dama.art@gmail.com', // Your actual email
    // });

    // In production, implement actual email sending:
    /*
    const transporter = nodemailer.createTransporter({
      // Email service configuration
    });
  
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'tao.dama.art@gmail.com', // Your email address
      subject: `Portfolio Contact: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    });
    */
}

export async function POST(request: NextRequest) {
    try {
        // Get client IP for rate limiting
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';

        // Check rate limit
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Too many requests. Please try again later.',
                    code: 'RATE_LIMIT_EXCEEDED',
                },
                { status: 429 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validationResult = contactFormSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    code: 'VALIDATION_ERROR',
                    details: validationResult.error.issues,
                },
                { status: 400 }
            );
        }

        const formData = validationResult.data;

        // Basic spam detection
        const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations'];
        const messageText = `${formData.subject} ${formData.message}`.toLowerCase();
        const hasSpam = spamKeywords.some(keyword => messageText.includes(keyword));

        if (hasSpam) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Message flagged as spam',
                    code: 'SPAM_DETECTED',
                },
                { status: 400 }
            );
        }

        // Send email
        await sendEmail(formData);

        // Return success response
        return NextResponse.json(
            {
                success: true,
                message: 'Message sent successfully',
                timestamp: new Date().toISOString(),
            },
            { status: 200 }
        );

    } catch (error) {
        // エラーログを無効化

        // Return generic error response
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
            },
            { status: 500 }
        );
    }
}

// Handle unsupported methods
export async function GET() {
    return NextResponse.json(
        {
            success: false,
            error: 'Method not allowed',
            code: 'METHOD_NOT_ALLOWED',
        },
        { status: 405 }
    );
}

export async function PUT() {
    return NextResponse.json(
        {
            success: false,
            error: 'Method not allowed',
            code: 'METHOD_NOT_ALLOWED',
        },
        { status: 405 }
    );
}

export async function DELETE() {
    return NextResponse.json(
        {
            success: false,
            error: 'Method not allowed',
            code: 'METHOD_NOT_ALLOWED',
        },
        { status: 405 }
    );
}