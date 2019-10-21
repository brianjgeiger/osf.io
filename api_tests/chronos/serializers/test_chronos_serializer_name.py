import pytest


class TestChronosSerializerName:

    @pytest.fixture()
    def one_with_everything(self):
        return {
            'given_name': 'Foo',
            'middle_names': 'Bar Baz',
            'family_name': ''
        }