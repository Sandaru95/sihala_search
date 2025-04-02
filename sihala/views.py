from django.shortcuts import redirect
from django.views import generic

class ToSearchRedirectView(generic.View):

    def get(self, request):
        return redirect('search:index')