import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTheme } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Checked from '@material-ui/icons/CheckBox';

export class ProvidersFilter extends Component {
    render() {
        const { colors } = this.props.theme.eventkit;

        let providers = [];
        if (this.props.providers) {
            providers = this.props.providers.filter(provider => provider.display);
        }

        const styles = {
            container: {
                width: '100%',
                padding: '0px 10px',
            },
            title: {
                width: '100%',
                margin: '0px',
                lineHeight: '36px',
            },
            provider: {
                display: 'flex',
                flexWrap: 'nowrap',
                lineHeight: '24px',
                paddingBottom: '8px',
                color: colors.text_primary,
                fontWeight: 700,
            },
            checkbox: {
                width: '24px',
                height: '24px',
                flex: '0 0 auto',
                marginRight: '5px',
            },
        };

        const checkedIcon = (<Checked color="primary" />);

        return (
            <div style={styles.container}>
                <p
                    className="qa-ProvidersFilter-p"
                    style={styles.title}
                >
                    <strong>Sources</strong>
                </p>
                {providers.map(provider => (
                    <div style={styles.provider} key={provider.slug}>
                        <Checkbox
                            className="qa-ProvidersFilter-Checkbox"
                            key={provider.slug}
                            style={styles.checkbox}
                            checked={!!this.props.selected[provider.slug]}
                            checkedIcon={checkedIcon}
                            onChange={(e, v) => {
                                this.props.onChange(provider.slug, v);
                            }}
                        />
                        <span
                            className="qa-ProvidersFilter-name"
                            style={{ display: 'flex', flex: '1 1 auto' }}
                        >
                            {provider.name}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
}

ProvidersFilter.propTypes = {
    providers: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withTheme()(ProvidersFilter);
