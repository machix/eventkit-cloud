import React, { Component, PropTypes } from 'react';
import { Card, CardHeader } from 'material-ui/Card';
import People from 'material-ui/svg-icons/social/people';
import PeopleOutline from 'material-ui/svg-icons/social/people-outline';
import CheckBoxOutline from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import CheckBox from 'material-ui/svg-icons/toggle/check-box';

export class MemberRow extends Component {
    constructor(props) {
        super(props);
        this.handleCheck = this.props.handleCheck.bind(this, this.props.member);
        this.handleAdminCheck = this.handleAdminCheck.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(e) {
        const key = e.which || e.keyCode;
        if (key === 13) this.handleAdminCheck();
    }

    handleAdminCheck() {
        if (this.props.showAdmin && this.props.selected) {
            this.props.handleAdminCheck(this.props.member);
        }
    }

    render() {
        const styles = {
            card: {
                margin: '0px 10px 10px',
                boxShadow: 'none',
            },
            text: {
                flex: '1 1 auto',
                marginRight: '10px',
                color: '#707274',
                fontSize: '14px',
            },
            expandIcon: {
                fill: '#4598bf',
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
                marginRight: '5px',
            },
            cardText: {
                backgroundColor: '#fff',
                color: '#707274',
                padding: '10px 16px 0px',
            },
        };

        // Assume group is not selected by default
        let groupIcon = <CheckBoxOutline style={styles.checkIcon} onClick={this.handleCheck} />;

        // Check if group is selected
        if (this.props.selected) {
            groupIcon = <CheckBox style={styles.checkIcon} onClick={this.handleCheck} />;
        }

        if (this.props.showAdmin && !this.props.selected) {
            styles.adminCheckIcon.color = '#707274';
            styles.adminCheckIcon.opacity = 0.2;
            styles.adminCheckIcon.cursor = 'default';
        }

        let adminButton = null;
        if (this.props.showAdmin) {
            if (this.props.admin) {
                adminButton = <People onClick={this.handleAdminCheck} style={styles.adminCheckIcon} />;
            } else {
                adminButton = <PeopleOutline onClick={this.handleAdminCheck} style={styles.adminCheckIcon} />;
            }
        }

        return (
            <Card
                key={this.props.member.user.username}
                style={styles.card}
                containerStyle={{ paddingBottom: '0px' }}
                className="qa-MemberRow-Card"
            >
                <CardHeader
                    title={
                        <div style={{ display: 'flex' }}>
                            <div style={styles.text} className="qa-MemberRow-CardHeader-text">
                                <div><strong>{this.props.member.user.first_name} {this.props.member.user.last_name}</strong></div>
                                <div>{this.props.member.user.email}</div>
                            </div>
                            {adminButton}
                            {groupIcon}
                        </div>
                    }
                    style={{ padding: '6px' }}
                    textStyle={{ padding: '0px', width: '100%' }}
                />
            </Card>
        );
    }
}

MemberRow.defaultProps = {
    showAdmin: false,
    admin: false,
    handleAdminCheck: () => {},
};

MemberRow.propTypes = {
    member: PropTypes.shape({
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
    }).isRequired,
    selected: PropTypes.bool.isRequired,
    admin: PropTypes.bool,
    showAdmin: PropTypes.bool,
    handleCheck: PropTypes.func.isRequired,
    handleAdminCheck: PropTypes.func,
};

export default MemberRow;
