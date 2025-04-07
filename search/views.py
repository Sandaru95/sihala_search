from django.shortcuts import render, HttpResponse
from django.views.generic import View

class IndexView(View):
    def get(self, request):
        return render(request, "search/html/index.html", {})
class ResultsView(View):
    def get(self, request):
        return render(request, "search/html/results.html", {})