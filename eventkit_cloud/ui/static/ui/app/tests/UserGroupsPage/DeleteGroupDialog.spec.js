import React, { PropTypes } from 'react';
import { mount } from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { BaseDialog } from '../../components/BaseDialog';
import { DeleteGroupDialog } from '../../components/UserGroupsPage/DeleteGroupDialog';

describe('LeaveGroupDialog component', () => {
    injectTapEventPlugin();
    const muiTheme = getMuiTheme();

    const props = {
        show: true,
        onClose: () => {},
        onDelete: () => {},
        groupName: 'Test Group',
    };

    it('should render a BaseDialog with message', () => {
        const wrapper = mount(<DeleteGroupDialog {...props} />, {
            context: { muiTheme },
            childContextTypes: {
                muiTheme: PropTypes.object,
            },
        });
        expect(wrapper.find(BaseDialog)).toHaveLength(1);
        expect(wrapper.find(BaseDialog).props().children)
            .toEqual("Are you sure you'd like to delete 'Test Group'?");
    });
});
