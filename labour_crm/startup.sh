#!/bin/bash
set -e

echo "Applying database migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --no-input --clear

echo "Creating initial superuser..."
python manage.py create_initial_superuser

echo "Starting Gunicorn server..."
exec gunicorn labour_crm.wsgi:application --bind 0.0.0.0:8000