from django.test import TestCase
from .models import User, Team, Activity, Workout, Leaderboard

class ModelTests(TestCase):
    def setUp(self):
        marvel = Team.objects.create(name='Marvel')
        user = User.objects.create(name='Spider-Man', email='spiderman@marvel.com', team=marvel)
        workout = Workout.objects.create(name='Super Strength', description='Strength training', difficulty='Hard')
        activity = Activity.objects.create(user=user, type='Running', duration=30, calories=300, date='2025-11-01')
        Leaderboard.objects.create(team=marvel, points=1000)

    def test_user_creation(self):
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.first().name, 'Spider-Man')

    def test_team_creation(self):
        self.assertEqual(Team.objects.count(), 1)
        self.assertEqual(Team.objects.first().name, 'Marvel')

    def test_activity_creation(self):
        self.assertEqual(Activity.objects.count(), 1)
        self.assertEqual(Activity.objects.first().type, 'Running')

    def test_workout_creation(self):
        self.assertEqual(Workout.objects.count(), 1)
        self.assertEqual(Workout.objects.first().difficulty, 'Hard')

    def test_leaderboard_creation(self):
        self.assertEqual(Leaderboard.objects.count(), 1)
        self.assertEqual(Leaderboard.objects.first().points, 1000)
