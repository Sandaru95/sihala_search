from django.shortcuts import render, HttpResponse
from django.views import generic
from django.core import serializers
from .models import YtTrending, NewsItem, StatusObject
from bot.models import WebPage

class IndexView(generic.TemplateView):
    template_name = 'search/index.html'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context['youtube_trending_list'] = YtTrending.objects.all()
        context['hot_news_list'] = NewsItem.objects.all()
        context['status_object'] = StatusObject.objects.all()[0]
        return context

class ResultsView(generic.TemplateView):
    template_name = 'search/results.html'

class ResultsVideoView(generic.TemplateView):
    template_name = 'search/results_video.html'

class ResultsImagesView(generic.TemplateView):
    template_name = 'search/results_images.html'

class ResultsMarketView(generic.TemplateView):
    template_name = 'search/results_market.html'

class ResultsMarketGetView(generic.View):
    def post(self, request):
        searched_keyword = request.POST['searched_keyword']
        items_list = serializers.serialize('json', WebPage.objects.filter(title__contains=searched_keyword)[:25])
        return HttpResponse(items_list, content_type="text/json-comment-filtered")
