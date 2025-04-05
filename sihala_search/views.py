from django.shortcuts import redirect
from django.views.generic import View

class RedirectToSearchView(View):
    def get(self, request):
        return redirect('search:index')