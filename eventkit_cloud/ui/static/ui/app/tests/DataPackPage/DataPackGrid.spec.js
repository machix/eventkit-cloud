import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import GridList from '@material-ui/core/GridList';
import { DataPackGrid } from '../../components//DataPackPage/DataPackGrid';
import DataPackGridItem from '../../components/DataPackPage/DataPackGridItem';

const providers = [
    {
        id: 2,
        model_url: 'http://cloud.eventkit.test/api/providers/osm',
        type: 'osm',
        license: null,
        created_at: '2017-08-15T19:25:10.844911Z',
        updated_at: '2017-08-15T19:25:10.844919Z',
        uid: 'bc9a834a-727a-4779-8679-2500880a8526',
        name: 'OpenStreetMap Data (Themes)',
        slug: 'osm',
        preview_url: '',
        service_copyright: '',
        service_description: `OpenStreetMap vector data provided in a custom thematic schema. \n\n
            Data is grouped into separate tables (e.g. water, roads...).`,
        layer: null,
        level_from: 0,
        level_to: 10,
        zip: false,
        display: true,
        export_provider_type: 2,
    },
];

function getRuns() {
    return [
        {
            uid: '6870234f-d876-467c-a332-65fdf0399a0d',
            url: 'http://cloud.eventkit.test/api/runs/6870234f-d876-467c-a332-65fdf0399a0d',
            started_at: '2017-03-10T15:52:35.637331Z',
            finished_at: '2017-03-10T15:52:39.837Z',
            user: 'admin',
            status: 'COMPLETED',
            job: {
                uid: '7643f806-1484-4446-b498-7ddaa65d011a',
                name: 'Test1',
                event: 'Test1 event',
                description: 'Test1 description',
                url: 'http://cloud.eventkit.test/api/jobs/7643f806-1484-4446-b498-7ddaa65d011a',
                extent: {},
                permissions: {
                    value: 'PRIVATE',
                    groups: {},
                    members: {},
                },
            },
            provider_tasks: [],
        },
        {
            uid: 'c7466114-8c0c-4160-8383-351414b11e37',
            url: 'http://cloud.eventkit.test/api/runs/c7466114-8c0c-4160-8383-351414b11e37',
            started_at: '2017-03-10T15:52:29.311523Z',
            finished_at: '2017-03-10T15:52:33.612Z',
            user: 'notAdmin',
            status: 'COMPLETED',
            job: {
                uid: '5488a864-89f2-4e9c-8370-18291ecdae4a',
                name: 'Test2',
                event: 'Test2 event',
                description: 'Test2 description',
                url: 'http://cloud.eventkit.test/api/jobs/5488a864-89f2-4e9c-8370-18291ecdae4a',
                extent: {},
                permissions: {
                    value: 'PRIVATE',
                    groups: {},
                    members: {},
                },
            },
            provider_tasks: [],
        },
        {
            uid: '282816a6-7d16-4f59-a1a9-18764c6339d6',
            url: 'http://cloud.eventkit.test/api/runs/282816a6-7d16-4f59-a1a9-18764c6339d6',
            started_at: '2017-03-10T15:52:18.796929Z',
            finished_at: '2017-03-10T15:52:27.500Z',
            user: 'admin',
            status: 'COMPLETED',
            job: {
                uid: '78bbd59a-4066-4e30-8460-c7b0093a0d7a',
                name: 'Test3',
                event: 'Test3 event',
                description: 'Test3 description',
                url: 'http://cloud.eventkit.test/api/jobs/78bbd59a-4066-4e30-8460-c7b0093a0d7a',
                extent: {},
                permissions: {
                    value: 'PRIVATE',
                    groups: {},
                    members: {},
                },
            },
            provider_tasks: [],
        },
    ];
}

describe('DataPackGrid component', () => {
    const runs = getRuns();
    const props = {
        runIds: runs.map(run => run.uid),
        runs,
        providers,
        user: { data: { user: { username: 'admin' } } },
        users: [],
        groups: [],
        onRunDelete: () => {},
        onRunShare: () => {},
        ...global.eventkit_test_props,
    };

    it('should render a DataPackGridItem for each run passed in', () => {
        const getColumnSpy = sinon.spy(DataPackGrid.prototype, 'getColumns');
        const wrapper = shallow(<DataPackGrid {...props} />);
        expect(wrapper.find(GridList)).toHaveLength(1);
        expect(wrapper.find(DataPackGridItem)).toHaveLength(3);
        expect(getColumnSpy.calledOnce).toBe(true);
        getColumnSpy.restore();
    });

    it('getColumns should return 2, 3, or 4 depending on screensize', () => {
        props.width = 'sm';
        const wrapper = shallow(<DataPackGrid {...props} />);
        let cols = wrapper.instance().getColumns();
        expect(cols).toEqual(2);

        wrapper.setProps({ width: 'lg' });
        cols = wrapper.instance().getColumns();
        expect(cols).toEqual(3);

        wrapper.setProps({ width: 'xl' });
        cols = wrapper.instance().getColumns();
        expect(cols).toEqual(4);
    });
});
