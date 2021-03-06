import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import CheckBoxOutline from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBox from '@material-ui/icons/CheckBox';
import ArrowDown from '@material-ui/icons/KeyboardArrowDown';
import ArrowUp from '@material-ui/icons/KeyboardArrowUp';
import Eye from '@material-ui/icons/RemoveRedEye';
import AdminShare from '../icons/AdminShareIcon';
import GroupMemberRow from './GroupMemberRow';

export class GroupRow extends Component {
    constructor(props) {
        super(props);
        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.handleCheck = this.props.handleCheck.bind(this, this.props.group);
        this.handleAdminCheck = this.handleAdminCheck.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onAdminMouseOut = this.onAdminMouseOut.bind(this);
        this.onAdminMouseOver = this.onAdminMouseOver.bind(this);
        this.state = {
            expanded: false,
        };
    }

    onAdminMouseOver() {
        if (this.props.selected) {
            this.props.handleAdminMouseOver(this.tooltip, this.props.admin);
        }
    }

    onAdminMouseOut() {
        this.props.handleAdminMouseOut();
    }

    onKeyDown(e) {
        const key = e.which || e.keyCode;
        if (key === 13) this.handleAdminCheck();
    }

    getGroupMembers(group, members) {
        const groupMembers = [];
        group.members.forEach((groupMember) => {
            const member = members.find(propmember => propmember.user.username === groupMember);
            if (member) groupMembers.push(member);
        });
        groupMembers.sort((a, b) => {
            const aAdmin = group.administrators.includes(a.user.username);
            const bAdmin = group.administrators.includes(b.user.username);
            if (!aAdmin && bAdmin) return 1;
            if (aAdmin && !bAdmin) return -1;
            return 0;
        });
        return groupMembers;
    }

    handleAdminCheck() {
        if (this.props.showAdmin && this.props.selected) {
            this.props.handleAdminCheck(this.props.group);
        }
    }

    toggleExpanded() {
        this.setState({ expanded: !this.state.expanded });
    }

    render() {
        const { colors } = this.props.theme.eventkit;
        const styles = {
            card: {
                backgroundColor: colors.secondary,
                margin: '0px 10px 10px',
                boxShadow: 'none',
            },
            groupText: {
                flex: '1 1 auto',
                color: colors.black,
                fontSize: '16px',
                fontWeight: 'bold',
                marginRight: '10px',
                lineHeight: '28px',
                wordBreak: 'break-word',
            },
            groupIcons: {
                display: 'flex',
                flex: '1 1 auto',
                alignItems: 'center',
                flexDirection: 'row-reverse',
            },
            expandIcon: {
                marginLeft: '15px',
                cursor: 'pointer',
            },
            checkIcon: {
                width: '28px',
                height: '28px',
                cursor: 'pointer',
            },
            adminCheckIcon: {
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                marginRight: '15px',
            },
            cardText: {
                backgroundColor: colors.white,
                color: colors.text_primary,
                padding: '10px 16px 0px',
            },
        };

        // Assume group is not selected by default
        let groupIcon = <CheckBoxOutline style={styles.checkIcon} onClick={this.handleCheck} color="primary" />;

        // Check if group is selected
        if (this.props.selected) {
            groupIcon = <CheckBox style={styles.checkIcon} onClick={this.handleCheck} color="primary" />;
        }

        let adminButton = null;
        if (this.props.showAdmin) {
            styles.adminCheckIcon.color = colors.text_primary;
            if (!this.props.selected) {
                styles.adminCheckIcon.opacity = 0.15;
                styles.adminCheckIcon.cursor = 'default';
            } else if (!this.props.admin) {
                styles.adminCheckIcon.opacity = 0.55;
            } else {
                styles.adminCheckIcon.color = colors.primary;
            }

            adminButton = (
                <div ref={(input) => { this.tooltip = input; }} style={{ display: 'flex', alignItems: 'center' }}>
                    <AdminShare
                        className="qa-GroupRow-AdminShare"
                        onClick={this.handleAdminCheck}
                        onMouseOver={this.onAdminMouseOver}
                        onMouseOut={this.onAdminMouseOut}
                        onFocus={this.onAdminMouseOver}
                        onBlur={this.onAdminMouseOut}
                        style={styles.adminCheckIcon}
                    />
                </div>
            );
        }

        const groupMembers = this.getGroupMembers(this.props.group, this.props.members);
        const firstFour = groupMembers.splice(0, 4);

        return (
            <Card
                key={this.props.group.name}
                style={styles.card}
                className="qa-GroupRow-Card"
            >
                <CardHeader
                    className="qa-GroupRow-CardHeader"
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '15px' }}>
                            <div style={styles.groupText} className="qa-GroupRow-CardHeader-text">
                                {this.props.group.name}
                            </div>
                            <div style={styles.groupIcons} className="qa-GroupRow-CardHeader-icons">
                                {this.state.expanded ?
                                    <ArrowUp style={styles.expandIcon} onClick={this.toggleExpanded} color="primary" />
                                    :
                                    <ArrowDown style={styles.expandIcon} onClick={this.toggleExpanded} color="primary" />
                                }
                                {groupIcon}
                                {adminButton}
                            </div>
                        </div>
                    }
                    style={{ padding: '12px' }}
                />
                <Collapse in={this.state.expanded}>
                    <CardContent style={styles.cardText}>
                        {firstFour.map((member) => {
                            const isAdmin = this.props.group.administrators.includes(member.user.username);
                            return (
                                <GroupMemberRow
                                    key={member.user.username}
                                    member={member}
                                    isGroupAdmin={isAdmin}
                                />
                            );
                        })}
                        {groupMembers.length ?
                            <div style={{ lineHeight: '20px', paddingTop: '10px', fontSize: '14px' }} className="qa-GroupRow-viewMore">
                                <Eye style={{ height: '20px', verticalAlign: 'text-top' }} color="primary" />
                                <a href={`/groups?groups=${this.props.group.id}`}>View all on Members and Groups Page</a>
                            </div>
                            :
                            null
                        }
                    </CardContent>
                </Collapse>
            </Card>
        );
    }
}

GroupRow.defaultProps = {
    admin: false,
    showAdmin: false,
    handleAdminCheck: () => {},
    handleAdminMouseOver: () => {},
    handleAdminMouseOut: () => {},
};

GroupRow.propTypes = {
    group: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        members: PropTypes.arrayOf(PropTypes.string),
        administrators: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
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
    selected: PropTypes.bool.isRequired,
    handleCheck: PropTypes.func.isRequired,
    handleAdminCheck: PropTypes.func,
    handleAdminMouseOut: PropTypes.func,
    handleAdminMouseOver: PropTypes.func,
    showAdmin: PropTypes.bool,
    admin: PropTypes.bool,
    theme: PropTypes.object.isRequired,
};

export default withTheme()(GroupRow);
