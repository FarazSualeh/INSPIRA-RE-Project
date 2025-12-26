from rest_framework import serializers
from .models import User, StudentProgress, Class, Activity, QuizResult, Achievement, Assignment


class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    email = serializers.EmailField()
    name = serializers.CharField()
    role = serializers.ChoiceField(choices=['student', 'teacher', 'admin'])
    grade = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)


class UserRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField()
    role = serializers.ChoiceField(choices=['student', 'teacher', 'admin'])
    grade = serializers.CharField(required=False, allow_blank=True)


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class StudentProgressSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    user_id = serializers.CharField()
    subject = serializers.CharField()
    activities_completed = serializers.IntegerField()
    total_activities = serializers.IntegerField()
    points = serializers.IntegerField()
    badges = serializers.ListField(child=serializers.CharField())
    current_level = serializers.IntegerField()


class ClassSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    teacher_id = serializers.CharField()
    class_name = serializers.CharField()
    grade = serializers.CharField()
    subject = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    student_count = serializers.IntegerField()


class ActivitySerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    subject = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)
    grade_level = serializers.CharField()
    activity_type = serializers.CharField()
    difficulty = serializers.CharField()
    points_reward = serializers.IntegerField()
    estimated_time_minutes = serializers.IntegerField(required=False)
    content = serializers.DictField(required=False)


class QuizResultSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    user_id = serializers.CharField()
    activity_id = serializers.CharField()
    score = serializers.IntegerField()
    max_score = serializers.IntegerField()
    time_taken_seconds = serializers.IntegerField(required=False)
    answers = serializers.ListField(child=serializers.DictField(), required=False)
    points_earned = serializers.IntegerField()
    completed_at = serializers.DateTimeField(read_only=True)


class AchievementSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    user_id = serializers.CharField()
    achievement_type = serializers.CharField()
    achievement_name = serializers.CharField()
    achievement_icon = serializers.CharField(required=False, allow_blank=True)
    subject = serializers.CharField(required=False, allow_blank=True)
    earned_at = serializers.DateTimeField(read_only=True)


class AssignmentSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    teacher_id = serializers.CharField()
    title = serializers.CharField()
    type = serializers.ChoiceField(choices=['assignment', 'notice'])
    subject = serializers.CharField()
    target_grade = serializers.CharField()
    content = serializers.CharField()
    attachment = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)


class LeaderboardEntrySerializer(serializers.Serializer):
    user_id = serializers.CharField()
    name = serializers.CharField()
    total_points = serializers.IntegerField()
    rank = serializers.IntegerField()


class DashboardStatsSerializer(serializers.Serializer):
    total_students = serializers.IntegerField()
    total_teachers = serializers.IntegerField()
    total_activities = serializers.IntegerField()
    total_quizzes_completed = serializers.IntegerField()
