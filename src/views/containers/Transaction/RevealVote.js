import React, { Component } from 'react'
import translate from 'views/translations'

import { baseToConvertedUnit } from 'state/libs/units'

import Button from 'views/components/Button'
import { SideSplit, SideText } from 'views/containers/Transaction/components'
import { MarginDiv, FileInput } from 'views/components/StyledHome'

import SidePanelSeparator from './components/SidePanelSeparator'
import SidePanel from './components/SidePanel'
import TxnProgress from './TxnProgress'

export default class RevealVote extends Component {
  state = {
    commitHash: '',
    numTokens: '',
    votesFor: '',
    votesAgainst: '',
  }
  componentDidMount() {
    this.getCommitHash()
  }

  getCommitHash = async () => {
    const poll = await this.props.voting.pollMap(
      this.props.selectedOne.get('challengeID')
    )
    const votesFor = baseToConvertedUnit(poll[3], this.props.tcr.tokenDecimals)
    const votesAgainst = baseToConvertedUnit(poll[4], this.props.tcr.tokenDecimals)

    const numTokensRaw = (await this.props.voting.getNumTokens(
      this.props.account,
      this.props.selectedOne.get('challengeID')
    ))['0']
    const numTokens = baseToConvertedUnit(numTokensRaw, this.props.tcr.tokenDecimals)

    const commitHash = (await this.props.voting.getCommitHash(
      this.props.account,
      this.props.selectedOne.get('challengeID')
    ))['0']

    if (
      commitHash !== '0x0000000000000000000000000000000000000000000000000000000000000000'
    ) {
      this.setState({
        commitHash,
        numTokens,
        votesFor,
        votesAgainst,
      })
    }
  }
  render() {
    const {
      opened,
      closeSidePanel,
      balances,
      handleFileInput,
      handleRevealVote,
      selectedOne,
      miningStatus,
      latestTxn,
    } = this.props
    return (
      <SidePanel title="Reveal Vote" opened={opened} onClose={closeSidePanel}>
        <SideSplit
          leftTitle={'Voting Rights'}
          leftItem={balances.get('votingRights')}
          rightTitle={'Locked Tokens'}
          rightItem={balances.get('lockedTokens')}
        />
        <SideSplit
          leftTitle={'Votes For'}
          leftItem={this.state.votesFor}
          rightTitle={'Votes Against'}
          rightItem={this.state.votesAgainst}
        />
        <SideSplit
          leftTitle={'Tokens Committed'}
          leftItem={this.state.numTokens}
          rightTitle={'POLL ID'}
          rightItem={selectedOne && selectedOne.get('challengeID')}
        />

        <SideText small text={'REVEAL VOTE'} />
        <SideText small text={selectedOne && selectedOne.get('listingID')} />

        <SidePanelSeparator />

        <SideText text={'INSTRUCTIONS'} />

        <SideText text={translate('ins_revealVote')} />

        <MarginDiv>
          <FileInput type="file" name="file" onChange={handleFileInput} />
        </MarginDiv>
        <MarginDiv>
          <Button onClick={handleRevealVote} mode="strong" wide>
            {'Reveal Vote'}
          </Button>
        </MarginDiv>
        {miningStatus && (
          <div>
            <Button
              href={`https://rinkeby.etherscan.io/tx/${latestTxn.get('transactionHash')}`}
            >
              {'etherscan'}
            </Button>
            <TxnProgress />
          </div>
        )}
      </SidePanel>
    )
  }
}
