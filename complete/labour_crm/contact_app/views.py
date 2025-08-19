# contact_app/views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt # Import csrf_exempt
# from corsheaders.decorators import cors_exempt       # Import cors_exempt
import json
from .models import ContactMessage
from django.shortcuts import render # Make sure render is imported

def home_page(request):
    return render(request, 'contact_app/home.html', {'message': 'Welcome to my Contact App!'})


# Apply decorators directly to the function for function-based views
@csrf_exempt # This decorator disables CSRF protection for this view
# @cors_exempt # This decorator allows CORS for this view
def contact_form_submit(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            full_name = data.get('fullName')
            email = data.get('email')
            message = data.get('message')

            # Basic server-side validation
            if not all([full_name, email, message]):
                return JsonResponse({'message': 'All fields are required.'}, status=400)

            # Save the data to the database using the ContactMessage model
            ContactMessage.objects.create(
                full_name=full_name,
                email=email,
                message=message
            )

            # Return a success response
            return JsonResponse({'message': 'Message received successfully!'}, status=200)

        except json.JSONDecodeError:
            # Handle cases where the request body is not valid JSON
            return JsonResponse({'message': 'Invalid JSON payload.'}, status=400)
        except Exception as e:
            # Catch any other unexpected errors during processing or saving
            print(f"Error saving contact message: {e}") # Log the error for debugging
            return JsonResponse({'message': f'An internal server error occurred: {str(e)}'}, status=500)
    else:
        # Respond to methods other than POST (e.g., GET)
        return JsonResponse({'message': 'Only POST requests are allowed for this endpoint.'}, status=405)