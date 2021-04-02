from django.urls import path

from . import views

urlpatterns = [
    # ex: /polls/
    path('', views.process, name='process'),
]