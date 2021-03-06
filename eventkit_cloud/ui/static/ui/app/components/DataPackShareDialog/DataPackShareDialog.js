import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ShareBaseDialog from './ShareBaseDialog';
import GroupsBody from './GroupsBody';
import MembersBody from './MembersBody';
import ShareInfoBody from './ShareInfoBody';
import BaseDialog from '../Dialog/BaseDialog';

export class DataPackShareDialog extends Component {
    constructor(props) {
        super(props);
        this.handleSave = this.handleSave.bind(this);
        this.handleGroupUpdate = this.handleGroupUpdate.bind(this);
        this.handleMemberUpdate = this.handleMemberUpdate.bind(this);
        this.showShareInfo = this.showShareInfo.bind(this);
        this.hideShareInfo = this.hideShareInfo.bind(this);
        this.showPublicWarning = this.showPublicWarning.bind(this);
        this.hidePublicWarning = this.hidePublicWarning.bind(this);
        this.toggleView = this.toggleView.bind(this);
        this.state = {
            view: 'groups',
            // Make a copy of the permissions so we can modify it locally
            permissions: this.getAdjustedPermissions(this.props.permissions),
            showShareInfo: false,
            showPublicWarning: false,
        };
    }

    getAdjustedPermissions(perms) {
        const permissions = {
            value: perms.value,
            groups: { ...perms.groups },
            members: { ...perms.members },
        };
        // Check if the logged in user has member rights
        // If they do, move them out of members for now, so it wont be displayed.
        // We will add them back in before saving any updates
        if (this.props.user) {
            const { members } = permissions;
            const { username } = this.props.user.user;
            if (members[username] !== undefined) {
                permissions.user = members[username];
                members[username] = null;
                delete members[username];
            }
        }

        // Check if the permissions are PUBLIC
        // If yes, we need to add members in if not already there
        if (permissions.value === 'PUBLIC') {
            this.props.members.forEach((member) => {
                if (permissions.members[member.user.username] === undefined) {
                    permissions.members[member.user.username] = 'READ';
                }
            });
        }
        return permissions;
    }

    handleSave() {
        const permissions = { ...this.state.permissions };
        if (Object.keys(permissions.members).length || Object.keys(permissions.groups).length) {
            permissions.value = 'SHARED';
            if (Object.keys(permissions.members).length === this.props.members.length) {
                permissions.value = 'PUBLIC';
            }
        } else {
            permissions.value = 'PRIVATE';
            permissions.members = {};
            permissions.groups = {};
        }
        // Check if logged in user had been moved out of members
        // If so, add them back in before saving
        if (permissions.user !== undefined) {
            permissions.members[this.props.user.user.username] = permissions.user;
            permissions.user = null;
            delete permissions.user;
        }
        this.props.onSave(permissions);
    }

    handleGroupUpdate(groups) {
        const permissions = { ...this.state.permissions };
        permissions.groups = groups;
        this.setState({ permissions });
    }

    handleMemberUpdate(members) {
        const permissions = { ...this.state.permissions };
        const stateLength = Object.keys(permissions.members).length;
        if (this.props.warnPublic) {
            const { length } = Object.keys(members);
            if (length === this.props.members.length && length !== stateLength) {
                this.showPublicWarning();
            }
        }
        permissions.members = members;
        this.setState({ permissions });
    }

    showShareInfo() {
        this.setState({ showShareInfo: true });
    }

    hideShareInfo() {
        this.setState({ showShareInfo: false });
    }

    showPublicWarning() {
        this.setState({ showPublicWarning: true });
    }

    hidePublicWarning() {
        this.setState({ showPublicWarning: false });
    }

    toggleView() {
        if (this.state.view === 'groups') {
            this.setState({ view: 'members' });
        } else {
            this.setState({ view: 'groups' });
        }
    }

    render() {
        const { colors } = this.props.theme.eventkit;

        const styles = {
            fixedHeader: {
                position: 'sticky',
                top: 0,
                left: 0,
                backgroundColor: colors.white,
                zIndex: 15,
                padding: '0px 10px',
            },
            groupsButton: {
                flex: '1 1 auto',
                borderRadius: '0px',
                backgroundColor: this.state.view === 'groups' ? colors.primary : colors.secondary,
                boxShadow: 'none',
                color: this.state.view === 'groups' ? colors.white : colors.primary,
            },
            membersButton: {
                flex: '1 1 auto',
                borderRadius: '0px',
                backgroundColor: this.state.view === 'members' ? colors.primary : colors.secondary,
                boxShadow: 'none',
                color: this.state.view === 'members' ? colors.white : colors.primary,
            },
        };

        if (this.state.showShareInfo) {
            return (
                <ShareBaseDialog
                    show={this.props.show}
                    onClose={this.props.onClose}
                    handleSave={this.handleSave}
                    title={this.props.title}
                    submitButtonLabel={this.props.submitButtonLabel}
                    className="qa-DataPackShareDialog"
                >
                    <ShareInfoBody
                        view={this.state.view}
                        onReturn={this.hideShareInfo}
                    />
                </ShareBaseDialog>
            );
        }

        let body = null;
        if (this.state.view === 'groups') {
            body = (
                <GroupsBody
                    groups={this.props.groups}
                    members={this.props.members}
                    selectedGroups={this.state.permissions.groups}
                    groupsText={this.props.groupsText}
                    onGroupsUpdate={this.handleGroupUpdate}
                    canUpdateAdmin={this.props.canUpdateAdmin}
                    handleShowShareInfo={this.showShareInfo}
                />
            );
        } else {
            body = (
                <MembersBody
                    members={this.props.members}
                    selectedMembers={this.state.permissions.members}
                    membersText={this.props.membersText}
                    onMembersUpdate={this.handleMemberUpdate}
                    canUpdateAdmin={this.props.canUpdateAdmin}
                    handleShowShareInfo={this.showShareInfo}
                />
            );
        }

        let groupCount = Object.keys(this.state.permissions.groups).length;
        if (groupCount === this.props.groups.length) {
            groupCount = 'ALL';
        }

        let memberCount = Object.keys(this.state.permissions.members).length;
        if (memberCount === this.props.members.length) {
            memberCount = 'ALL';
        }

        return (
            <ShareBaseDialog
                show={this.props.show}
                onClose={this.props.onClose}
                handleSave={this.handleSave}
                title={this.props.title}
                submitButtonLabel={this.props.submitButtonLabel}
                className="qa-DataPackShareDialog"
            >
                <div style={styles.fixedHeader} className="qa-DataPackShareDialog-container">
                    <div
                        className="qa-DataPackShareDialog-headers"
                        style={{ display: 'flex', flexWrap: 'wrap' }}
                    >
                        <Button
                            className="qa-DataPackShareDialog-Button-groups"
                            variant="contained"
                            style={styles.groupsButton}

                            onClick={this.toggleView}
                        >
                            {`GROUPS (${groupCount})`}
                        </Button>
                        <Button
                            className="qa-DataPackShareDialog-Button-members"
                            style={styles.membersButton}
                            onClick={this.toggleView}
                        >
                            {`MEMBERS (${memberCount})`}
                        </Button>
                        <div
                            className="qa-DataPackShareDialog-buttonUnderline"
                            style={{
                                height: '2px',
                                width: '100%',
                                backgroundColor: colors.primary,
                                flex: '0 0 auto',
                            }}
                        />
                    </div>
                </div>
                {body}
                {this.state.showPublicWarning ?
                    <BaseDialog
                        show
                        onClose={this.hidePublicWarning}
                        title="SHARE WITH ALL MEMBERS"
                        overlayStyle={{ zIndex: 1501 }}
                        actions={[
                            <Button
                                style={{ margin: '0px' }}
                                variant="contained"
                                color="primary"
                                onClick={this.handleSave}
                            >
                                SHARE
                            </Button>,
                            <Button
                                style={{ margin: '0px', float: 'left' }}
                                variant="text"
                                color="primary"
                                label="CONTINUE EDITING"
                                onClick={this.hidePublicWarning}
                            >
                                CONTINUE EDITING
                            </Button>,
                        ]}
                    >
                        Sharing with all members will make this DataPack visible to everyone with an EventKit account.
                        Are you sure you want to share it with everyone?
                    </BaseDialog>
                    :
                    null
                }
            </ShareBaseDialog>
        );
    }
}

DataPackShareDialog.defaultProps = {
    submitButtonLabel: 'SAVE',
    title: 'SHARE',
    groupsText: '',
    membersText: '',
    canUpdateAdmin: false,
    user: null,
    warnPublic: false,
};

DataPackShareDialog.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    user: PropTypes.shape({
        user: PropTypes.object,
        groups: PropTypes.arrayOf(PropTypes.number),
    }),
    groups: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        members: PropTypes.arrayOf(PropTypes.string),
        administrators: PropTypes.arrayOf(PropTypes.string),
    })).isRequired,
    members: PropTypes.arrayOf(PropTypes.shape({
        user: PropTypes.shape({
            username: PropTypes.string,
            first_name: PropTypes.string,
            last_name: PropTypes.string,
            email: PropTypes.string,
            date_joined: PropTypes.string,
            last_login: PropTypes.string,
        }),
        accepted_licenses: PropTypes.object,
        groups: PropTypes.arrayOf(PropTypes.number),
    })).isRequired,
    permissions: PropTypes.shape({
        groups: PropTypes.objectOf(PropTypes.string),
        members: PropTypes.objectOf(PropTypes.string),
    }).isRequired,
    groupsText: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.string,
    ]),
    membersText: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.string,
    ]),
    canUpdateAdmin: PropTypes.bool,
    submitButtonLabel: PropTypes.string,
    title: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
    ]),
    warnPublic: PropTypes.bool,
    theme: PropTypes.object.isRequired,
};

export default withTheme()(DataPackShareDialog);
