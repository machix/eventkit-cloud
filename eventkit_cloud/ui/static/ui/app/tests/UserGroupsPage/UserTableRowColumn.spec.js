import React, { PropTypes } from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import IconButton from 'material-ui/IconButton';
import { TableRowColumn } from 'material-ui/Table';
import { GroupsDropDownMenu } from '../../components/UserGroupsPage/GroupsDropDownMenu';
import { UserTableRowColumn } from '../../components/UserGroupsPage/UserTableRowColumn';

describe('UserTableRowColumn component', () => {
    injectTapEventPlugin();
    const muiTheme = getMuiTheme();

    const getProps = () => (
        {
            user: {
                name: 'user1',
                username: 'user1',
                groups: ['group1'],
            },
            groups: [
                { name: 'group1', id: 'group1' },
                { name: 'group2', id: 'group2' },
            ],
            groupsLoading: false,
            handleGroupItemClick: () => {},
            handleNewGroupClick: () => {},
        }
    );

    const getWrapper = props => (
        mount(<UserTableRowColumn {...props} />, {
            context: { muiTheme },
            childContextTypes: {
                muiTheme: PropTypes.object,
            },
        })
    );

    it('should render the basic components', () => {
        const props = getProps();
        const wrapper = getWrapper(props);
        expect(wrapper.find(TableRowColumn)).toHaveLength(1);
        expect(wrapper.find(IconButton)).toHaveLength(1);
        expect(wrapper.find(GroupsDropDownMenu)).toHaveLength(1);
    });

    it('handleOpen should preventDefault, stopPropagation, and setState', () => {
        const fakeEvent = {
            preventDefault: sinon.spy(),
            stopPropagation: sinon.spy(),
            currentTarget: null,
        };
        const props = getProps();
        const stateSpy = sinon.spy(UserTableRowColumn.prototype, 'setState');
        const wrapper = getWrapper(props);
        wrapper.instance().handleOpen(fakeEvent);
        expect(fakeEvent.preventDefault.calledOnce).toBe(true);
        expect(fakeEvent.stopPropagation.calledOnce).toBe(true);
        expect(stateSpy.calledOnce).toBe(true);
        expect(stateSpy.calledWith({ open: true, popoverAnchor: null })).toBe(true);
        stateSpy.restore();
    });

    it('handleClose should setState', () => {
        const props = getProps();
        const stateSpy = sinon.spy(UserTableRowColumn.prototype, 'setState');
        const wrapper = getWrapper(props);
        wrapper.instance().handleClose();
        expect(stateSpy.calledOnce).toBe(true);
        expect(stateSpy.calledWith({ open: false })).toBe(true);
        stateSpy.restore();
    });

    it('handleNewGroupClick should call handle close and hande new group click', () => {
        const props = getProps();
        props.handleNewGroupClick = sinon.spy();
        const closeSpy = sinon.spy(UserTableRowColumn.prototype, 'handleClose');
        const wrapper = getWrapper(props);
        wrapper.instance().handleNewGroupClick();
        expect(closeSpy.calledOnce).toBe(true);
        expect(props.handleNewGroupClick.calledOnce).toBe(true);
        expect(props.handleNewGroupClick.calledWith(props.user.username)).toBe(true);
        closeSpy.restore();
    });

    it('handleGroupItemClick should call handle group item click', () => {
        const props = getProps();
        props.handleGroupItemClick = sinon.spy();
        const wrapper = getWrapper(props);
        const fakeGroup = { name: 'group1', id: 'group1' };
        wrapper.instance().handleGroupItemClick(fakeGroup);
        expect(props.handleGroupItemClick.calledOnce).toBe(true);
        expect(props.handleGroupItemClick.calledWith(fakeGroup, props.user.username)).toBe(true);
    });
});
