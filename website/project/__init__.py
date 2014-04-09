# -*- coding: utf-8 -*-
import datetime as dt
import uuid
from .model import Node, NodeLog, Pointer, PrivateLink
from framework.forms.utils import sanitize
from framework.mongo.utils import from_mongo

def show_diff(seqm):
    """Unify operations between two compared strings
seqm is a difflib.SequenceMatcher instance whose a & b are strings"""
    output= []
    insert_el = '<span style="background:#4AA02C; font-size:1.5em; ">'
    ins_el_close = '</span>'
    del_el = '<span style="background:#D16587; font-size:1.5em;">'
    del_el_close = '</span>'
    for opcode, a0, a1, b0, b1 in seqm.get_opcodes():
        if opcode == 'equal':
            output.append(seqm.a[a0:a1])
        elif opcode == 'insert':
            output.append(insert_el + seqm.b[b0:b1] + ins_el_close)
        elif opcode == 'delete':
            output.append(del_el + seqm.a[a0:a1] + del_el_close)
        elif opcode == 'replace':
            output.append(del_el + seqm.a[a0:a1] + del_el_close + insert_el + seqm.b[b0:b1] + ins_el_close)
        else:
            raise RuntimeError("unexpected opcode")
    return ''.join(output)

# TODO: This should be a class method of Node
def new_node(category, title, user, description=None, project=None):
    """Create a new project or component.

    :param str category: Node category
    :param str title: Node title
    :param User user: User object
    :param str description: Node description
    :param Node project: Optional parent object
    :return Node: Created node

    """
    category = category.strip().lower()
    title = sanitize(title.strip())
    if description:
        description = sanitize(description.strip())

    node = Node(
        title=title,
        category=category,
        creator=user,
        description=description,
        project=project,
    )

    node.save()

    return node


def new_private_link(label, user):
    """Create a new private link.

    :param str label: private link label
    :param User user: User object
    :return PrivateLink: Created private link

    """
    key = str(uuid.uuid4()).replace("-", "")
    if label:
        label = sanitize(label.strip())

    private_link = PrivateLink(
        key=key,
        label=label,
        creator=user,
    )

    private_link.save()

    return private_link



template_name_replacements = {
    ('.txt', ''),
    ('_', ' '),
}


def clean_template_name(template_name):
    template_name = from_mongo(template_name)
    for replacement in template_name_replacements:
        template_name = template_name.replace(*replacement)
    return template_name
