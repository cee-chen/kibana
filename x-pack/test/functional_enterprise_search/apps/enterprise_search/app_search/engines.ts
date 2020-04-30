/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from '@kbn/expect';
import { FtrProviderContext } from '../../../ftr_provider_context';

export default function enterpriseSearchSetupEnginesTests({
  getService,
  getPageObjects,
}: FtrProviderContext) {
  const esArchiver = getService('esArchiver');
  const browser = getService('browser');
  const retry = getService('retry');

  const PageObjects = getPageObjects(['enterpriseSearch']);

  describe('Engines Overview', function() {
    this.tags('smoke');
    before(async () => await esArchiver.load('empty_kibana'));
    after(async () => {
      await esArchiver.unload('empty_kibana');
    });

    describe('when an enterpriseSearch host is configured', () => {
      it('navigating to the enterprise_search plugin will redirect a user to the setup guide', async () => {
        await PageObjects.enterpriseSearch.navigateToPage();
        await retry.try(async function() {
          const currentUrl = await browser.getCurrentUrl();
          expect(currentUrl).to.contain('/app_search');
        });
      });
    });
  });
}
