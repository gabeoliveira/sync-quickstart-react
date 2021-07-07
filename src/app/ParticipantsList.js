import React from 'react';
import styled from '@emotion/styled';
import Popover from "@material-ui/core/Popover";
import { withStyles } from '@material-ui/styles';
import CommanderDamageAccordion from './CommanderDamage';
import poison from '../assets/poison.png'
import cityBlessing from '../assets/cityblessing.png'
import monarch from '../assets/monarch.png'



const PlayerGrid = styled('div')`
    display: grid;
    grid-template-columns: repeat(${props => props.participants.length + (props.participants.length % 2)},1fr);
  
    
    
`

const PlayerContainer = styled('div')`
    display: flex;
    align-items: top;
    justify-content: center;
    gap: 5% 5%;
    overflow-y: auto;
    grid-row-start: ${props => props.length / props.index > 2 ? '1' : '2'};
    ${props => (props.length / props.index) > 2 
        ? `grid-column-start: ${(props.index*2 + 1)}; grid-column-end: ${(props.index*2 + 3)};`
        : `grid-column-start: ${2*(props.length - props.index) - 1 + (props.length % 2)}; grid-column-end: ${2*(props.length - props.index) + 1 + (props.length % 2)};`}
    padding: 80px 80px 80px 80px;
    ${props => props.activeTurn && 'border: 1px solid sandybrown; background-color: rgba(244, 165, 96, 0.2);'}
    border-radius: 6px;
`

const Life = styled('div')`
    justify-self: start;
    color: ${props => props.isActive ? 'whitesmoke' : 'rgb(187, 0, 0)'};
    font-size: xx-large;
    font-weight: bolder;
    padding-top: 0px;
    justify-self: end;
    

`

const Poison = styled('div')`
    display: flex;
    font-size: medium;
    color: whitesmoke;
    gap: 15%;
`


const Info = styled('div')`
    color: whitesmoke;
    ${props => props.type === 'name' ? 'font-weight: bold' : ( props.type === 'commander' ? 'font-style: italic': undefined)};
    font-size: small;
    grid-area: auto / 2 / auto / auto;

`

const PlayerName = styled('div')`
    color: whitesmoke;
    ${props => props.isActive ? 'color: whitesmoke;' : 'color: rgb(187, 0, 0); font-style: italic; text-decoration: line-through;'}
    font-weight: bold;
    font-size: small;
    grid-area: auto / 2 / auto / auto;
`

const CommanderContainer = styled('div')`
    display: flex;
    flex-direction: column;
`

const CommandersWrapper = styled('div')`
    display: flex;
    flex-direction: column;
`

const CommanderDamageContainer = styled('div')`
    grid-area: auto / 2 / auto / auto;
`

const PlayerInfo = styled('div')`
    display: flex;
    flex-direction: column;
    justify-self: stretch;
    flex-grow: 200;
`

const PlayerFlags = styled('div')`
    display: flex;
    flex-direction: column;
`

const ColorIdentityWrapper = styled('div')`
    display: flex;
`

const ColorIdentity = styled('div')`
    background-color: ${props => props.backgroundColor};
    height: 3px;
    width: 35px;
`

const styles = theme => ({
    popover: {
        pointerEvents: 'none'
     
    },
    paper: {
        border: '1px solid sandybrown',
        borderRadius: '6px',
        maxWidth: '600px',
        padding: '3px'
    }
  });



class ParticipantsList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            anchorElBottom: null,
            activePopover: null,
            participants: [],
            value: ''
        }

        this.handlePopoverClose = this.handlePopoverClose.bind(this);
    }

    handlePopoverOpen(event, id){
        console.log(event);


        this.setState({
            anchorElBottom: event.currentTarget,
            activePopover: id
        });
        console.log(`State changed to: ${event.currentTarget}`);
    }

    handlePopoverClose(){
        this.setState({
            anchorElBottom: null,
            activePopover: null
        });
    }

    addCommander(value){
        this.setState({value: value});

        this.setState(state => {
            const participants = state.participants.concat(state.value);
            
            return {participants,value: ''};
        });
        
        console.log(this.state);
    }

    mapCommanders(commanders){

        return commanders.map(commander => {
            const { classes } = this.props;
            return <CommanderContainer key={commander.id}>
                <Info type="commander" onMouseEnter={e => this.handlePopoverOpen(e, commander.id)} onMouseLeave={this.handlePopoverClose} >{commander.name}</Info>
                <Popover
                    id={'commander-popover-' + commander.name}
                    className={classes.popover}
                    classes={{
                        paper: classes.paper,
                    }}
                    open={this.state.activePopover === commander.id}
                    anchorEl={this.state.anchorElBottom}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                    }}
                    onClose={this.handlePopoverClose}
                    disableRestoreFocus
                >
                    <img src={commander.imageUrl} alt={commander.name} width="350px" ></img>
                </Popover>   
            </CommanderContainer>
        }
            )
    }

    render() {
        

        let participants = this.props.participants.map(participant =>{ 


            let colorIdentity = participant.colorIdentity.map(color => {
                let backgroundColor = '';

                switch(color){
                    case 'B':
                        backgroundColor = 'black';
                        break;

                    case 'R':
                        backgroundColor = 'rgb(170, 2, 2)';
                        break;

                    case 'W':
                        backgroundColor = 'rgb(255, 252, 208)';
                        break;

                    case 'U':
                        backgroundColor = 'rgb(4, 79, 177)';
                        break;

                    case 'G':
                        backgroundColor = 'green';
                        break;
                }

                console.log(backgroundColor);

                return <ColorIdentity backgroundColor={backgroundColor} ></ColorIdentity>

            })

            let commanders = this.mapCommanders(participant.commanders);

            let CommanderDamage = participant.commanderDamage.map(commander => {
                return <Info><b>{commander.name}: </b>{commander.damage}</Info>
            });
            

            return <PlayerContainer index={this.props.participants.indexOf(participant)} activeTurn={participant.activeTurn} length={this.props.participants.length} key={participant.username ? participant.username : 'none'}>
                <PlayerFlags>
                    <Life isActive={participant.isActive}>{participant.lifeTotal}</Life>
                    {participant.poisonCounters > 0 ? <Poison><img src={poison} width="15px" title="Poison Counters" alt="Poison Counters"/> <b>{participant.poisonCounters}</b></Poison> : undefined}
                    {participant.cityBlessing ? <div><img src={cityBlessing} width="25px" title="City's Blessing" alt="City Blessing"/></div> : undefined}
                    {participant.monarch ? <div><img src={monarch} width="25px" title="Monarch" alt="Monarch"/></div> : undefined}
                </PlayerFlags>
                
                <PlayerInfo>
                    <PlayerName type="name" isActive={participant.isActive}>{participant.username}</PlayerName>
                    <CommandersWrapper>{commanders}</CommandersWrapper>
                   
                    <ColorIdentityWrapper>{colorIdentity}</ColorIdentityWrapper>
                    {CommanderDamage.length > 0 && <div><br /><CommanderDamageAccordion commanderDamage={participant.commanderDamage} /></div>}
                </PlayerInfo>
               
            </PlayerContainer>

        });

        return (
            <PlayerGrid participants={this.props.participants}>{participants}</PlayerGrid>
        )
    }
}

export default withStyles(styles)(ParticipantsList);