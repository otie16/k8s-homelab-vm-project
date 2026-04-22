from django.urls import path, include

urlpatterns = [
    path('api/', include('tasks.urls')),
    path('health/', lambda request: __import__('django.http', fromlist=['JsonResponse']).JsonResponse({'status': 'ok'})),
    path('ready/', lambda request: __import__('django.http', fromlist=['JsonResponse']).JsonResponse({'status': 'ready'})),
]