from django.contrib import admin
from . import views
from django.urls import path

urlpatterns = [
    path('submit/', views.contact_form_submit, name='contact_submit'),
]
