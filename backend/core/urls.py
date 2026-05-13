from django.urls import path, include
from django.http import JsonResponse


def health(request):
    return JsonResponse({'status': 'ok'})


def ready(request):
    return JsonResponse({'status': 'ready'})


urlpatterns = [
    path('api/', include('tasks.urls')),
    path('health/', health),
    path('ready/', ready),
]