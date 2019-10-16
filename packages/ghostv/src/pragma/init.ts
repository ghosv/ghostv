import {
  init,
} from 'snabbdom'

import moduleHero from 'snabbdom/modules/hero'
import moduleClass from 'snabbdom/modules/class'
import moduleProps from 'snabbdom/modules/props'
import moduleStyle from 'snabbdom/modules/style'
import moduleAttributes from 'snabbdom/modules/attributes'
import moduleDataset from 'snabbdom/modules/dataset'
import moduleEventListeners from 'snabbdom/modules/eventlisteners'
export const patch = init([
  moduleHero,
  moduleClass,
  moduleProps,
  moduleStyle,
  moduleAttributes,
  moduleDataset,
  moduleEventListeners
]);
