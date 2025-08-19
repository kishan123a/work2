# registration/views.py

# --- Core Django and Python Imports ---
import base64
import uuid
import json
import logging
import json
from decimal import Decimal
from dateutil.parser import isoparse
from django.shortcuts import render


# --- Django Imports ---
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from datetime import  timedelta
from django.shortcuts import render, redirect
from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.core.files.base import ContentFile
from django.contrib.gis.geos import Point
from django.core.files.storage import default_storage
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
# Required for complex lookups
from .models import IndividualLabor, Mukkadam, Transport, Others,JobFeedback

# ... (keep all your existing views) ...
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout # Import auth functions
from django.contrib.auth.forms import AuthenticationForm # Import the built-in login form

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.http import require_POST
from django.contrib.contenttypes.models import ContentType
from datetime import timedelta

from .models import (
    Job, JobLeaderResponse, JobAssignment, Notification, WorkerStatus,
    IndividualLabor, Mukkadam, Transport, Others
)


from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.utils.timezone import now, timedelta
from .models import Job, Notification # Make sure to import your models

from .forms import (
    BaseInformationForm, IndividualLaborForm, MukkadamForm,
    TransportForm, OthersForm, DataSharingAgreementForm
)
from .models import StatusUpdate,IndividualLabor, Mukkadam, Transport, Others

logger = logging.getLogger('registration')


class MultiStepRegistrationView(View):
    """
    This view only handles GET requests for the PWA's multi-step form pages.
    The form submissions are handled by a separate API endpoint.
    """
    template_name = 'registration/multi_step_form.html'

    def get_form_class(self, category):
        form_mapping = {
            'individual_labor': IndividualLaborForm,
            'mukkadam': MukkadamForm,
            'transport': TransportForm,
            'others': OthersForm,
        }
        return form_mapping.get(category)

    def get(self, request):
        step = request.GET.get('step', '1')
        current_category = request.GET.get('current_category_from_db')
        context = {
            'step': int(step),
            'form': None,
            'step_title': '',
            'progress_percent': 0,
            'category': current_category
        }

        if step == '1':
            context['form'] = BaseInformationForm()
            context['step_title'] = 'Basic Information'
            context['progress_percent'] = 33
        elif step == '2':
            if not current_category:
                messages.error(request, 'Please complete basic information first.')
                return redirect('registration:registration')
            form_class = self.get_form_class(current_category)
            if not form_class:
                messages.error(request, 'Invalid category selected.')
                return redirect('registration:registration')
            context['form'] = form_class()
            category_names = {
                'individual_labor': 'Individual Labor Details',
                'mukkadam': 'Mukkadam Details',
                'transport': 'Transport Details',
                'others': 'Business Details'
            }
            context['step_title'] = category_names.get(current_category, 'Category Details')
            context['progress_percent'] = 66
        elif step == '3':
            if not current_category:
                messages.error(request, 'Please complete basic information first.')
                return redirect('registration:registration')
            context['form'] = DataSharingAgreementForm()
            context['step_title'] = 'Data Sharing Agreement'
            context['progress_percent'] = 100
        else:
            return redirect('registration:registration')

        return render(request, self.template_name, context)

@csrf_exempt
@require_POST
def check_mobile_number_api(request):
    """
    API endpoint to check if a mobile number already exists in the database.
    """
    # This function is preserved exactly as you had it.
    try:
        data = json.loads(request.body)
        mobile_number = data.get('mobile_number', '').strip()
        if not mobile_number:
            return JsonResponse({'exists': False, 'message': 'No mobile number provided'})
        
        exists = mobile_number_exists(mobile_number)
        return JsonResponse({
            'exists': exists,
            'message': 'Mobile number already registered' if exists else 'Mobile number available'
        })
    except Exception as e:
        logger.error(f"Error checking mobile number: {e}")
        return JsonResponse({'exists': False, 'message': 'Server error'}, status=500)


@csrf_exempt
@require_POST
def submit_registration_api(request):
    """
    Handles both ONLINE (file upload) and OFFLINE (base64 string) submissions
    and saves the image to Cloudinary. This is the fully corrected version.
    """
    logger.info("API received a submission.")
    try:
        data = request.POST
        
        # --- Get Image Data (handles both online and offline paths) ---
        photo_file = request.FILES.get('photo')
        photo_base64 = data.get('photo_base64')

        # --- Create Model Instance ---
        category = data.get('category')
        common_data = {
            'full_name': data.get('full_name'),
            'mobile_number': data.get('mobile_number'),
            'taluka': data.get('taluka'),
            'village': data.get('village'),
            'data_sharing_agreement': data.get('data_sharing_agreement') == 'true'
        }
        
        instance = None
        if category == 'individual_labor':
            skills_str = data.get('skills', '[]')
            skills = json.loads(skills_str)
            comm_prefs_str = data.get('communication_preferences', '[]')
            communication_preferences = json.loads(comm_prefs_str)
            instance = IndividualLabor(
                **common_data,
                gender=data.get('gender'),
                age=int(data.get('age', 0)),
                primary_source_income=data.get('primary_source_income'),
                employment_type=data.get('employment_type'),
                willing_to_migrate=data.get('willing_to_migrate') == 'true',
                expected_wage=Decimal(data.get('expected_wage', 0)),
                availability=data.get('availability'),
                skill_pruning='pruning' in skills,
                skill_harvesting='harvesting' in skills,
                skill_dipping='dipping' in skills,
                skill_thinning='thinning' in skills,
                comm_mobile_app='mobile_app' in communication_preferences,
                comm_whatsapp='whatsapp' in communication_preferences,
                comm_calling='calling' in communication_preferences,
                comm_sms='sms' in communication_preferences,
            )
        elif category == 'mukkadam':
             instance = Mukkadam(
                **common_data,
                providing_labour_count=int(data.get('providing_labour_count', 0)),
                total_workers_peak=int(data.get('total_workers_peak', 0)),
                expected_charges=Decimal(data.get('expected_charges', 0)),
                labour_supply_availability=data.get('labour_supply_availability'),
                arrange_transport=data.get('arrange_transport'),
                supply_areas=data.get('supply_areas'),
            )
        elif category == 'transport':
            instance = Transport(
                **common_data,
                vehicle_type=data.get('vehicle_type'),
                people_capacity=int(data.get('people_capacity', 0)),
                expected_fair=Decimal(data.get('expected_fair', 0)),
                availability=data.get('availability'),
                service_areas=data.get('service_areas')
            )
        elif category == 'others':
             instance = Others(
                **common_data,
                business_name=data.get('business_name'),
                help_description=data.get('help_description'),
            )
        else:
            return JsonResponse({'status': 'error', 'message': f'Invalid category: {category}'}, status=400)

        # --- Handle Location ---
        location_str = data.get('location')
        if location_str:
            try:
                location_data = json.loads(location_str)
                if location_data and 'latitude' in location_data and 'longitude' in location_data:
                    instance.location = Point(float(location_data['longitude']), float(location_data['latitude']))
                    instance.location_accuracy = float(location_data.get('accuracy', 0))
                    if 'timestamp' in location_data:
                        instance.location_timestamp = isoparse(location_data['timestamp'])
            except Exception as e:
                logger.warning(f"Could not parse location data '{location_str}'. Error: {e}")

        # --- Save the main model data (without photo yet) ---
        instance.save()

        # --- FINAL DEBUGGING CHECK ---
        print("\n--- RUNTIME STORAGE CHECK ---")
        print(f"The default_storage object being used is: {default_storage}")
        print(f"The class of the storage object is: {default_storage.__class__}")
        print("---------------------------\n")

        # --- Save Photo to Cloudinary (Handles both paths) ---
        if photo_file:
            instance.photo.save(photo_file.name, photo_file, save=True)
            logger.info(f"Photo for {common_data['full_name']} saved to Cloudinary from direct upload.")
        elif photo_base64:
            try:
                header, img_str = photo_base64.split(';base64,')
                ext = header.split('/')[-1]
                file_name = f"{uuid.uuid4().hex}.{ext}"
                decoded_file = base64.b64decode(img_str)
                content_file = ContentFile(decoded_file, name=file_name)
                instance.photo.save(file_name, content_file, save=True)
                logger.info(f"Photo for {common_data['full_name']} saved to Cloudinary from offline sync.")
            except Exception as e:
                logger.error(f"Failed to save photo from Base64. Error: {e}", exc_info=True)

        return JsonResponse({'status': 'success', 'message': 'Registration saved.'}, status=200)

    except Exception as e:
        logger.error(f"Critical error in submit_registration_api: {e}", exc_info=True)
        return JsonResponse({'status': 'error', 'message': 'An unexpected server error occurred.'}, status=500)


def success_view(request):
    return render(request, 'registration/success.html')


def home_view(request):
    return render(request, 'registration/home.html')


@csrf_exempt
def location_status_api(request):
    # This function is preserved exactly as you had it.
    if request.method == 'POST':
        return JsonResponse({'status': 'success', 'message': 'Location received successfully'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


def mobile_number_exists(mobile_number):
    """Checks if a mobile number exists in ANY of the registration models."""
    # This function is preserved exactly as you had it.
    if not mobile_number:
        return False
    cleaned_number = str(mobile_number).strip().replace('+91', '')
    if not cleaned_number.isdigit():
        return False
    if IndividualLabor.objects.filter(mobile_number__endswith=cleaned_number).exists():
        return True
    if Mukkadam.objects.filter(mobile_number__endswith=cleaned_number).exists():
        return True
    if Transport.objects.filter(mobile_number__endswith=cleaned_number).exists():
        return True
    if Others.objects.filter(mobile_number__endswith=cleaned_number).exists():
        return True
    return False

from django.contrib.sessions.models import Session
from django.utils import timezone

from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages # Import the messages framework

def login_view(request):
    if request.method == 'POST':
        # Create a form instance with the submitted data
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            # The AuthenticationForm has already verified the user.
            # We can get the user object directly from the form.
            user = form.get_user()
            login(request, user)
            # Redirect to a success page.
            return redirect('registration:leader_dashboard')
        # If the form is not valid, the view will fall through and
        # render the template with the form, which now contains the errors.
    else:
        # For a GET request, create a new, blank form
        form = AuthenticationForm()
        
    return render(request, 'registration/login.html', {'form': form})


def logout_view(request):
    logout(request)
    # (Optional but recommended) Add a message to inform the user.
    messages.success(request, "You have been successfully logged out.")
    # After logout, redirect them back to the login page
    return redirect('registration:login')
# def login_view(request):
#     if request.method == 'POST':
#         form = AuthenticationForm(request, data=request.POST)
#         if form.is_valid():
#             username = form.cleaned_data.get('username')
#             password = form.cleaned_data.get('password')
#             user = authenticate(username=username, password=password)
#             if user is not None:
#                 login(request, user)
#                 # After successful login, redirect them to the All Laborers page
#                 return redirect('registration:leader_dashboard')
#     else:
#         form = AuthenticationForm()
#     return render(request, 'registration/login.html', {'form': form})

# def logout_view(request):
#     logout(request)
#     # After logout, redirect them back to the login page


@login_required
def job_requests_view(request):
    """Main job requests view with corrected context data."""
    today = now().date()
    four_days_ago = today - timedelta(days=4) # Changed from 2 to 4 as in your template text

    # Get jobs for the tabs
    latest_jobs = Job.objects.filter(
        status='pending',
        created_at__date__gte=four_days_ago
    ).order_by('-created_at')

    pending_jobs = Job.objects.filter(
        status='pending',
        created_at__date__lt=four_days_ago
    ).order_by('-created_at')

    # ongoing_jobs = Job.objects.filter(
    #     status__in=['waiting_for_response', 'ongoing']
    # ).order_by('-created_at')

    completed_jobs = Job.objects.filter(
        status='completed'
    ).order_by('-completion_date')

    # KEY CHANGE: Create a combined list of jobs that need allocation for the modals
    allocatable_jobs = list(latest_jobs) + list(pending_jobs)

    # Get all team leaders
    # Note: Assumes leaders are not superusers to filter out main admins.
    team_leaders = User.objects.filter(is_superuser=False).distinct()
    ongoing_jobs = Job.objects.filter(
    status__in=['waiting_for_response', 'leader_responded', 'ongoing']
).order_by('-updated_at')

    context = {
        'latest_jobs': latest_jobs,
        'pending_jobs': pending_jobs,
        'ongoing_jobs': ongoing_jobs,
        'completed_jobs': completed_jobs,
        'allocatable_jobs': allocatable_jobs, # Pass this new list to the template
        'team_leaders': team_leaders,
        'today_date': today.isoformat(),
    }
    return render(request, 'registration/job/job_requests.html', context)

@login_required
def job_detail_view(request, job_id):
    """Shows the full details of a single job."""
    job = get_object_or_404(Job, id=job_id)
    assignments = JobAssignment.objects.filter(job=job).select_related('content_type')


    # If the job is ongoing or completed, find the team that was assigned
   
    context = {
        'job': job,
        'assignments': assignments,
    }
    return render(request, 'registration/job/job_detail.html', context)


# You'll also need the view to handle the form submission
@login_required
def allocate_job_to_leaders(request, job_id):
    if request.method == 'POST':
        job = Job.objects.get(id=job_id)
        leader_ids = request.POST.getlist('leaders') # 'leaders' is the name of our select input

        leaders = User.objects.filter(id__in=leader_ids)

        for leader in leaders:
            JobLeaderAllocation.objects.get_or_create(job=job, leader=leader)

            job.sent_to_leaders.add(leader)
            Notification.objects.create(
                user=leader,
                message=f"You have been requested for a new job: '{job.title}'.",
                job=job
            )

        # Update job status and save
        job.status = 'waiting_for_response'
        job.save()

        # You can add a Django message here for user feedback
        # messages.success(request, f"Request sent to {len(leaders)} leaders for job '{job.title}'.")
        return redirect('registration:job_requests')

    # Redirect if accessed via GET
    return redirect('registration:job_requests')


@login_required
def mark_notification_read_and_redirect_view(request, notification_id):
    """Marks a notification as read and redirects the leader to the relevant page."""
    notification = get_object_or_404(Notification, id=notification_id, user=request.user)
    if not notification.is_read:
        notification.is_read = True
        notification.save()
    
    # Redirect to the page to find laborers for the job linked to the notification
    # 1. First, check if this is a Bid Notification
    bid_content_type = ContentType.objects.get_for_model(JobBid)
    if notification.content_type == bid_content_type:
        # If it's a bid notification, go to the leader's bid page
        return redirect('registration:leader_bids')

    # 2. If not a bid, check if it's an old job allocation notification
    elif notification.job:
        # This is your old logic, which we keep for backwards compatibility
        # NOTE: You might want to change where this goes, e.g., to the job detail page
        return redirect('registration:find_laborers_for_job', job_id=notification.job.id)

    return redirect('registration:leader_dashboard')

# @login_required
# def leader_new_requests_view(request):
#     """Displays new job requests sent to the leader."""
#     all_notifications = Notification.objects.filter(user=request.user)
#     unread_count = all_notifications.filter(is_read=False).count()
    
#     assigned_jobs = Job.objects.filter(
#         sent_to_leaders=request.user, 
#         status='waiting_for_response'
#     ).order_by('-created_at')

#     context = {
#         'assigned_jobs': assigned_jobs,
#         'notifications': all_notifications.order_by('-created_at')[:5],
#         'unread_count': unread_count,
#     }
#     return render(request, 'registration/leader/leader_new_requests.html', context)

# @login_required
# def leader_confirmations_view(request):
#     """Displays jobs approved by admin, awaiting leader's final confirmation."""
#     all_notifications = Notification.objects.filter(user=request.user)
#     unread_count = all_notifications.filter(is_read=False).count()

#     jobs_awaiting_confirmation = Job.objects.filter(
#         finalized_leader=request.user, 
#         status='awaiting_leader_confirmation'
#     ).order_by('-updated_at')

#     context = {
#         'jobs_awaiting_confirmation': jobs_awaiting_confirmation,
#         'notifications': all_notifications.order_by('-created_at')[:5],
#         'unread_count': unread_count,
#     }
#     return render(request, 'registration/leader/leader_confirmations.html', context)


# @login_required
# def leader_ongoing_jobs_view(request):
#     """Displays jobs that the leader has confirmed and are in progress."""
#     all_notifications = Notification.objects.filter(user=request.user)
#     unread_count = all_notifications.filter(is_read=False).count()

#     ongoing_jobs = Job.objects.filter(
#         finalized_leader=request.user, 
#         status='ongoing'
#     ).order_by('-updated_at')

#     context = {
#         'ongoing_jobs': ongoing_jobs,
#         'notifications': all_notifications.order_by('-created_at')[:5],
#         'unread_count': unread_count,
#     }
#     return render(request, 'registration/leader/leader_ongoing_jobs.html', context)


# registration/views.py

@login_required
def leader_new_requests_view(request):
    """Displays new job requests and marks related notifications as read."""
    
    # Mark notifications for new jobs as read UPON visiting this page
    Notification.objects.filter(
        user=request.user,
        is_read=False,
        job__status='waiting_for_response'
    ).update(is_read=True)

    # Get all notifications for the navbar dropdown
    all_notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
    unread_count = all_notifications.filter(is_read=False).count()
    
    assigned_jobs = Job.objects.filter(sent_to_leaders=request.user, status='waiting_for_response').order_by('-created_at')

    context = {
        'assigned_jobs': assigned_jobs,
        'notifications': all_notifications[:5], # Show 5 most recent in dropdown
        'unread_count': unread_count,
    }
    return render(request, 'registration/leader/leader_new_requests.html', context)


@login_required
def leader_confirmations_view(request):
    """Displays jobs awaiting confirmation and marks related notifications as read."""

    # Mark notifications for jobs needing confirmation as read UPON visiting this page
    Notification.objects.filter(
        user=request.user,
        is_read=False,
        job__status='awaiting_leader_confirmation'
    ).update(is_read=True)

    all_notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
    unread_count = all_notifications.filter(is_read=False).count()

    jobs_awaiting_confirmation = Job.objects.filter(
        finalized_leader=request.user, 
        status='awaiting_leader_confirmation'
    ).order_by('-updated_at')

    context = {
        'jobs_awaiting_confirmation': jobs_awaiting_confirmation,
        'notifications': all_notifications[:5],
        'unread_count': unread_count,
    }
    return render(request, 'registration/leader/leader_confirmations.html', context)


@login_required
def leader_ongoing_jobs_view(request):
    """Displays jobs that are in progress."""
    all_notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
    unread_count = all_notifications.filter(is_read=False).count()

    ongoing_jobs = Job.objects.filter(finalized_leader=request.user, status='ongoing').order_by('-updated_at')

    context = {
        'ongoing_jobs': ongoing_jobs,
        'notifications': all_notifications[:5],
        'unread_count': unread_count,
    }
    return render(request, 'registration/leader/leader_ongoing_jobs.html', context)
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import Http404 # Import Http404 to block access

# Make sure all your models are imported
from .models import (
    Job, JobLeaderAllocation, WorkerStatus, 
    IndividualLabor, Mukkadam, Transport
)

@login_required
def find_laborers_view(request, job_id):
    """
    Page for a leader to find and filter available workers for a specific job.
    This view is secured to ensure only the allocated leader can access it.
    """
    # Step 1: Get the job object. This confirms the job ID is valid.
    job = get_object_or_404(Job, id=job_id)
    
    # Step 2: SECURITY CHECK - Verify that an allocation record exists
    # linking this job to the currently logged-in user.
    is_allocated = JobLeaderAllocation.objects.filter(
        job=job, 
        leader=request.user
    ).exists()

    # If no allocation record is found, block access immediately.
    if not is_allocated:
        raise Http404("You are not authorized to view this job allocation.")

    # --- The rest of your view logic runs only if the check passes ---

    # Find all workers who are already booked
    booked_status = WorkerStatus.objects.filter(availability_status='booked')
    
    # Create a dictionary to easily check if a worker is booked
    booked_workers = {}
    for status in booked_status:
        # Key: "model_name-pk", e.g., "individuallabor-5"
        key = f"{status.content_type.model}-{status.object_id}"
        booked_workers[key] = True

    # Query all potential workers and then filter out the booked ones in Python
    all_individuals = [w for w in IndividualLabor.objects.all() if f"individuallabor-{w.pk}" not in booked_workers]
    all_mukkadams = [w for w in Mukkadam.objects.all() if f"mukkadam-{w.pk}" not in booked_workers]
    all_transports = [w for w in Transport.objects.all() if f"transport-{w.pk}" not in booked_workers]

    context = {
        'job': job,
        'available_individuals': all_individuals,
        'available_mukkadams': all_mukkadams,
        'available_transports': all_transports,
    }
    return render(request, 'registration/labours/find_laborers.html', context)
from django.contrib.contenttypes.models import ContentType

@login_required
def assign_team_to_job_view(request, job_id):
    """STEP 1: Leader proposes a team by updating WorkerStatus to 'proposed'."""
    job = get_object_or_404(Job, id=job_id)
    if request.method == 'POST':
        worker_ids = request.POST.getlist('workers')
        response_message = request.POST.get('response_message', '')
        quoted_price = request.POST.get('quoted_price')

        for worker_id_str in worker_ids:
            model_name, pk = worker_id_str.split('-')
            content_type = ContentType.objects.get(model=model_name)
            WorkerStatus.objects.update_or_create(
                content_type=content_type, object_id=pk,
                defaults={
                    'availability_status': 'proposed',
                    'current_job': job,
                    'proposed_by': request.user
                }
            )
        
        job.finalized_leader = request.user
        job.status = 'leader_responded'
        job.leader_response_message = response_message
        if quoted_price:
            job.leader_quoted_price = Decimal(quoted_price)
        job.save()

        # Notify admin
        admin_user = User.objects.filter(is_superuser=True).first()
        if admin_user:
            Notification.objects.create(
                user=admin_user,
                message=f"Leader {request.user.username} has proposed a team for '{job.title}'.",
                job=job
            )
        
        messages.success(request, "Your team proposal has been sent.")
        return redirect('registration:leader_dashboard')
    return redirect('registration:find_laborers_for_job', job_id=job.id)



@login_required
def view_leader_response_view(request, job_id):
    """A simple view for the ADMIN to see the leader's response."""
    job = get_object_or_404(Job, id=job_id)
    # Add logic here for the admin to approve the team, which would change the status to 'ongoing'
    # For now, just display the details.
    # NEW LOGIC: Find workers by their 'proposed' status for this job
    proposed_worker_statuses = WorkerStatus.objects.filter(
        current_job=job,
        availability_status='proposed'
    )
    # Manually fetch the actual worker objects for display
    proposed_workers = [status.worker for status in proposed_worker_statuses]

    context = {
        'job': job,
        'assignments': proposed_workers, # Pass the worker objects to the template
    }
    return render(request, 'registration/job/admin_view_response.html', context)

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Job, JobAssignment, StatusUpdate, User,JobLeaderAllocation

@login_required
def leader_manage_team_view(request, job_id):
    """
    Displays the team management page for a specific job, including the
    current status and the next possible status action for each worker.
    """
    job = get_object_or_404(Job, id=job_id, finalized_leader=request.user)
    assignments = JobAssignment.objects.filter(job=job)

    # Define the sequence of statuses
    status_sequence = [choice[0] for choice in StatusUpdate.STATUS_CHOICES]
    
    assignments_with_status = []
    for assignment in assignments:
        latest_update = assignment.status_updates.order_by('-timestamp').first()
        current_status = latest_update.status if latest_update else None

        next_status = None
        if current_status:
            # Find the next status in the sequence, if not the last one
            try:
                current_index = status_sequence.index(current_status)
                if current_index < len(status_sequence) - 1:
                    next_status = status_sequence[current_index + 1]
            except ValueError:
                # This handles cases where status might be invalid, though unlikely
                pass
        else:
            # If there's no status yet, the first one is the next logical step
            next_status = status_sequence[0]

        assignments_with_status.append({
            'assignment': assignment,
            'latest_update': latest_update,
            'next_status': next_status
        })

    context = {
        'job': job,
        'assignments_with_status': assignments_with_status,
        'all_statuses': StatusUpdate.STATUS_CHOICES, # Pass all statuses for the stepper display
    }
    return render(request, 'registration/leader/leader_manage_team.html', context)
@login_required
def update_worker_status_view(request, assignment_id):
    """
    Handles the POST request from the leader's "Manage Team" page.
    Its only job is to create a new status update and redirect back.
    """
    # Use a generic redirect in case something goes wrong early
    fallback_redirect = redirect('registration:leader_dashboard')

    if request.method == 'POST':
        print(f"Received POST for assignment_id: {assignment_id}") # DEBUG
        try:
            # This is the most likely point of failure.
            assignment = get_object_or_404(JobAssignment, id=assignment_id, job__finalized_leader=request.user)
            fallback_redirect = redirect('registration:leader_manage_team', job_id=assignment.job.id)
        except JobAssignment.DoesNotExist:
             messages.error(request, "Assignment not found or you do not have permission to update it.")
             return fallback_redirect

        new_status = request.POST.get('status')
        print(f"Attempting to set new status: {new_status}") # DEBUG

        # Check if the status is valid
        valid_statuses = [choice[0] for choice in StatusUpdate.STATUS_CHOICES]
        if new_status in valid_statuses:
            StatusUpdate.objects.create(
                assignment=assignment,
                status=new_status,
                updated_by=request.user
            )
            messages.success(request, f"Status for '{assignment.worker.full_name}' successfully updated to '{dict(StatusUpdate.STATUS_CHOICES)[new_status]}'.")
            print("Status update successful!") # DEBUG
        else:
            messages.error(request, "Invalid status provided.")
            print(f"Invalid status '{new_status}' received.") # DEBUG

        return fallback_redirect

    # Redirect if accessed via GET
    return fallback_redirect


@login_required
def live_job_status_view(request, job_id):
    """
    Admin-only view to see a live, detailed timeline of a job's progress.
    """
    job = get_object_or_404(Job, id=job_id)
    assignments = JobAssignment.objects.filter(job=job)
    status_updates = StatusUpdate.objects.filter(assignment__in=assignments).order_by('-timestamp')
    
    # Check if all workers have reached the final status
    all_complete = True
    if assignments.exists():
        for assignment in assignments:
            if not assignment.status_updates.filter(status='payment_processed').exists():
                all_complete = False
                break
    else:
        all_complete = False # No assignments means not complete

    context = {
        'job': job,
        'status_updates': status_updates,
        'show_complete_button': all_complete,
    }
    return render(request, 'registration/job/live_job_status.html', context)


@login_required
def approve_team_view(request, job_id):
    """Admin action to approve a leader's proposed team and start the job."""
    if request.method == 'POST':
        job = get_object_or_404(Job, id=job_id)
        job.status = 'awaiting_leader_confirmation'
        job.save()
        if job.finalized_leader:
            Notification.objects.create(
                user=job.finalized_leader,
                message=f"Admin has approved your team for '{job.title}'. Please confirm to start.",
                job=job
            )
        messages.success(request, "Approval sent to leader for final confirmation.")
    return redirect('registration:job_requests')
# --- 2. ADD these two NEW views for the leader's actions ---

@login_required
def leader_confirm_start_view(request, job_id):
    """STEP 2: Leader gives FINAL confirmation. JobAssignments and the first 'assigned' status are created."""
    job = get_object_or_404(Job, id=job_id, finalized_leader=request.user)
    if request.method == 'POST':
        proposed_statuses = WorkerStatus.objects.filter(
            current_job=job,
            availability_status='proposed',
            proposed_by=request.user
        )
        for status in proposed_statuses:
            assignment, created = JobAssignment.objects.get_or_create(
                job=job, content_type=status.content_type, object_id=status.object_id,
                defaults={'assigned_by': request.user}
            )
            if created:
                StatusUpdate.objects.create(
                    assignment=assignment,
                    status='assigned',
                    updated_by=request.user
                )
            status.availability_status = 'booked'
            status.save()

        job.status = 'ongoing'
        job.save()
        messages.success(request, f"You have confirmed the job '{job.title}'.")
    return redirect('registration:leader_dashboard')

@login_required
def leader_cancel_job_view(request, job_id):
    """Leader action to cancel the job after admin approval."""
    job = get_object_or_404(Job, id=job_id, finalized_leader=request.user)
    if request.method == 'POST':
        # This logic is similar to the admin's reject view
        # 1. Free up workers
        assignments = JobAssignment.objects.filter(job=job)
        for assignment in assignments:
            WorkerStatus.objects.update_or_create(
                content_type=assignment.content_type,
                object_id=assignment.object_id,
                defaults={'availability_status': 'available', 'current_job': None}
            )
        # 2. Delete assignments
        assignments.delete()
        # 3. Reset job fields
        job.status = 'pending'
        job.finalized_leader = None
        job.leader_response_message = None
        job.leader_quoted_price = None
        job.save()
        messages.error(request, f"You have canceled the job '{job.title}'. It is now pending again.")
        # Notify admin of cancellation
        admin_user = User.objects.filter(is_superuser=True).first()
        if admin_user:
             Notification.objects.create(user=admin_user, message=f"Leader CANCELED the job after approval: '{job.title}'", job=job)
    return redirect('registration:leader_dashboard')

@login_required
def reject_team_view(request, job_id):
    """Admin action to reject a leader's proposed team and reopen the job."""
    if request.method == 'POST':
        job = get_object_or_404(Job, id=job_id)
        rejected_leader = job.finalized_leader

        # 1. Free up all the workers that were part of the proposed team
        assignments = JobAssignment.objects.filter(job=job)
        for assignment in assignments:
            WorkerStatus.objects.update_or_create(
                content_type=assignment.content_type,
                object_id=assignment.object_id,
                defaults={'availability_status': 'available', 'current_job': None}
            )
        
        # 2. Delete the now-rejected assignments
        assignments.delete()

        # 3. Reset the job's fields and revert its status to 'pending'
        job.status = 'pending'
        job.finalized_leader = None
        job.leader_response_message = None
        job.leader_quoted_price = None
        job.save()

        # 4. Notify the rejected leader
        if rejected_leader:
            Notification.objects.create(
                user=rejected_leader,
                message=f"Your proposed team for '{job.title}' was not approved. The job has been reopened.",
                job=job
            )

        messages.warning(request, f"Team rejected for '{job.title}'. The job is now pending reallocation.")
        return redirect('registration:job_requests')

    return redirect('registration:job_requests')

@login_required
def leader_reject_job_view(request, job_id):
    """Leader action to cancel the job after admin approval."""
    job = get_object_or_404(Job, id=job_id, finalized_leader=request.user)
    if request.method == 'POST':
        # This logic is similar to the admin's reject view
        # 1. Free up workers
        assignments = JobAssignment.objects.filter(job=job)
        for assignment in assignments:
            WorkerStatus.objects.update_or_create(
                content_type=assignment.content_type,
                object_id=assignment.object_id,
                defaults={'availability_status': 'available', 'current_job': None}
            )
        # 2. Delete assignments
        assignments.delete()
        # 3. Reset job fields
        job.status = 'pending'
        job.finalized_leader = None
        job.leader_response_message = None
        job.leader_quoted_price = None
        job.save()
        messages.error(request, f"You have canceled the job '{job.title}'. It is now pending again.")
        # Notify admin of cancellation
        admin_user = User.objects.filter(is_superuser=True).first()
        if admin_user:
             Notification.objects.create(user=admin_user, message=f"Leader CANCELED the job after approval: '{job.title}'", job=job)
    return redirect('registration:leader_dashboard')



@login_required
def job_response_view(request, job_id):
    """View to manage responses from team leaders"""
    job = get_object_or_404(Job, id=job_id)
    responses = JobLeaderResponse.objects.filter(job=job).select_related('leader')
    
    context = {
        'job': job,
        'responses': responses,
    }
    return render(request, 'registration/job_response_screen.html', context)

# API Views
@login_required
def respond_to_job_api(request, job_id):
    """API endpoint for leaders to respond to job requests"""
    if request.method == 'POST':
        job = get_object_or_404(Job, id=job_id)
        response_type = request.POST.get('response')  # 'accepted' or 'rejected'
        quoted_price = request.POST.get('quoted_price')
        rejection_reason = request.POST.get('rejection_reason', '')
        available_workers = request.POST.get('available_workers_count')
        
        # Update or create response
        job_response, created = JobLeaderResponse.objects.update_or_create(
            job=job,
            leader=request.user,
            defaults={
                'response': response_type,
                'quoted_price': quoted_price if response_type == 'accepted' else None,
                'rejection_reason': rejection_reason if response_type == 'rejected' else '',
                'available_workers_count': available_workers if response_type == 'accepted' else None,
                'response_date': timezone.now()
            }
        )
        
        # Create notification for admin
        admin_users = User.objects.filter(is_superuser=True)
        for admin in admin_users:
            Notification.objects.create(
                user=admin,
                title=f'Job Response: {job.title}',
                message=f'{request.user.get_full_name()} has {response_type} the job "{job.title}".',
                job=job
            )
        
        return JsonResponse({'status': 'success', 'message': 'Response recorded successfully.'})
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})


# registration/views.py

# from decimal import Decimal
# from geopy.geocoders import GoogleV3
# from geopy.distance import geodesic
# from .models import LaboursAdvancedProfiles # Add this import

# # ... (keep all your existing views) ...

# @login_required
# def advanced_labor_search_view(request, job_id):
#     job = get_object_or_404(Job, id=job_id)
    
#     # IMPORTANT: Replace with your actual API key
#     # It's best practice to store this in your settings.py or environment variables
#     API_KEY = "AIzaSyC0gN6MTJX6Nn1I0Ia41XeTMbThF3Nu_dY"
#     geolocator = GoogleV3(api_key=API_KEY)

#     try:
#         job_geocode = geolocator.geocode(job.location)
#         if not job_geocode:
#             messages.error(request, f"Could not find coordinates for job location: {job.location}")
#             return redirect('registration:find_laborers_view', job_id=job.id)
#         job_coords = (job_geocode.latitude, job_geocode.longitude)
#     except Exception as e:
#         messages.error(request, f"Location service error: {e}")
#         return redirect('registration:find_laborers_view', job_id=job.id)

#     # Find profiles available on the job's required date
#     required_date_str = job.required_by_date.strftime('%Y-%m-%d')
#     available_profiles = LaboursAdvancedProfiles.objects.filter(
#         available_dates__contains=required_date_str
#     )
    
#     ranked_laborers = []
#     for profile in available_profiles:
#         transport_cost = Decimal(0)
#         if profile.requires_transport:
#             try:
#                 labourer_location_str = f"{profile.labour.village}, {profile.labour.taluka}"
#                 labourer_geocode = geolocator.geocode(labourer_location_str)
#                 if labourer_geocode:
#                     labourer_coords = (labourer_geocode.latitude, labourer_geocode.longitude)
#                     distance_km = geodesic(job_coords, labourer_coords).kilometers
#                     # Your formula: 5 rs/km
#                     transport_cost = Decimal(distance_km * 5)
#                 else:
#                     # Skip this labourer if we can't find their location
#                     continue
#             except Exception:
#                 # Also skip if there's an API error for this specific labourer
#                 continue

#         # Calculate total cost and profit
#         labourer_total_cost = (profile.advanced_rate_per_day * job.duration_days) + transport_cost
#         job_total_revenue = job.rate_per_day * job.duration_days
#         profit = job_total_revenue - labourer_total_cost

#         # Only include profitable options
#         if profit > 0:
#             ranked_laborers.append({
#                 'profile': profile,
#                 'profit': profit,
#                 'transport_cost': transport_cost,
#                 'labourer': profile.labour
#             })

#     # Sort the final list by profit, highest first
#     ranked_laborers.sort(key=lambda x: x['profit'], reverse=True)
    
#     context = {
#         'job': job,
#         'ranked_laborers': ranked_laborers,
#     }
#     return render(request, 'registration/labours/advanced_search_results.html', context)

# registration/views.py

from datetime import timedelta
from decimal import Decimal
from geopy.geocoders import GoogleV3
from geopy.distance import geodesic
from .models import Job, LaboursAdvancedProfiles # Ensure models are imported

@login_required
def advanced_labor_search_view(request, job_id):
    job = get_object_or_404(Job, id=job_id)
    
    # --- Geocoding setup remains the same ---
    API_KEY = "AIzaSyC0gN6MTJX6Nn1I0Ia41XeTMbThF3Nu_dY"
    geolocator = GoogleV3(api_key=API_KEY)
    try:
        job_geocode = geolocator.geocode(job.location)
        if not job_geocode:
            messages.error(request, f"Could not find coordinates for job location: {job.location}")
            return redirect('registration:find_laborers_for_job', job_id=job.id)
        job_coords = (job_geocode.latitude, job_geocode.longitude)
    except Exception as e:
        messages.error(request, f"Location service error: {e}")
        return redirect('registration:find_laborers_for_job', job_id=job.id)

    # --- NEW LOGIC FOR DATE RANGE OVERLAP ---

    # 1. Define the job's required date range
    job_start_date = job.required_by_date
    job_end_date = job_start_date + timedelta(days=job.duration_days - 1)

    # 2. Find all profiles whose availability range OVERLAPS with the job's range.
    # The logic is: their availability starts before the job ends, AND their availability ends after the job starts.
    overlapping_profiles = LaboursAdvancedProfiles.objects.filter(
        available_from__isnull=False, # Ensure dates are not empty
        available_to__isnull=False,
        available_from__lte=job_end_date,
        available_to__gte=job_start_date
    )
    
    ranked_laborers = []
    for profile in overlapping_profiles:
        # --- Transport cost logic remains the same ---
        transport_cost = Decimal(0)
        if profile.requires_transport:
            try:
                labourer_location_str = f"{profile.labour.village}, {profile.labour.taluka}"
                labourer_geocode = geolocator.geocode(labourer_location_str)
                if labourer_geocode:
                    labourer_coords = (labourer_geocode.latitude, labourer_geocode.longitude)
                    distance_km = geodesic(job_coords, labourer_coords).kilometers
                    transport_cost = Decimal(distance_km * 5)
                else: continue
            except Exception: continue

        # --- NEW: Calculate the actual number of overlapping days for profit calculation ---
        overlap_start = max(job_start_date, profile.available_from)
        overlap_end = min(job_end_date, profile.available_to)
        overlapping_days = (overlap_end - overlap_start).days + 1
        
        if overlapping_days <= 0:
            continue # Should not happen with the query above, but a good safeguard

        # Calculate profit based on the ACTUAL number of days they can work
        job_revenue_for_overlap = job.rate_per_day * overlapping_days
        labourer_cost_for_overlap = (profile.advanced_rate_per_day * overlapping_days) + transport_cost
        profit = job_revenue_for_overlap - labourer_cost_for_overlap
        
        # We now include everyone with an overlap, for negotiation purposes
        ranked_laborers.append({
            'labourer': profile.labour,
            'profit': profit,
            'transport_cost': transport_cost,
            'profile': profile,
            'overlapping_days': overlapping_days,
            'overlap_start_date': overlap_start,
            'overlap_end_date': overlap_end,
        })

    # Sort the final list by profit, highest first
    ranked_laborers.sort(key=lambda x: x['profit'], reverse=True)
    
    context = {
        'job': job,
        'ranked_laborers': ranked_laborers,
    }
    return render(request, 'registration/labours/advanced_search_results.html', context)


# registration/views.py
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone

from .models import Job, Mukkadam, JobBid
from .forms import JobBidForm
from .decorators import mukadam_required

# --- Mukadam Login/Logout ---
def mukadam_login_view(request):
    if request.user.is_authenticated:
        if request.user.groups.filter(name='Mukadams').exists():
            return redirect('registration:mukadam_dashboard')
    
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            if user.groups.filter(name='Mukadams').exists():
                login(request, user)
                return redirect('registration:mukadam_dashboard')
            else:
                messages.error(request, 'This portal is for Mukadams only.')
        else:
            messages.error(request, 'Invalid username or password.')
    
    form = AuthenticationForm()
    return render(request, 'registration/mukadam/login.html', {'form': form})

def mukadam_logout_view(request):
    logout(request)
    return redirect('registration:mukadam_login')


# --- Mukadam Portal Views ---
# registration/views.py
from django.db.models import Q # Make sure Q is imported
# registration/views.py

# registration/views.py

# @mukadam_required
# def mukadam_dashboard_view(request):
#     mukadam_profile = get_object_or_404(Mukkadam, user=request.user)
    
#     open_jobs = Job.objects.filter(
#         status='pending',
#         bidding_deadline__gte=timezone.now()
#     ).order_by('required_by_date')

#     # --- START OF DEBUG CODE ---
#     print("\n--- Mukadam Dashboard Debug ---")
#     print(f"Searching for jobs with status='pending' and deadline after {timezone.now()}")
#     print(f"Found {open_jobs.count()} open jobs in the database query.")

#     for job in open_jobs:
#         print(f"  -> Job Title: {job.title}, Status: {job.status}, Deadline: {job.bidding_deadline}")
#     print("-----------------------------\n")
#     # --- END OF DEBUG CODE ---

#     my_bids = JobBid.objects.filter(mukadam=mukadam_profile).select_related('job')
#     my_bid_job_ids = [bid.job.id for bid in my_bids]

#     context = {
#         'open_jobs': open_jobs,
#         'my_bids': my_bids,
#         'my_bid_job_ids': my_bid_job_ids,
#         'mukadam_profile': mukadam_profile,
#     }
#     return render(request, 'registration/mukadam/dashboard.html', context)


# registration/views.py
from django.db.models import Q # Make sure Q is imported

@mukadam_required
def mukadam_dashboard_view(request):
    mukadam_profile = get_object_or_404(Mukkadam, user=request.user)
    
    # NEW QUERY:
    # Get all jobs that are NOT ongoing or completed, AND the deadline has not passed.
    open_jobs = Job.objects.filter(
        ~Q(status='ongoing') &
        ~Q(status='completed'),
        bidding_deadline__gte=timezone.now()
    ).order_by('required_by_date')

    my_bids = JobBid.objects.filter(mukadam=mukadam_profile).select_related('job')
    my_bid_job_ids = [bid.job.id for bid in my_bids]

    context = {
        'open_jobs': open_jobs,
        'my_bids': my_bids,
        'my_bid_job_ids': my_bid_job_ids,
        'mukadam_profile': mukadam_profile,
    }
    return render(request, 'registration/mukadam/dashboard.html', context)


@mukadam_required
def mukadam_profile_view(request):
    profile = get_object_or_404(Mukkadam, user=request.user)
    context = {'profile': profile}
    return render(request, 'registration/mukadam/profile.html', context)


@mukadam_required
def mukadam_bid_view(request, job_id):
    job = get_object_or_404(Job, id=job_id, bidding_deadline__gte=timezone.now())
    mukadam_profile = get_object_or_404(Mukkadam, user=request.user)
    
    # Check if a bid already exists to pre-fill the form
    try:
        existing_bid = JobBid.objects.get(job=job, mukadam=mukadam_profile)
    except JobBid.DoesNotExist:
        existing_bid = None

    if request.method == 'POST':
        form = JobBidForm(request.POST, instance=existing_bid)
        if form.is_valid():
            bid = form.save(commit=False)
            bid.job = job
            bid.mukadam = mukadam_profile
            bid.save()
            
            form.save_m2m() 
            
            messages.success(request, f"Your bid for '{job.title}' has been submitted successfully!")
            return redirect('registration:mukadam_dashboard')
    else:
        form = JobBidForm(instance=existing_bid)

    context = {
        'form': form,
        'job': job
    }
    return render(request, 'registration/mukadam/bid_form.html', context)

# registration/views.py
from django.db.models import Prefetch # Make sure to import Prefetch

# ... (keep all your other views) ...

# registration/views.py
from django.db.models import Q, Prefetch # Make sure Q and Prefetch are imported

# ... (keep all your other views) ...

# registration/views.py
from django.db.models import Count # Make sure to import Count

# --- UPDATE THIS VIEW ---
# registration/views.py
from django.db.models import Count, Q # Make sure Q is imported
from django.utils import timezone
from .models import Job, JobBid # and other models

# ... (other views) ...

# --- REPLACE your old live_bids_dashboard_view with this ---
@login_required
def live_bids_dashboard_view(request):
    """
    This is the SUMMARY view. It shows jobs and the number of bids.
    This version uses the CORRECT query.
    """
    # This query now matches your mukadam_dashboard_view logic
    biddable_jobs_query = Job.objects.filter(
        ~Q(status='ongoing') &
        ~Q(status='completed'),
        bidding_deadline__gte=timezone.now()
    )

    # Use annotate() to efficiently count the number of bids for each job
    jobs_with_bid_counts = biddable_jobs_query.annotate(
        bid_count=Count('bids')
    ).order_by('-created_at')

    context = {
        'jobs': jobs_with_bid_counts
    }
    return render(request, 'registration/bids/live_bids_dashboard.html', context)

# ... (rest of your views.py) ...

# --- ADD THIS NEW VIEW for the detail page ---
@login_required
def bid_detail_view(request, job_id):
    """
    Displays the full list of bids for a SINGLE job and shows allocated leaders.
    """
    job = get_object_or_404(Job, id=job_id)
    
    # Get all bids for this job, lowest price first
    bids = JobBid.objects.filter(job=job).order_by('bid_price').select_related('mukadam')
    
    # Get all leaders allocated to this job from our new model
    allocations = JobLeaderAllocation.objects.filter(job=job).select_related('leader')
    
    context = {
        'job': job,
        'bids': bids,
        'allocations': allocations,
    }
    return render(request, 'registration/bids/bid_detail.html', context)



# # --- ADD THIS NEW VIEW for the notification action ---
# @require_POST # Ensures this can only be called by a form submission
# @login_required
# def notify_leader_of_bid_view(request, bid_id):
#     bid = get_object_or_404(JobBid, id=bid_id)
#     job = bid.job
    
#     # Find all leaders allocated to this job
#     allocations = JobLeaderAllocation.objects.filter(job=job)
    
#     if not allocations:
#         messages.error(request, f"Cannot send notification: No leader is allocated to the job '{job.title}'.")
#         return redirect('registration:bid_detail', job_id=job.id)

#     # Create a detailed notification for each allocated leader
#     for allocation in allocations:
#         leader = allocation.leader
#         Notification.objects.create(
#             user=leader,
#             message=(
#                 f"A promising bid was placed for '{job.title}'. "
#                 f"Mukadam: {bid.mukadam.full_name}, "
#                 f"he has this much worker: {bid.workers_provided}"
#             ),
#             job=job
#         )
    
#     messages.success(request, f"Notification about {bid.mukadam.full_name}'s bid sent to {allocations.count()} leader(s).")
#     return redirect('registration:bid_detail', job_id=job.id)

# registration/views.py

@require_POST
@login_required
def notify_leader_of_bid_view(request, bid_id):
    bid = get_object_or_404(JobBid, id=bid_id)
    job = bid.job
    allocations = JobLeaderAllocation.objects.filter(job=job)
    
    bid_content_type = ContentType.objects.get_for_model(JobBid)
    

    message_lines = [
        f"A promising bid was placed for '{job.title}'.",
        f"Mukadam: {bid.mukadam.full_name}",
        f"Bid Price: {bid.bid_price}",
        f"Workers Provided: {bid.workers_provided}",
    ]

    if not allocations:
        messages.error(request, f"Cannot send: No leader is allocated to '{job.title}'.")
        return redirect('registration:bid_detail', job_id=job.id)

    if bid.notes_on_skills:
        message_lines.append(f"Skills Mentioned: {bid.notes_on_skills}")

    # Add the list of registered labourers if they were selected
    registered_labourers = bid.registered_labourers.all()
    if registered_labourers:
        labourer_names = ", ".join([labourer.full_name  for labourer in registered_labourers])
        labourer_number = ", ".join([labourer.mobile_number  for labourer in registered_labourers])
       
        message_lines.append(f"Registered Labourers in Bid: {labourer_names}")
        
    # Join all the lines into a single message
    detailed_message = "\n".join(message_lines)

    # Create a notification for each allocated leader
    for allocation in allocations:
        leader = allocation.leader
        Notification.objects.create(
            user=leader,
            title=f"New Bid from {bid.mukadam.full_name}", # A more specific title
            message=detailed_message,
            job=job,

            content_type=bid_content_type,
            object_id=bid.pk
            
        )
    
    # This success message is already in your code and will work as you requested
    messages.success(request, f"Notification about {bid.mukadam.full_name}'s bid sent to {allocations.count()} leader(s).")
    return redirect('registration:bid_detail', job_id=job.id)
# registration/views.py

# registration/views.py

@login_required
def leader_bids_view(request):
    bid_content_type = ContentType.objects.get_for_model(JobBid)
    
    # Find all notifications for this leader that are linked to a JobBid
    bid_notifications = Notification.objects.filter(
        user=request.user,
        content_type=bid_content_type
    )

    # --- START OF DEBUG CODE ---
    print("\n--- Leader Bids Page Debug ---")
    print(f"Logged in as leader: {request.user.username}")
    print(f"Looking for notifications with ContentType ID: {bid_content_type.id} (JobBid)")
    print(f"Found {bid_notifications.count()} bid-related notifications for this user.")
    for notif in bid_notifications:
        print(f"  -> Notification ID: {notif.id}, Message: {notif.message}")
    print("----------------------------\n")
    # --- END OF DEBUG CODE ---
    
    # Mark these notifications as read when the leader visits the page
    bid_notifications.filter(is_read=False).update(is_read=True)

    context = {
        'bid_notifications': bid_notifications,
    }
    return render(request, 'registration/leader/leader_bids.html', context)



# registration/views.py
from django.db.models import Count, Sum, Avg

# --- MUKADAM PROFILE VIEW ---
@login_required # Should be admin only
def mukadam_performance_profile_view(request, mukadam_id):
    mukadam = get_object_or_404(Mukkadam, id=mukadam_id)
    
    all_bids = JobBid.objects.filter(mukadam=mukadam).order_by('-timestamp')
    won_bids = all_bids.filter(status='won')
    
    # Calculate stats
    stats = {
        'total_bids': all_bids.count(),
        'bids_won': won_bids.count(),
        'total_earnings': won_bids.aggregate(total=Sum('bid_price'))['total'] or 0,
        'total_workers_provided': won_bids.aggregate(total=Sum('workers_provided'))['total'] or 0,
    }
    
    # Get feedback
    feedback_ct = ContentType.objects.get_for_model(Mukkadam)
    feedback = JobFeedback.objects.filter(content_type=feedback_ct, object_id=mukadam.id)
    stats['average_rating'] = feedback.aggregate(avg=Avg('rating'))['avg'] or 'N/A'

    context = {
        'mukadam': mukadam,
        'stats': stats,
        'all_bids': all_bids,
        'feedback_list': feedback,
    }
    return render(request, 'registration/profiles/mukadam_profile.html', context)


# --- LABOURER PROFILE VIEW ---
@login_required
def labourer_profile_view(request, labourer_id):
    labourer = get_object_or_404(IndividualLabor, id=labourer_id)
    
    # Get work history
    labourer_ct = ContentType.objects.get_for_model(IndividualLabor)
    work_history = JobAssignment.objects.filter(content_type=labourer_ct, object_id=labourer.id).select_related('job')
    
    # Get feedback
    feedback = JobFeedback.objects.filter(content_type=labourer_ct, object_id=labourer.id)
    average_rating = feedback.aggregate(avg=Avg('rating'))['avg'] or 'N/A'

    context = {
        'labourer': labourer,
        'work_history': work_history,
        'job_count': work_history.count(),
        'average_rating': average_rating,
    }
    return render(request, 'registration/profiles/labourer_profile.html', context)


# --- LEADER PROFILE VIEW ---
@login_required
def leader_profile_view(request, user_id):
    leader = get_object_or_404(User, id=user_id)
    
    # Get jobs managed by this leader
    jobs_managed = Job.objects.filter(finalized_leader=leader).order_by('-created_at')
    
    # Calculate stats
    stats = {
        'total_jobs': jobs_managed.count(),
        'completed_jobs': jobs_managed.filter(status='completed').count(),
        'ongoing_jobs': jobs_managed.filter(status='ongoing').count(),
    }
    
    context = {
        'leader': leader,
        'jobs_managed': jobs_managed,
        'stats': stats,
    }
    return render(request, 'registration/profiles/leader_profile.html', context)


# registration/views.py
from django.contrib.auth.models import Group

# ... (keep all your other views) ...

@login_required # Make sure only logged-in admins can see this
def profile_selector_view(request):
    """
    Provides the data for the page where an admin can select
    a role and a person to view their profile.
    """
    labourers = IndividualLabor.objects.all().order_by('full_name')
    mukadams = Mukkadam.objects.all().order_by('full_name')
    
    # Assuming your Leaders are users in a "Leaders" group
    try:
        leader_group = Group.objects.get(name='Leaders')
        leaders = leader_group.user_set.all().order_by('username')
    except Group.DoesNotExist:
        leaders = User.objects.none() # Return an empty list if group doesn't exist

    context = {
        'labourers': labourers,
        'mukadams': mukadams,
        'leaders': leaders,
    }
    return render(request, 'registration/profiles/profile_selector.html', context)

# @login_required
# def mark_notification_read(request, notification_id):
    """Mark a notification as read"""
    notification = get_object_or_404(Notification, id=notification_id, user=request.user)
    notification.is_read = True
    notification.save()
    return JsonResponse({'status': 'success'})