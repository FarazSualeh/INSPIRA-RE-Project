from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def api_root(request):
    return JsonResponse({'message': 'Inspira API is running', 'version': '1.0.0'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('', api_root),
]
