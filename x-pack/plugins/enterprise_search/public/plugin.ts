/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  Plugin,
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  AppMountParameters,
} from 'src/core/public';

import {
  FeatureCatalogueCategory,
  HomePublicPluginSetup,
} from '../../../../src/plugins/home/public';
import { DEFAULT_APP_CATEGORIES } from '../../../../src/core/public';
import { LicensingPluginSetup } from '../../licensing/public';

import AppSearchLogo from './applications/app_search/assets/logo.svg';

export interface ClientConfigType {
  host?: string;
}
export interface PluginsSetup {
  home: HomePublicPluginSetup;
  licensing: LicensingPluginSetup;
}

export class EnterpriseSearchPlugin implements Plugin {
  private config: ClientConfigType;

  constructor(private readonly initializerContext: PluginInitializerContext) {
    this.config = initializerContext.config.get<ClientConfigType>();
  }

  public setup(core: CoreSetup, plugins: PluginsSetup) {
    const config = this.config;

    core.application.register({
      id: 'enterprise_search',
      title: 'App Search', // TODO: This will eventually be 'Enterprise Search' once there's more than just App Search in here
      category: DEFAULT_APP_CATEGORIES.enterpriseSearch,
      mount: async (params: AppMountParameters) => {
        const [coreStart] = await core.getStartServices();

        const { renderApp } = await import('./applications');

        return renderApp(coreStart, params, config, plugins);
      },
    });

    plugins.home.featureCatalogue.register({
      id: 'app_search',
      title: 'App Search',
      icon: AppSearchLogo,
      description:
        'Leverage dashboards, analytics, and APIs for advanced application search made simple.',
      path: '/app/enterprise_search/app_search',
      category: FeatureCatalogueCategory.DATA,
      showOnHomePage: true,
    });
    // TODO: Workplace Search will likely also register its own feature catalogue section/card.
  }

  public start(core: CoreStart) {}

  public stop() {}
}
