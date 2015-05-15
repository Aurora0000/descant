from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from .models import Post
from .serializers import PostSerializer
        
@api_view(["GET", "POST"])
@permission_classes((IsAuthenticatedOrReadOnly,))
def topic_list(request):
    if request.method == 'GET':
        topics = Post.objects.all().filter(is_topic=True)
        serializer = PostSerializer(topics, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        data["is_topic"] = True
        data["author_id"] = request.user.id
        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, 
                        status=status.HTTP_400_BAD_REQUEST)
