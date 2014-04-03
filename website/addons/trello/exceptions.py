from requests.exceptions import HTTPError as reqError
import sys

class TrelloError(Exception):
    pass


# From http://stackoverflow.com/a/9006442
def trello_except(fn):
    def wrapped(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except reqError, e:
            et, ei, tb = sys.exc_info()
            raise TrelloError, TrelloError(e), tb
    return wrapped
