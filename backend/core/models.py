import mongoengine as me
from datetime import datetime


class User(me.Document):
    email = me.EmailField(required=True, unique=True)
    password = me.StringField(required=True)
    name = me.StringField(required=True)
    role = me.StringField(required=True, choices=['student', 'teacher', 'admin'])
    grade = me.StringField()
    created_at = me.DateTimeField(default=datetime.utcnow)
    updated_at = me.DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'users'}

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)


class StudentProgress(me.Document):
    user_id = me.ReferenceField(User, required=True)
    subject = me.StringField(required=True)
    activities_completed = me.IntField(default=0)
    total_activities = me.IntField(default=0)
    points = me.IntField(default=0)
    badges = me.ListField(me.StringField())
    current_level = me.IntField(default=1)
    created_at = me.DateTimeField(default=datetime.utcnow)
    updated_at = me.DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'student_progress'}


class Class(me.Document):
    teacher_id = me.ReferenceField(User, required=True)
    class_name = me.StringField(required=True)
    grade = me.StringField(required=True)
    subject = me.StringField()
    description = me.StringField()
    student_count = me.IntField(default=0)
    created_at = me.DateTimeField(default=datetime.utcnow)
    updated_at = me.DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'classes'}


class Activity(me.Document):
    subject = me.StringField(required=True)
    title = me.StringField(required=True)
    description = me.StringField()
    grade_level = me.StringField(required=True)
    activity_type = me.StringField(required=True)
    difficulty = me.StringField(required=True)
    points_reward = me.IntField(default=0)
    estimated_time_minutes = me.IntField()
    content = me.DictField()
    created_at = me.DateTimeField(default=datetime.utcnow)
    updated_at = me.DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'activities'}


class QuizResult(me.Document):
    user_id = me.ReferenceField(User, required=True)
    activity_id = me.ReferenceField(Activity, required=True)
    score = me.IntField(required=True)
    max_score = me.IntField(required=True)
    time_taken_seconds = me.IntField()
    answers = me.ListField(me.DictField())
    points_earned = me.IntField(default=0)
    completed_at = me.DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'quiz_results'}


class Achievement(me.Document):
    user_id = me.ReferenceField(User, required=True)
    achievement_type = me.StringField(required=True)
    achievement_name = me.StringField(required=True)
    achievement_icon = me.StringField()
    subject = me.StringField()
    earned_at = me.DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'achievements'}


class Assignment(me.Document):
    teacher_id = me.ReferenceField(User, required=True)
    title = me.StringField(required=True)
    type = me.StringField(required=True, choices=['assignment', 'notice'])
    subject = me.StringField(required=True)
    target_grade = me.StringField(required=True)
    content = me.StringField(required=True)
    attachment = me.StringField()
    created_at = me.DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'assignments'}
