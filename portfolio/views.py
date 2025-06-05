from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.mail import send_mail
from django.conf import settings
from .models import Contact
import json


def home(request):
    """Serve the main portfolio page"""
    return render(request, 'index.html')


@require_http_methods(["POST"])
def contact_submit(request):
    """Handle contact form submission via AJAX"""
    try:
        # Get form data
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')

        # Validate required fields
        if not all([name, email, subject, message]):
            return JsonResponse({
                'success': False,
                'message': 'لطفاً تمام فیلدها را پر کنید'
            }, status=400)

        # Save to database
        contact = Contact.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )

        # Send email notification
        try:
            send_mail(
                subject=f'پیام جدید از وبسایت: {subject}',
                message=f'''
پیام جدید از {name}
ایمیل: {email}
موضوع: {subject}

پیام:
{message}
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=['company@example.com'],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Email sending failed: {e}")

        return JsonResponse({
            'success': True,
            'message': 'پیام شما با موفقیت ارسال شد'
        })

    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'خطا در ارسال پیام'
        }, status=500)
