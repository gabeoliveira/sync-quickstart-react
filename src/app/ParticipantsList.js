import React from 'react';
import styled from '@emotion/styled';

const PlayerGrid = styled('div')`
    display: grid;
    grid-template-columns: ${props => props.participants.length <= 4 ? '1fr 1fr' : (props.participants.length > 6 ? '1fr 1fr 1fr 1fr': '1fr 1fr 1fr')};
    grid-template-rows: auto auto;
    margin: auto;
`

const PlayerContainer = styled('div')`
    display: grid;
    grid-template-columns: 1fr 3fr;
    overflow-y: auto;
    grid-row-start: ${props => props.length / props.index > 2 ? '1' : '2'};
    grid-column-start: ${props => (props.length / props.index) > 2 ? props.index + 1 : props.length - props.index};
    padding: 80px 80px 80px 80px;
    ${props => props.activeTurn ? 'border: 1px solid sandybrown; background-color: rgba(244, 165, 96, 0.2);' : undefined}
    border-radius: 6px;
`

const Life = styled('div')`
    grid-row-start: 1;
    grid-row-end: 2;
    color: ${props => props.isActive ? 'darkslategrey' : 'rgb(187, 0, 0)'};
    font-size: xx-large;
    font-weight: bolder;
    padding-top: 0px;

`

const Info = styled('div')`
    color: darkslategrey;
    ${props => props.type === 'name' ? 'font-weight: bold' : ( props.type === 'commander' ? 'font-style: italic': undefined)};
    font-size: small;
    grid-area: auto / 2 / auto / auto;

`

const PlayerName = styled('div')`
    color: darkslategrey;
    ${props => props.isActive ? 'color: darkslategrey;' : 'color: rgb(187, 0, 0); font-style: italic; text-decoration: line-through;'}
    font-weight: bold;
    font-size: small;
    grid-area: auto / 2 / auto / auto;
`

const CommanderDamageContainer = styled('div')`
    grid-area: auto / 2 / auto / auto;
`

const PlayerInfo = styled('div')`
    grid-auto-rows: 20px;
    grid-template-columns: auto;
`


class ParticipantsList extends React.Component {

    render() {
        let participants = this.props.participants.map(participant =>{ 
            participant.colorIdentity = participant.colorIdentity.map(color => {

                return color.replace('B','⚫').replace('R','🔴').replace('W','⚪').replace('U','🔵').replace('G','🟢');
            });

            let commanderNames = participant.commanders.map(commander => commander.name).join(' / ');

            let CommanderDamage = participant.commanderDamage.map(commander => {
                return <Info><b>{commander.name}: </b>{commander.damage}</Info>
            });
            

            return <PlayerContainer index={this.props.participants.indexOf(participant)} activeTurn={participant.activeTurn} length={this.props.participants.length} key={participant.username ? participant.username : 'none'}>
                <Life isActive={participant.isActive}>{participant.lifeTotal}</Life>
                <PlayerInfo>
                    <PlayerName type="name" isActive={participant.isActive}>{participant.username}</PlayerName>
                    <Info type="commander">{commanderNames}</Info>
                    <Info>{participant.colorIdentity}</Info>{'\n'}
                    {participant.poisonCounters > 0 ? <Info><b>Poison Counters:</b> {participant.poisonCounters}</Info> : undefined}
                    {participant.cityBlessing ? <Info><b>City Blessing</b></Info> : undefined}
                    {participant.monarch ? <Info><b>Monarch</b></Info> : undefined}
                </PlayerInfo>
                {CommanderDamage.length > 0 ? <CommanderDamageContainer><Info><br/><b>Commander Damage</b> </Info>{CommanderDamage}</CommanderDamageContainer>: undefined}
               
                </PlayerContainer>

        });

        return (
            
        <PlayerGrid participants={this.props.participants}>{participants}</PlayerGrid>
        )
    }
}

export default ParticipantsList;