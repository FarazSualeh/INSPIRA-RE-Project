import hashlib
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from .models import User, StudentProgress, Class, Activity, QuizResult, Achievement, Assignment
from .serializers import (
    UserSerializer, UserRegisterSerializer, UserLoginSerializer,
    StudentProgressSerializer, ClassSerializer, ActivitySerializer,
    QuizResultSerializer, AchievementSerializer, AssignmentSerializer,
    LeaderboardEntrySerializer, DashboardStatsSerializer
)


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password, hashed):
    return hash_password(password) == hashed


# ========== AUTH ==========
class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        if User.objects(email=data['email']).first():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User(
            email=data['email'],
            password=hash_password(data['password']),
            name=data['name'],
            role=data['role'],
            grade=data.get('grade', '')
        )
        user.save()
        return Response({'message': 'User registered successfully', 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)


# Alias for /auth/signup
class SignupView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        if User.objects(email=data['email']).first():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User(
            email=data['email'],
            password=hash_password(data['password']),
            name=data['name'],
            role=data['role'],
            grade=data.get('grade', '')
        )
        user.save()
        return Response({'message': 'User registered successfully', 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        user = User.objects(email=data['email']).first()
        if not user or not verify_password(data['password'], user.password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Build profile response matching frontend expectations
        profile = {
            'id': str(user.id),
            '_id': str(user.id),
            'email': user.email,
            'name': user.name,
            'role': user.role,
            'grade': user.grade,
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'updated_at': user.updated_at.isoformat() if user.updated_at else None,
        }
        
        return Response({
            'message': 'Login successful',
            'user': {'id': str(user.id), 'email': user.email},
            'profile': profile
        })


class LogoutView(APIView):
    def post(self, request):
        return Response({'message': 'Logged out successfully'})


class SessionView(APIView):
    def get(self, request):
        # Since we're not using server-side sessions, return null session
        # Frontend handles demo mode when session is null
        return Response({'session': None})


class MeView(APIView):
    def get(self, request):
        user_id = request.headers.get('X-User-Id')
        if not user_id:
            return Response({'error': 'User ID required'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            user = User.objects.get(id=ObjectId(user_id))
            return Response(UserSerializer(user).data)
        except:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class ProfileView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=ObjectId(user_id))
            profile = {
                '_id': str(user.id),
                'id': str(user.id),
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'grade': user.grade,
                'created_at': user.created_at.isoformat() if user.created_at else None,
                'updated_at': user.updated_at.isoformat() if user.updated_at else None,
            }
            return Response({'profile': profile})
        except:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


# ========== ACTIVITIES ==========
class ActivityListView(APIView):
    def get(self, request):
        subject = request.query_params.get('subject')
        grade = request.query_params.get('grade')
        activities = Activity.objects.all()
        if subject:
            activities = activities.filter(subject=subject)
        if grade:
            activities = activities.filter(grade_level=grade)
        return Response([ActivitySerializer(a).data for a in activities])
    
    def post(self, request):
        serializer = ActivitySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        activity = Activity(**serializer.validated_data)
        activity.save()
        return Response(ActivitySerializer(activity).data, status=status.HTTP_201_CREATED)


class ActivityDetailView(APIView):
    def get(self, request, activity_id):
        try:
            activity = Activity.objects.get(id=ObjectId(activity_id))
            return Response(ActivitySerializer(activity).data)
        except:
            return Response({'error': 'Activity not found'}, status=status.HTTP_404_NOT_FOUND)


# ========== QUIZZES ==========
class QuizSubmitView(APIView):
    def post(self, request):
        serializer = QuizResultSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        try:
            user = User.objects.get(id=ObjectId(data['user_id']))
            activity = Activity.objects.get(id=ObjectId(data['activity_id']))
        except:
            return Response({'error': 'Invalid user or activity'}, status=status.HTTP_400_BAD_REQUEST)
        
        result = QuizResult(
            user_id=user,
            activity_id=activity,
            score=data['score'],
            max_score=data['max_score'],
            time_taken_seconds=data.get('time_taken_seconds'),
            answers=data.get('answers', []),
            points_earned=data['points_earned']
        )
        result.save()
        
        # Update progress
        progress = StudentProgress.objects(user_id=user, subject=activity.subject).first()
        if progress:
            progress.activities_completed += 1
            progress.points += data['points_earned']
            progress.save()
        else:
            StudentProgress(
                user_id=user,
                subject=activity.subject,
                activities_completed=1,
                total_activities=1,
                points=data['points_earned'],
                badges=[],
                current_level=1
            ).save()
        
        return Response(QuizResultSerializer(result).data, status=status.HTTP_201_CREATED)


class QuizResultsView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'user_id required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(id=ObjectId(user_id))
            results = QuizResult.objects(user_id=user)
            return Response([QuizResultSerializer(r).data for r in results])
        except:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


# ========== PROGRESS ==========
class StudentProgressView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'user_id required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(id=ObjectId(user_id))
            progress = StudentProgress.objects(user_id=user)
            return Response([StudentProgressSerializer(p).data for p in progress])
        except:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


# ========== LEADERBOARD ==========
class LeaderboardView(APIView):
    def get(self, request):
        subject = request.query_params.get('subject')
        pipeline = [
            {'$group': {'_id': '$user_id', 'total_points': {'$sum': '$points'}}},
            {'$sort': {'total_points': -1}},
            {'$limit': 50}
        ]
        if subject:
            pipeline.insert(0, {'$match': {'subject': subject}})
        
        results = list(StudentProgress.objects.aggregate(pipeline))
        leaderboard = []
        for idx, r in enumerate(results):
            try:
                user = User.objects.get(id=r['_id'])
                leaderboard.append({
                    'user_id': str(r['_id']),
                    'name': user.name,
                    'total_points': r['total_points'],
                    'rank': idx + 1
                })
            except:
                pass
        return Response(leaderboard)


# ========== ACHIEVEMENTS ==========
class AchievementListView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'user_id required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(id=ObjectId(user_id))
            achievements = Achievement.objects(user_id=user)
            return Response([AchievementSerializer(a).data for a in achievements])
        except:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request):
        serializer = AchievementSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        try:
            user = User.objects.get(id=ObjectId(data['user_id']))
        except:
            return Response({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        achievement = Achievement(
            user_id=user,
            achievement_type=data['achievement_type'],
            achievement_name=data['achievement_name'],
            achievement_icon=data.get('achievement_icon', ''),
            subject=data.get('subject', '')
        )
        achievement.save()
        return Response(AchievementSerializer(achievement).data, status=status.HTTP_201_CREATED)


# ========== ASSIGNMENTS ==========
class AssignmentListView(APIView):
    def get(self, request):
        grade = request.query_params.get('grade')
        assignments = Assignment.objects.all()
        if grade:
            assignments = assignments.filter(target_grade=grade)
        return Response([AssignmentSerializer(a).data for a in assignments])
    
    def post(self, request):
        serializer = AssignmentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        try:
            teacher = User.objects.get(id=ObjectId(data['teacher_id']))
        except:
            return Response({'error': 'Teacher not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        assignment = Assignment(
            teacher_id=teacher,
            title=data['title'],
            type=data['type'],
            subject=data['subject'],
            target_grade=data['target_grade'],
            content=data['content'],
            attachment=data.get('attachment', '')
        )
        assignment.save()
        return Response(AssignmentSerializer(assignment).data, status=status.HTTP_201_CREATED)


# ========== CLASSES ==========
class ClassListView(APIView):
    def get(self, request):
        teacher_id = request.query_params.get('teacher_id')
        if teacher_id:
            try:
                teacher = User.objects.get(id=ObjectId(teacher_id))
                classes = Class.objects(teacher_id=teacher)
            except:
                return Response({'error': 'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            classes = Class.objects.all()
        return Response([ClassSerializer(c).data for c in classes])
    
    def post(self, request):
        serializer = ClassSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        try:
            teacher = User.objects.get(id=ObjectId(data['teacher_id']))
        except:
            return Response({'error': 'Teacher not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        new_class = Class(
            teacher_id=teacher,
            class_name=data['class_name'],
            grade=data['grade'],
            subject=data.get('subject', ''),
            description=data.get('description', ''),
            student_count=data['student_count']
        )
        new_class.save()
        return Response(ClassSerializer(new_class).data, status=status.HTTP_201_CREATED)


# ========== STUDENTS/TEACHERS ==========
class StudentListView(APIView):
    def get(self, request):
        students = User.objects(role='student')
        return Response([UserSerializer(s).data for s in students])


class TeacherListView(APIView):
    def get(self, request):
        teachers = User.objects(role='teacher')
        return Response([UserSerializer(t).data for t in teachers])


# ========== DASHBOARD ==========
class DashboardStatsView(APIView):
    def get(self, request):
        stats = {
            'total_students': User.objects(role='student').count(),
            'total_teachers': User.objects(role='teacher').count(),
            'total_activities': Activity.objects.count(),
            'total_quizzes_completed': QuizResult.objects.count()
        }
        return Response(stats)
