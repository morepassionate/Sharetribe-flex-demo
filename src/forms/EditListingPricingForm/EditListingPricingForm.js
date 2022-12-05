import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import config from '../../config';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes } from '../../util/types';
import * as validators from '../../util/validators';
import { formatMoney } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';
import { Button, Form, FieldCurrencyInput } from '../../components';
import css from './EditListingPricingForm.module.css';

const { Money } = sdkTypes;

export const EditListingPricingFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
      } = formRenderProps;

      const unitType = config.bookingUnitType;
      const isNightly = unitType === LINE_ITEM_NIGHT;
      const isDaily = unitType === LINE_ITEM_DAY;

      const basicTranslationKey = isNightly
        ? 'EditListingPricingForm.basicPricePerNight'
        : isDaily
        ? 'EditListingPricingForm.basicPricePerDay'
        : 'EditListingPricingForm.pricePerUnit';

      const premiumTranslationKey = isNightly
        ? 'EditListingPricingForm.premiumPricePerNight'
        : isDaily
        ? 'EditListingPricingForm.premiumPricePerDay'
        : 'EditListingPricingForm.pricePerUnit';

      const standardTranslationKey = isNightly
        ? 'EditListingPricingForm.standardPricePerNight'
        : isDaily
        ? 'EditListingPricingForm.standardPricePerDay'
        : 'EditListingPricingForm.pricePerUnit';

      const basicPricePerUnitMessage = intl.formatMessage({
        id: basicTranslationKey,
      });

      const premiumPricePerUnitMessage = intl.formatMessage({
        id: premiumTranslationKey,
      });

      const standardPricePerUnitMessage = intl.formatMessage({
        id: standardTranslationKey,
      });

      const pricePlaceholderMessage = intl.formatMessage({
        id: 'EditListingPricingForm.priceInputPlaceholder',
      });

      const basicPriceRequired = validators.required(
        intl.formatMessage({
          id: 'EditListingPricingForm.basicPriceRequired',
        })
      );
      const premiumPriceRequired = validators.required(
        intl.formatMessage({
          id: 'EditListingPricingForm.premiumPriceRequired',
        })
      );
      const standardPriceRequired = validators.required(
        intl.formatMessage({
          id: 'EditListingPricingForm.standardPriceRequired',
        })
      );
      const minPrice = new Money(config.listingMinimumPriceSubUnits, config.currency);
      const minPriceRequired = validators.moneySubUnitAmountAtLeast(
        intl.formatMessage(
          {
            id: 'EditListingPricingForm.priceTooLow',
          },
          {
            minPrice: formatMoney(intl, minPrice),
          }
        ),
        config.listingMinimumPriceSubUnits
      );

      const basicPriceValidators = config.listingMinimumPriceSubUnits
        ? validators.composeValidators(basicPriceRequired, minPriceRequired)
        : basicPriceRequired;

      const premiumPriceValidators = config.listingMinimumPriceSubUnits
        ? validators.composeValidators(premiumPriceRequired, minPriceRequired)
        : premiumPriceRequired;

      const standardPriceValidators = config.listingMinimumPriceSubUnits
        ? validators.composeValidators(standardPriceRequired, minPriceRequired)
        : standardPriceRequired;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const { updateListingError, showListingsError } = fetchErrors || {};

      return (
        <Form onSubmit={handleSubmit} className={classes}>
          {updateListingError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPricingForm.updateFailed" />
            </p>
          ) : null}
          {showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingPricingForm.showListingFailed" />
            </p>
          ) : null}
          <FieldCurrencyInput
            id="price"
            name="price"
            className={css.priceInput}
            autoFocus
            label={basicPricePerUnitMessage}
            placeholder={pricePlaceholderMessage}
            currencyConfig={config.currencyConfig}
            validate={basicPriceValidators}
          />
          <FieldCurrencyInput
            id="premiumPrice"
            name="premiumPrice"
            className={css.priceInput}
            label={premiumPricePerUnitMessage}
            placeholder={pricePlaceholderMessage}
            currencyConfig={config.currencyConfig}
            validate={premiumPriceValidators}
          />
          <FieldCurrencyInput
            id="standardPrice"
            name="standardPrice"
            className={css.priceInput}
            label={standardPricePerUnitMessage}
            placeholder={pricePlaceholderMessage}
            currencyConfig={config.currencyConfig}
            validate={standardPriceValidators}
          />

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingPricingFormComponent.defaultProps = { fetchErrors: null };

EditListingPricingFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingPricingFormComponent);
