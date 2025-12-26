from django.urls import path
from .views import (
    RegisterView, LoginView, MeView, SignupView, LogoutView, SessionView, ProfileView,
    ActivityListView, ActivityDetailView,
    QuizSubmitView, QuizResultsView,
    StudentProgressView,
    LeaderboardView,
    AchievementListView,
    AssignmentListView,
    ClassListView,
    StudentListView, TeacherListView,
    DashboardStatsView
)

urlpatterns = [
    # Auth
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/signup', SignupView.as_view(), name='signup'),
    path('auth/login', LoginView.as_view(), name='login'),
    path('auth/logout', LogoutView.as_view(), name='logout'),
    path('auth/session', SessionView.as_view(), name='session'),
    path('auth/me', MeView.as_view(), name='me'),
    path('auth/profile/<str:user_id>', ProfileView.as_view(), name='profile'),
    
    # Activities
    path('activities', ActivityListView.as_view(), name='activity-list'),
    path('activities/<str:activity_id>', ActivityDetailView.as_view(), name='activity-detail'),
    
    # Quizzes
    path('quizzes/submit', QuizSubmitView.as_view(), name='quiz-submit'),
    path('quizzes/results', QuizResultsView.as_view(), name='quiz-results'),
    
    # Progress
    path('progress', StudentProgressView.as_view(), name='progress'),
    
    # Leaderboard
    path('leaderboard', LeaderboardView.as_view(), name='leaderboard'),
    
    # Achievements
    path('achievements', AchievementListView.as_view(), name='achievements'),
    
    # Assignments
    path('assignments', AssignmentListView.as_view(), name='assignments'),
    
    # Classes
    path('classes', ClassListView.as_view(), name='classes'),
    
    # Users
    path('students', StudentListView.as_view(), name='students'),
    path('teachers', TeacherListView.as_view(), name='teachers'),
    
    # Dashboard
    path('dashboard/stats', DashboardStatsView.as_view(), name='dashboard-stats'),
]
