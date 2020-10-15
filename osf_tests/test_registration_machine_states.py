import pytest
import datetime
from website import settings

from osf.utils.workflows import RegistrationStates

from osf_tests.factories import (
    RegistrationFactory,
    CommentFactory
)

from osf.models import Retraction, Sanction


from django.utils import timezone


@pytest.mark.django_db
class TestRegistrationMachine:

    @pytest.fixture()
    def draft_registration(self):
        return RegistrationFactory().draft_registration.last()

    @pytest.fixture()
    def comment(self):
        return CommentFactory(content='Yo')

    def test_run_submit(self, draft_registration):
        assert draft_registration.machine_state == RegistrationStates.INITIAL.value
        draft_registration.run_submit(draft_registration.creator)

        assert not draft_registration.branched_from.is_public
        assert draft_registration.approval.meta == {
            'embargo_end_date': None,
            'registration_choice': 'immediate'
        }
        assert draft_registration.logs.first().action == 'submitted'
        assert draft_registration.machine_state == RegistrationStates.PENDING.value

    def test_run_accept(self, draft_registration):
        draft_registration.run_submit(draft_registration.creator)

        assert draft_registration.machine_state == RegistrationStates.PENDING.value

        draft_registration.run_accept(draft_registration.creator, comment='Wanna Philly Philly?')
        draft_registration.refresh_from_db()

        assert draft_registration.machine_state == RegistrationStates.ACCEPTED.value
        assert draft_registration.registered_node
        assert not draft_registration.registered_node.is_public

    def test_run_accept_with_embargo(self, draft_registration):
        draft_registration.run_submit(draft_registration.creator)
        end_date = timezone.now() + settings.EMBARGO_END_DATE_MIN + datetime.timedelta(days=1)
        draft_registration.run_accept(draft_registration.creator, 'yo', embargo_end_date=end_date)

        assert draft_registration.machine_state == RegistrationStates.EMBARGO.value
        assert draft_registration.registered_node
        assert draft_registration.registered_node.embargo

    def test_run_reject(self, draft_registration):
        draft_registration.run_submit(draft_registration.creator)
        draft_registration.save()

        assert draft_registration.machine_state == RegistrationStates.PENDING.value

        draft_registration.run_reject(draft_registration.creator, comment='Double Doink')

        assert draft_registration.machine_state == RegistrationStates.REJECTED.value

    def test_run_request_withdraw(self, draft_registration):
        draft_registration.run_submit(draft_registration.creator)
        draft_registration.run_accept(draft_registration.creator, comment='Wanna Philly Philly?')
        draft_registration.refresh_from_db()

        draft_registration.registered_node.is_public = True

        assert draft_registration.machine_state == RegistrationStates.ACCEPTED.value

        draft_registration.run_request_withdraw(draft_registration.creator, 'Double Doink')

        assert draft_registration.machine_state == RegistrationStates.PENDING_WITHDRAW_REQUEST.value
        assert draft_registration.registered_node.retraction.state == Retraction.UNAPPROVED

    def test_run_request_withdraw_fails(self, draft_registration):
        draft_registration.run_submit(draft_registration.creator)
        draft_registration.run_accept(draft_registration.creator, comment='Wanna Philly Philly?')
        draft_registration.registered_node.is_public = True
        draft_registration.run_request_withdraw(draft_registration.creator, 'Double Doink')

        draft_registration.run_request_withdraw_fails(draft_registration.creator, 'Double Doink')

        assert draft_registration.machine_state == RegistrationStates.ACCEPTED.value
        assert draft_registration.registered_node.retraction.state == Retraction.REJECTED

    def test_run_request_withdraw_passes(self, draft_registration):
        draft_registration.run_submit(draft_registration.creator)
        draft_registration.run_accept(draft_registration.creator, comment='Wanna Philly Philly?')
        draft_registration.registered_node.is_public = True
        draft_registration.run_request_withdraw(draft_registration.creator, 'Double Doink')

        draft_registration.run_request_withdraw_passes(draft_registration.creator, 'Double Doink')

        assert draft_registration.machine_state == RegistrationStates.PENDING_WITHDRAW.value
        assert draft_registration.registered_node.retraction.state == Retraction.UNAPPROVED

    def test_run_withdraw_registration(self, draft_registration):
        draft_registration.run_submit(draft_registration.creator)
        draft_registration.run_accept(draft_registration.creator, comment='Wanna Philly Philly?')
        draft_registration.registered_node.is_public = True
        draft_registration.run_request_withdraw(draft_registration.creator, 'Double Doink')
        draft_registration.run_request_withdraw_passes(draft_registration.creator, 'Double Doink')

        assert draft_registration.machine_state == RegistrationStates.PENDING_WITHDRAW.value

        draft_registration.run_withdraw_registration(draft_registration.creator, 'Double Doink')
        draft_registration.refresh_from_db()

        assert draft_registration.machine_state == RegistrationStates.WITHDRAWN.value

    def test_run_force_withdraw(self, draft_registration):
        draft_registration.run_submit(draft_registration.creator)
        draft_registration.run_accept(draft_registration.creator, comment='Wanna Philly Philly?')
        draft_registration.registered_node.is_public = True
        draft_registration.run_request_withdraw(draft_registration.creator, 'Double Doink')
        draft_registration.run_request_withdraw_passes(draft_registration.creator, 'Double Doink')

        draft_registration.run_force_withdraw(draft_registration.creator, 'Double Doink')

        assert draft_registration.machine_state == RegistrationStates.WITHDRAWN.value

    def test_run_reject_withdraw(self, draft_registration):
        draft_registration.run_submit(draft_registration.creator)
        draft_registration.run_accept(draft_registration.creator, comment='Wanna Philly Philly?')
        draft_registration.registered_node.is_public = True
        draft_registration.run_request_withdraw(draft_registration.creator, 'Double Doink')
        draft_registration.run_request_withdraw_passes(draft_registration.creator, 'Double Doink')

        assert draft_registration.machine_state == RegistrationStates.PENDING_WITHDRAW.value

        draft_registration.run_reject_withdraw(draft_registration.creator, 'Double Doink')
        draft_registration.refresh_from_db()

        assert draft_registration.machine_state == RegistrationStates.ACCEPTED.value

    def test_run_request_embargo_termination(self, draft_registration):
        draft_registration.run_submit(draft_registration.creator)
        end_date = timezone.now() + settings.EMBARGO_END_DATE_MIN + datetime.timedelta(days=1)
        draft_registration.run_accept(draft_registration.creator, 'yo', embargo_end_date=end_date)
        draft_registration.refresh_from_db()

        draft_registration.registered_node.embargo.state = Sanction.APPROVED
        draft_registration.registered_node.embargo.save()

        assert draft_registration.machine_state == RegistrationStates.EMBARGO.value

        draft_registration.run_request_embargo_termination(draft_registration.creator, 'Yo')

        assert draft_registration.machine_state == RegistrationStates.PENDING_EMBARGO_TERMINATION.value

    def test_run_terminate_embargo(self, draft_registration):
        draft_registration.run_submit(draft_registration.creator)
        end_date = timezone.now() + settings.EMBARGO_END_DATE_MIN + datetime.timedelta(days=1)
        draft_registration.run_accept(draft_registration.creator, 'yo', embargo_end_date=end_date)
        draft_registration.refresh_from_db()

        draft_registration.registered_node.embargo.state = Sanction.APPROVED
        draft_registration.registered_node.embargo.save()

        draft_registration.run_request_embargo_termination(draft_registration.creator, 'Yo')

        approval_state = draft_registration.registered_node.embargo.approval_state
        approval_token = approval_state[draft_registration.registered_node.creator._id]['approval_token']

        # This is does not change the state.
        draft_registration.registered_node.embargo.approve(
            draft_registration.registered_node.creator,
            approval_token
        )

        assert draft_registration.machine_state == RegistrationStates.PENDING_EMBARGO_TERMINATION.value

        draft_registration.run_terminate_embargo(draft_registration.creator, 'Yo')
        assert draft_registration.machine_state == RegistrationStates.ACCEPTED.value
