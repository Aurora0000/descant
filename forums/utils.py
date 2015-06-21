import bleach
from markdown2 import markdown
from notifications import notify

from descant import settings

def notify_send_bleached(actor, recipient=None, verb=None, message=None):
    if message is not None:
        message = bleach.clean(markdown(message).replace('\n', ''), settings.ALLOWED_TAGS,
                           settings.ALLOWED_ATTRIBUTES)
        notify.send(actor, recipient=recipient,
                verb=verb, message=message)
    else:
        notify.send(actor, recipient=recipient,
                verb=verb)

