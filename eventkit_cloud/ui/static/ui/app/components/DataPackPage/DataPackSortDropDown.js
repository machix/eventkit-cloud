import PropTypes from 'prop-types';
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import DropDownMenu from '../common/DropDownMenu';

const NAME_LOOKUP = {
    '-job__featured': 'Featured',
    '-started_at': 'Newest',
    started_at: 'Oldest',
    job__name: 'Name (A-Z)',
    '-job__name': 'Name (Z-A)',
};

export class DataPackSortDropDown extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        this.props.handleChange(value);
    }

    render() {
        const styles = {
            item: {
                fontSize: '12px',
                padding: '0px 24px',
                height: '32px',
            },
        };

        return (
            <DropDownMenu
                className="qa-DataPackSortDropDown-Menu"
                value={NAME_LOOKUP[this.props.value]}
            >
                <MenuItem
                    className="qa-DataPackSortDropDown-MenuItem-featured"
                    style={styles.item}
                    selected={this.props.value === '-job__featured'}
                    onClick={() => this.handleChange('-job__featured')}
                >
                    Featured
                </MenuItem>
                <MenuItem
                    className="qa-DataPackSortDropDown-MenuItem-newest"
                    style={styles.item}
                    selected={this.props.value === '-started_at'}
                    onClick={() => this.handleChange('-started_at')}
                >
                    Newest
                </MenuItem>
                <MenuItem
                    className="qa-DataPackSortDropDown-MenuItem-oldest"
                    style={styles.item}
                    selected={this.props.value === 'started_at'}
                    onClick={() => this.handleChange('started_at')}
                >
                    Oldest
                </MenuItem>
                <MenuItem
                    className="qa-DataPackSortDropDown-MenuItem-nameAZ"
                    style={styles.item}
                    selected={this.props.value === 'job__name'}
                    onClick={() => this.handleChange('job__name')}
                >
                    Name (A-Z)
                </MenuItem>
                <MenuItem
                    className="qa-DataPackSortDropDown-MenuItem-nameZA"
                    style={styles.item}
                    onClick={() => this.handleChange('-job__name')}
                    selected={this.props.value === '-job__name'}
                >
                    Name (Z-A)
                </MenuItem>
            </DropDownMenu>
        );
    }
}


DataPackSortDropDown.propTypes = {
    handleChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default DataPackSortDropDown;
