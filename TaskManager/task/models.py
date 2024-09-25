
from db_connection import db
# Create your models here.
task_collection=db['task']
user_collection = db['users']

# models.py or a separate file for user model
class MongoUser:
    def __init__(self, user_dict):
        self._dict = user_dict

    @property
    def id(self):
        return str(self._dict['_id'])  # This should be the unique identifier

    @property
    def username(self):
        return self._dict['username']

    @property
    def email(self):
        return self._dict['email']
