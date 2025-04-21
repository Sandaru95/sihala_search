from django.shortcuts import render, HttpResponse
from django.views.generic import View
import requests

API_KEY = "AIzaSyCJ3rNUHH8wZwjXrIegsV2hGOI6xn2zWX0"
def get_trending_videos():
    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "snippet",
        "chart": "mostPopular",
        "regionCode": "LK",  # Changed from "US" to "LK" for Sri Lanka
        "maxResults": 10,
        "key": API_KEY
    }
    
    response = requests.get(url, params=params)
    videos_data = response.json()
    videos = []
    for item in videos_data.get("items", []):
        video = {
            'title': item["snippet"]["title"],
            'description': item["snippet"]["description"],
            'thumbnail': item["snippet"]["thumbnails"]["high"]["url"],
            'video_id': item["id"]
        }
        videos.append(video)
            
    return videos

class IndexView(View):
    def get(self, request):
        yt_videos = get_trending_videos
        return render(request, "search/html/index.html", {'yt_videos':yt_videos})
class ResultsView(View):
    def get(self, request):
        return render(request, "search/html/results.html", {})
    
class ResultsVideoView(View):
    def get(self, request):
        return render(request, "search/html/results_video.html", {})