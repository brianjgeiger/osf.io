# -*- coding: utf-8 -*-
"""Fake data generator.

To use:

1. Install fake-factory. ::

    pip install fake-factory

2. Create your OSF user account

3. Run the script, passing in your username (email).
::

    python -m scripts.create_fakes --user fred@cos.io

This will create 3 fake public projects, each with 3 fake contributors (with
    you as the creator).
"""
import sys
import argparse
import logging

from faker import Factory

from framework.auth import Auth
from website.app import init_app
from website import models, security
from framework.auth import utils
from tests.factories import UserFactory, ProjectFactory

logging.basicConfig(level=logging.ERROR)
fake = Factory.create()
app = init_app('website.settings', set_backends=True, routes=True)


def create_fake_user():
    email = fake.email()
    name = fake.name()
    parsed = utils.impute_names(name)
    user = UserFactory.build(username=email, fullname=name,
        is_registered=True, is_claimed=True,
        verification_key=security.random_string(15),
        date_registered=fake.date_time(),
        emails=[email],
        **parsed
    )
    user.set_password('faker123')
    user.save()
    print('Created user: {0} <{1}>'.format(user.fullname, user.username))
    return user

def parse_args():
    parser = argparse.ArgumentParser(description='Create fake data.')
    parser.add_argument('-u', '--user', dest='user', required=True)
    parser.add_argument('--nusers', dest='n_users', type=int, default=3)
    parser.add_argument('--nprojects', dest='n_projects', type=int, default=3)
    parser.add_argument('-p', '--privacy', dest="privacy", type=str, default='private', choices=['public','private'])
    parser.add_argument('-n', '--name', dest='name', type=str, default=None)
    return parser.parse_args()


def create_fake_project(creator, n_users, privacy, name):
    auth = Auth(user=creator)
    project_title = name if name else fake.catch_phrase()
    project = ProjectFactory.build(title=project_title,
        description=fake.bs(), creator=creator)
    project.set_privacy(privacy)
    for _ in range(n_users):
        contrib = create_fake_user()
        project.add_contributor(contrib, auth=auth)
    project.save()
    print('Created project: {0}'.format(project.title))
    return project


def main():
    args = parse_args()
    creator = models.User.find_by_email(args.user)[0]
    for i in range(args.n_projects):
        name = args.name + str(i) if args.name else ''
        create_fake_project(creator, args.n_users, args.privacy, name)
    print('Created {n} fake projects.'.format(n=args.n_projects))
    sys.exit(0)

if __name__ == '__main__':
    main()
