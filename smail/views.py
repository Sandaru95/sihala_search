from django.shortcuts import render, HttpResponse
from django.views import generic

class IndexView(generic.View):
    def get(self, request):
        return render(request, 'html/smail/index.html', {})
    
class SentView(generic.View):
    def get(self, request):
        return HttpResponse("This is the Sent Box page")
    
class BinView(generic.View):
    def get(self, request):
        return HttpResponse("This is the Bin Page")
    
class ComposeView(generic.View):
    def get(self, request):
        return render(request, 'html/smail/compose.html', {})
    def post(self, request):
        to_mail = request.POST['to_mail']
        subject = request.POST['subject']
        content = request.POST['content']

        print(to_mail)
        print(subject)
        print(content)
        return redirect("smail:index")