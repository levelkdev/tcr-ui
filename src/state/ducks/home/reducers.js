import { fromJS } from 'immutable'

import * as epTypes from '../ethProvider/types'
import * as liTypes from '../listings/types'
import * as types from './types'

const initialState = fromJS({
  provider: {},
  account: '',
  network: '',
  balances: {
    ETH: '0',
    token: '0',
    registryAllowance: '0',
    votingAllowance: '0',
    votingRights: '0',
    lockedTokens: '0',
    totalRegistryStake: '0',
  },
  tcr: {
    tokenName: '',
    registryName: '',
    tokenSymbol: '',
    tokenDecimals: '18',
  },
  contracts: {
    registry: {},
    token: { name: '' },
    voting: {},
    parameterizer: {},
  },
  parameters: { minDeposit: '0', applyStageLen: '0' },
  latestTxn: {},
  abis: {},
  listings: {},
  byID: [],
})

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case types.SETUP_ETHEREUM_FAILED:
      return state.set('error', fromJS(action.payload.error))
    case types.SETUP_ETHEREUM_SUCCEEDED:
      return state
        .set('account', fromJS(action.payload.account))
        .set('network', fromJS(action.payload.network))
    case epTypes.SET_ABIS:
      return state.set('abis', action.abis) // mutable
    case epTypes.SET_REGISTRY_CONTRACT:
      return state.setIn(['contracts', 'registry'], fromJS(action.payload))
    case liTypes.SET_LISTINGS:
      return state
        .set('listings', fromJS(action.payload.listings))
        .set('byID', fromJS(action.payload.byID))
    case liTypes.UPDATE_LISTING:
      return state.setIn(['listings', action.payload.listingHash], fromJS(action.payload))
    // case liTypes.DELETE_KEY:
    //   return omit(action.key, state)
    case epTypes.SET_CONTRACTS:
      return state
        .set('parameters', fromJS(action.payload.parameters))
        .set('contracts', fromJS(action.payload.contracts))
        .set('tcr', action.payload.tcr) // mutable
    case epTypes.UPDATE_BALANCES_SUCCEEDED:
      return state.set('balances', fromJS(action.payload.balances))
    case epTypes.UPDATE_BALANCES_FAILED:
      return state.set('error', fromJS(action.payload.error))
    default:
      return state
  }
}

export default homeReducer
