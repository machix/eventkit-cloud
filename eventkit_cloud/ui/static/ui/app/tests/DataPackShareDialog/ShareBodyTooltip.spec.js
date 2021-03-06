import React from 'react';
import { shallow } from 'enzyme';
import { ShareBodyTooltip } from '../../components/DataPackShareDialog/ShareBodyTooltip';


describe('MembersHeaderRow component', () => {
    const getProps = () => (
        {
            text: 'test text',
            target: { getBoundingClientRect: () => ({ left: 0, top: 0, height: 0 }) },
            body: { getBoundingClientRect: () => ({ left: 0, top: 0, height: 0 }) },
            ...global.eventkit_test_props,
        }
    );

    const getWrapper = props => (
        shallow(<ShareBodyTooltip {...props} />)
    );

    it('should render the basic components', () => {
        const props = getProps();
        const wrapper = getWrapper(props);
        expect(wrapper.find('.qa-ShareBodyTooltip-arrow')).toHaveLength(1);
        expect(wrapper.find('.qa-ShareBodyTooltip-text')).toHaveLength(1);
        expect(wrapper.find('.qa-ShareBodyTooltip-text').text()).toEqual(props.text);
    });
});
