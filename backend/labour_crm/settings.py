## uncommented code for deployment
# from pathlib import Path
# import os
# import dj_database_url
# import cloudinary

# # Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR = Path(__file__).resolve().parent.parent
# # Security
# SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'replace-this-in-production')
# DEBUG = os.environ.get('DJANGO_DEBUG', 'False') == 'True'
# ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', '*').split(',')

# # Quick-start development settings - unsuitable for production
# # See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# # SECURITY WARNING: keep the secret key used in production secret!
# # SECRET_KEY = 'django-insecure-54c-xh!ea9mdtku-5bt38m7sz%lc03^p#&t0!1*u5y!nm#yi!0'

# # SECURITY WARNING: don't run with debug turned on in production!
# # DEBUG = True
#   # Allow all origins for CORS (not recommended for production)

# # ALLOWED_HOSTS = ['*']
# AUTH_USER_MODEL = 'auth.User' 

# # Application definition
# # Configure Cloudinary (you already have this, but make sure it's properly set)
# cloudinary.config(
#     cloud_name="df8f5bxfp",  # Your cloud name from the URL
#     api_key="196762722111821",  # Your API key from the URL  
#     api_secret="nKpyWbKl0UAdaqgkjI9W0HpQkR4",  # Your API secret from the URL
#     secure=True
# )

# # Optional: Add logging configuration for better debugging
# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'handlers': {
#         'file': {
#             'level': 'INFO',
#             'class': 'logging.FileHandler',
#             'filename': 'cloudinary_uploads.log',
#         },
#         'console': {
#             'level': 'INFO',
#             'class': 'logging.StreamHandler',
#         },
#     },
#     'loggers': {
#         'registration.views': {
#             'handlers': ['file', 'console'],
#             'level': 'INFO',
#             'propagate': True,
#         },
#     },
# }
# INSTALLED_APPS = [
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',
#     'corsheaders',
#     # 'authentication', 
#     #       # PWA support
#     'cloudinary',
#     'cloudinary_storage',
#     'registration',
#     'pwa',  
#     'whitenoise',  # For serving static files in production
# ]

# MIDDLEWARE = [
#     'django.middleware.security.SecurityMiddleware',
#     'whitenoise.middleware.WhiteNoiseMiddleware',
#     'corsheaders.middleware.CorsMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     # 'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
# ]

# ROOT_URLCONF = 'labour_crm.urls'

# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.debug', # Ad
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = 'labour_crm.wsgi.application'


# # Database
# # https://docs.djangoproject.com/en/5.2/ref/settings/#databases
# # DATABASES = {
# #     'default': {
# #         'ENGINE': 'django.contrib.gis.db.backends.postgis',
# #         'NAME': 'registration_db',
# #         'USER': 'postgres',
# #         'PASSWORD': 'work1234',
# #         'HOST': 'localhost',
# #         'PORT': '5432',
# #     }
# # }

# DATABASES = {
#     'default': dj_database_url.config(
#         default=os.environ.get('DATABASE_URL'),
#         conn_max_age=600,
#     )
# }
# # --- TEMPORARY DEBUG PRINT ---
# print("\n--- DEBUG: DATABASES CONFIG ---")
# print(DATABASES['default']['ENGINE'])
# print("--- END DEBUG ---\n")
# # --- END TEMPORARY DEBUG PRINT ---

# # ... rest of your settings.py
# # Password validation
# # https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

# AUTH_PASSWORD_VALIDATORS = [
#     {
#         'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
#     },
# ]


# # Internationalization
# # https://docs.djangoproject.com/en/5.2/topics/i18n/

# LANGUAGE_CODE = 'en-us'

# TIME_ZONE = 'UTC'

# USE_I18N = True

# USE_TZ = True
# MEDIA_URL = '/media/'
# # MEDIA_ROOT = os.path.join(BASE_DIR, 'media') # 

# # Static files (CSS, JavaScript, Images)
# # https://docs.djangoproject.com/en/5.2/howto/static-files/
# # Static & Media
# STATIC_URL = '/static/'
# STATICFILES_DIRS = [BASE_DIR / 'static']
# STATIC_ROOT = BASE_DIR / 'staticfiles'
# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage' # <--- CORRECTED TYPO HERE


# # PWA Settings
# PWA_APP_NAME = 'AgroIntel'
# PWA_APP_DESCRIPTION = "AgroIntel - Connecting Farmers with Labours"
# PWA_APP_THEME_COLOR = '#2196f3'
# PWA_APP_BACKGROUND_COLOR = '#e3f2fd'
# PWA_APP_DISPLAY = 'standalone'
# PWA_APP_SCOPE = '/register/' # Important: This means the SW controls your entire domain
# PWA_APP_START_URL = '/register/' 
# PWA_APP_ICONS = [
#     {
#         'src': '/static/images/android-chrome-192x192.png',
#         'sizes': '192x192'
#     },
#     {
#         'src': '/static/images/android-chrome-512x512.png',
#         'sizes': '512x512'
#     }
# ]

# # Path to your custom service worker (create this later)
# PWA_SERVICE_WORKER_PATH = os.path.join(BASE_DIR, 'registration', 'static', 'registration', 'js', 'serviceworker.js')

# # Default primary key field type
# # https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# CORS_ALLOW_ALL_ORIGINS = True

# # --- Cloudinary Storage Configuration ---
# CLOUDINARY_STORAGE = {
#     'CLOUDINARY_URL':'cloudinary://196762722111821:nKpyWbKl0UAdaqgkjI9W0HpQkR4@df8f5bxfp'
#     # It's recommended to store this URL in an environment variable for security
# }

# # Set Cloudinary as the default file storage
# DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'



from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# --- SECURITY SETTINGS FOR PRODUCTION ---
SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = os.environ.get('DEBUG', '0') == '1'
ALLOWED_HOSTS_str = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1')
ALLOWED_HOSTS = [host.strip() for host in ALLOWED_HOSTS_str.split(',')]

# Settings to work behind the Nginx reverse proxy for HTTPS
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True


# --- APPLICATION DEFINITION ---
AUTH_USER_MODEL = 'auth.User'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    'django.contrib.gis',
    'widget_tweaks',
    'registration',
    'contact_app',
    'pwa',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'labour_crm.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.debug',
                'registration.context_processors.notifications_processor',
            ],
        },
    },
]

WSGI_APPLICATION = 'labour_crm.wsgi.application'


# --- DATABASE CONFIGURATION FOR PRODUCTION ---
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': os.environ.get('POSTGRES_DB'),
        'USER': os.environ.get('POSTGRES_USER'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
        'HOST': os.environ.get('POSTGRES_HOST'),
        'PORT': '5432',
    }
}


# --- PASSWORD VALIDATION ---
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# --- INTERNATIONALIZATION ---
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# --- STATIC & MEDIA FILES FOR PRODUCTION ---
STATIC_URL = '/static/'
MEDIA_URL = '/media/'
STATIC_ROOT = '/app/staticfiles'
MEDIA_ROOT = '/app/media'


# --- PWA SETTINGS ---
PWA_APP_NAME = 'AgroIntel'
PWA_APP_DESCRIPTION = "AgroIntel - Connecting Farmers with Labours"
PWA_APP_THEME_COLOR = '#2196f3'
PWA_APP_BACKGROUND_COLOR = '#e3f2fd'
PWA_APP_DISPLAY = 'standalone'
PWA_APP_SCOPE = '/register/registration/'
PWA_APP_START_URL = '/register/registration/'
PWA_APP_ICONS = [
    {'src': '/static/images/android-chrome-192x192.png', 'sizes': '192x192'},
    {'src': '/static/images/android-chrome-512x512.png', 'sizes': '512x512'}
]
PWA_SERVICE_WORKER_PATH = os.path.join(BASE_DIR, 'registration', 'static', 'registration', 'js', 'serviceworker.js')


# --- DEFAULT PRIMARY KEY ---
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# from pathlib import Path
# import os

# # Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR = Path(__file__).resolve().parent.parent


# # Quick-start development settings - unsuitable for production
# # See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# # SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = 'django-insecure-54c-xh!ea9mdtku-5bt38m7sz%lc03^p#&t0!1*u5y!nm#yi!0'

# # SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = True

# ALLOWED_HOSTS = ['*']
# AUTH_USER_MODEL = 'auth.User' 

# # Application definition

# INSTALLED_APPS = [
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',
#     'django.contrib.humanize',
#     'django.contrib.gis',  # Required for GIS support
#     'widget_tweaks',
#     'registration',
#     'pwa',  
# ]

# MIDDLEWARE = [
#     'django.middleware.security.SecurityMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
# ]

# ROOT_URLCONF = 'labour_crm.urls'

# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#                 'django.template.context_processors.debug',
#                 'registration.context_processors.notifications_processor', 
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = 'labour_crm.wsgi.application'


# # Database
# # https://docs.djangoproject.com/en/5.2/ref/settings/#databases
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.contrib.gis.db.backends.postgis',
#         'NAME': 'registration_db',
#         'USER': 'postgres',
#         'PASSWORD': 'new_password',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }

# # Password validation
# # https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

# AUTH_PASSWORD_VALIDATORS = [
#     {
#         'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
#     },
# ]


# # Internationalization
# # https://docs.djangoproject.com/en/5.2/topics/i18n/

# LANGUAGE_CODE = 'en-us'

# TIME_ZONE = 'UTC'

# USE_I18N = True

# USE_TZ = True
# MEDIA_URL = '/media/'
# MEDIA_ROOT = os.path.join(BASE_DIR, 'media') # 

# # Static files (CSS, JavaScript, Images)
# # https://docs.djangoproject.com/en/5.2/howto/static-files/
# # Static & Media
# STATIC_URL = '/static/'
# STATICFILES_DIRS = [BASE_DIR / 'static']
# STATIC_ROOT = BASE_DIR / 'staticfiles'

# # PWA Settings
# PWA_APP_NAME = 'AgroIntel'
# PWA_APP_DESCRIPTION = "AgroIntel - Connecting Farmers with Labours"
# PWA_APP_THEME_COLOR = '#2196f3'
# PWA_APP_BACKGROUND_COLOR = '#e3f2fd'
# PWA_APP_DISPLAY = 'standalone'
# PWA_APP_SCOPE = '/' # Important: This means the SW controls your entire domain
# PWA_APP_START_URL = '/register/registration/' 
# PWA_APP_ICONS = [
#     {
#         'src': '/static/images/android-chrome-192x192.png',
#         'sizes': '192x192'
#     },
#     {
#         'src': '/static/images/android-chrome-512x512.png',
#         'sizes': '512x512'
#     }
# ]

# # Path to your custom service worker (create this later)
# PWA_SERVICE_WORKER_PATH = os.path.join(BASE_DIR, 'registration', 'static', 'registration', 'js', 'serviceworker.js')
# # STATIC_URL = 'static/'
# # import os
# # import sys
# # sys.path.append(os.path.join(BASE_DIR, 'registration'))

# # Default primary key field type
# # https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# GDAL_LIBRARY_PATH = r"C:\Users\bhati\work\labour_crm\venv\Lib\site-packages\osgeo\gdal.dll"
# GEOS_LIBRARY_PATH = r"C:\Users\bhati\work\labour_crm\venv\Lib\site-packages\osgeo\geos_c.dll"
# GDAL_LIBRARY_PATH = r"C:\Users\bhati\work\labour_crm\venv\Lib\site-packages\osgeo\gdal.dll"
