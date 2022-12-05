import React, { Component } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import config from '../../config';
import { types as sdkTypes } from '../../util/sdkLoader';

import css from './ListingPage.module.css';
import { formatMoney } from '../../util/currency';
import { nightsBetween } from '../../util/dates';

const { Money } = sdkTypes;

const SectionPricesMaybe = props => {
  const { priceTitle, className, publicData, intl } = props;
  // console.log('publicData', publicData);
  const classes = classNames(css.root, className);

  const priceData = (price, intl) => {
    if (price && price.currency === config.currency) {
      const formattedPrice = formatMoney(intl, price);
      return { formattedPrice, priceUnit: formattedPrice };
    } else if (price) {
      return {
        formattedPrice: `(${price.currency})`,
        priceUnit: `Unsupported currency (${price.currency})`,
      };
    }
    return {};
  };

  const { formattedPrice } = priceData(
    new Money(
      publicData && publicData.premiumPrice ? publicData.premiumPrice.amount : 0,
      publicData && publicData.premiumPrice ? publicData.premiumPrice.currency : 'USD'
    ),
    intl
  );
  const { priceUnit } = priceData(
    new Money(
      publicData && publicData.standardPrice ? publicData.standardPrice.amount : 0,
      publicData && publicData.standardPrice ? publicData.standardPrice.currency : 'USD'
    ),
    intl
  );

  return (
    <div className={classes}>
      <div className={css.desktopPriceContainer}>
        <p className={css.priceTitle}>Basic Price</p>
        <div className={css.desktopPriceValue}>{priceTitle}</div>
      </div>
      <div className={css.desktopPriceContainer}>
        <p className={css.priceTitle}>Standard Price</p>
        <div className={css.desktopPriceValue}>{priceUnit}</div>
      </div>
      <div className={css.desktopPriceContainer}>
        <p className={css.priceTitle}>Premium Price</p>
        <div className={css.desktopPriceValue}>{formattedPrice}</div>
      </div>
    </div>
  );
};

export default SectionPricesMaybe;
