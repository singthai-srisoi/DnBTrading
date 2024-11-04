from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken


class AuthClass(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response({'message': 'Hello, World!'})


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'}, status=204)
        except Exception as e:
            return Response({'message': 'Logout failed'}, status=400)
