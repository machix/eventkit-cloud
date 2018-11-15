
export const types = {
    FETCHING_GROUPS: 'FETCHING_GROUPS',
    FETCHED_GROUPS: 'FETCHED_GROUPS',
    FETCH_GROUPS_ERROR: 'FETCH_GROUPS_ERROR',
    DELETING_GROUP: 'DELETING_GROUP',
    DELETED_GROUP: 'DELETED_GROUP',
    DELETE_GROUP_ERROR: 'DELETE_GROUP_ERROR',
    CREATING_GROUP: 'CREATING_GROUP',
    CREATED_GROUP: 'CREATED_GROUP',
    CREATE_GROUP_ERROR: 'CREATE_GROUP_ERROR',
    UPDATING_GROUP: 'UPDATING_GROUP',
    UPDATED_GROUP: 'UPDATED_GROUP',
    UPDATING_GROUP_ERROR: 'UPDATING_GROUP_ERROR',
};

export function getGroups() {
    return {
        types: [
            types.FETCHING_GROUPS,
            types.FETCHED_GROUPS,
            types.FETCH_GROUPS_ERROR,
        ],
        shouldCallApi: state => Boolean(state.user.data),
        url: '/api/groups',
        method: 'GET',
        getCancelSource: state => state.groups.cancelSource,
        cancellable: true,
        onSuccess: response => ({ groups: response.data }),
        onError: error => ({ error: error.response.data }),
    };
}

export function deleteGroup(groupId) {
    return {
        types: [
            types.DELETING_GROUP,
            types.DELETED_GROUP,
            types.DELETE_GROUP_ERROR,
        ],
        shouldCallApi: state => Boolean(state.user.data),
        url: `/api/groups/${groupId}`,
        method: 'DELETE',
        onError: error => ({ error: error.response.data }),
    };
}

export function createGroup(groupName, members) {
    return {
        types: [
            types.CREATING_GROUP,
            types.CREATED_GROUP,
            types.CREATE_GROUP_ERROR,
        ],
        shouldCallApi: state => Boolean(state.user.data),
        url: '/api/groups',
        method: 'POST',
        data: { name: groupName, members },
        onError: error => ({ error: error.response.data }),
    };
}

export function updateGroup(groupId, options = {}) {
    const data = {};

    if (options.name) data.name = options.name;
    if (options.members) data.members = options.members;
    if (options.administrators) data.administrators = options.administrators;

    return {
        types: [
            types.UPDATING_GROUP,
            types.UPDATED_GROUP,
            types.UPDATING_GROUP_ERROR,
        ],
        shouldCallApi: state => Boolean(state.user.data),
        url: `/api/groups/${groupId}`,
        method: 'PATCH',
        data,
        onError: error => ({ error: error.response.data }),
    };
}
