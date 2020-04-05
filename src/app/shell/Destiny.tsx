import React from 'react';
import { UIView } from '@uirouter/react';
import ManifestProgress from './ManifestProgress';
import { DestinyAccount } from '../accounts/destiny-account';
import ItemPopupContainer from '../item-popup/ItemPopupContainer';
import ItemPickerContainer from '../item-picker/ItemPickerContainer';
import MoveAmountPopupContainer from '../inventory/MoveAmountPopupContainer';
import { t } from 'app/i18next-t';
import GlobalHotkeys from '../hotkeys/GlobalHotkeys';
import { itemTagList } from '../inventory/dim-item-info';
import { Hotkey } from '../hotkeys/hotkeys';
import { connect } from 'react-redux';
import { loadWishListAndInfoFromIndexedDB } from 'app/wishlists/reducer';
import { loadVendorDropsFromIndexedDB } from 'app/vendorEngramsXyzApi/reducer';
import { ThunkDispatchProp } from 'app/store/reducers';

interface Props extends ThunkDispatchProp {
  account: DestinyAccount;
}

/**
 * Base view for pages that show Destiny content.
 */
class Destiny extends React.Component<Props> {
  componentDidMount() {
    if (!this.props.account) {
      return;
    }
    if ($featureFlags.wishLists) {
      this.props.dispatch(loadWishListAndInfoFromIndexedDB());
    }
    if ($featureFlags.vendorEngrams) {
      this.props.dispatch(loadVendorDropsFromIndexedDB());
    }
  }

  render() {
    if (!this.props.account) {
      return (
        <div className="dim-error dim-page">
          <h2>{t('Account.MissingTitle')}</h2>
          <div>{t('Account.MissingDescription')}</div>
        </div>
      );
    }

    // Define some hotkeys without implementation, so they show up in the help
    const hotkeys: Hotkey[] = [
      {
        combo: 't',
        description: t('Hotkey.ToggleDetails'),
        callback() {
          // Empty - this gets redefined in dimMoveItemProperties
        }
      }
    ];

    itemTagList.forEach((tag) => {
      if (tag.hotkey) {
        hotkeys.push({
          combo: tag.hotkey,
          description: t('Hotkey.MarkItemAs', {
            tag: t(tag.label)
          }),
          callback() {
            // Empty - this gets redefined in item-tag.component.ts
          }
        });
      }
    });

    return (
      <>
        <div id="content">
          <UIView />
        </div>
        <GlobalHotkeys hotkeys={hotkeys} />
        <ItemPopupContainer boundarySelector=".store-header" />
        <ItemPickerContainer />
        <MoveAmountPopupContainer />
        <ManifestProgress destinyVersion={this.props.account.destinyVersion} />
      </>
    );
  }
}

export default connect()(Destiny);
