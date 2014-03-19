import logging
from .defaults import *

try:
    from .local import *
except ImportError as error:
    logging.warn('Trello: No local.py settings file found')
