from django.contrib import admin
from .models import Contact


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject']
    readonly_fields = ['created_at']
    list_per_page = 20

    actions = ['mark_as_read', 'mark_as_unread']

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
        self.message_user(request, f'{queryset.count()} پیام به عنوان خوانده شده علامت‌گذاری شد.')

    mark_as_read.short_description = 'علامت‌گذاری به عنوان خوانده شده'

    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)
        self.message_user(request, f'{queryset.count()} پیام به عنوان خوانده نشده علامت‌گذاری شد.')

    mark_as_unread.short_description = 'علامت‌گذاری به عنوان خوانده نشده'


# Customize admin site
admin.site.site_header = 'مدیریت پورتفولیو'
admin.site.site_title = 'پنل مدیریت'
admin.site.index_title = 'خوش آمدید'
