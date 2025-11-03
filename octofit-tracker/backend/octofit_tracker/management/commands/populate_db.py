from django.core.management.base import BaseCommand
from octofit_tracker.models import Team, User, Activity, Workout, Leaderboard
from django.db import connection

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Clear existing data
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        User.objects.all().delete()
        Team.objects.all().delete()
        Workout.objects.all().delete()

        # Create teams
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Create users
        users = [
            User.objects.create(name='Spider-Man', email='spiderman@marvel.com', team=marvel),
            User.objects.create(name='Iron Man', email='ironman@marvel.com', team=marvel),
            User.objects.create(name='Wonder Woman', email='wonderwoman@dc.com', team=dc),
            User.objects.create(name='Batman', email='batman@dc.com', team=dc),
        ]

        # Create workouts
        workouts = [
            Workout.objects.create(name='Super Strength', description='Strength training for heroes', difficulty='Hard'),
            Workout.objects.create(name='Agility Training', description='Agility and speed drills', difficulty='Medium'),
        ]

        # Create activities
        Activity.objects.create(user=users[0], type='Running', duration=30, calories=300, date='2025-11-01')
        Activity.objects.create(user=users[1], type='Weight Lifting', duration=45, calories=500, date='2025-11-02')
        Activity.objects.create(user=users[2], type='Yoga', duration=60, calories=200, date='2025-11-03')
        Activity.objects.create(user=users[3], type='Martial Arts', duration=40, calories=350, date='2025-11-04')

        # Create leaderboard
        Leaderboard.objects.create(team=marvel, points=800)
        Leaderboard.objects.create(team=dc, points=750)


        self.stdout.write(self.style.SUCCESS('octofit_db populated with test data.'))
