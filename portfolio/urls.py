from django.urls import path
from . import views

app_name = 'portfolio'

urlpatterns = [
    path('', views.home, name='home'),
    path('contact/', views.contact_submit, name='contact_submit'),
]
