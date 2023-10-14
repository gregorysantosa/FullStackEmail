/*
#######################################################################
#
# Copyright (C) 2020-2022 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {styled, alpha} from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Avatar from '@mui/material/Avatar';
import {useState} from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import SharedContext from './SharedContext.js';
const drawerWidth = 160;

const fetchMails = (setMails, setError, mailbox) => {
  const item = localStorage.getItem('user');
  if (!item) {
    return;
  }
  const user = JSON.parse(item);
  const bearerToken = user.accessToken;
  fetch('http://localhost:3010/v0/Mailbox?mailbox='+mailbox, {
    method: 'get',
    headers: new Headers({
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then((json) => {
      localStorage.setItem('rand', '4');
      setError('');
      setMails(json);
    })
    .catch((error) => {
      localStorage.setItem('random', '4');
      console.log(error);
      setMails([]);
      setError(`${error.status} - ${error.statusText}`);
    });
};


/**
 * @return {object} JSX Table
 */
function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [mails, setMails] = React.useState([]);
  const [name, setName] = React.useState(user ? user.name : '');
  const [error, setError] = React.useState('Logged Out');

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [title, setTitle] = useState('Inbox');

  const [display, setDisplay] = useState(false);
  const [subject, setSubject] = useState('');
  const [from, setFrom] = useState('');
  const [received, setReceived] = useState('');
  const [content, setContent] = useState('');
  const [favorite, setFavorite] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [numStarred, setNumStarred] = useState(0);
  const {mailbox} = React.useContext(SharedContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const logout = () => {
    localStorage.removeItem('user');
    setMails([]);
    setName('');
    setError('Logged Out');
  };

  React.useEffect(() => {
    if (mailbox) {
      fetchMails(setMails, setError, mailbox);
    }
    fetchMails(setMails, setError, 'Inbox');
    if (mailbox && typeof(mailbox) !== 'string') {
      setMails(mailbox);
    }
  }, [mailbox],
  );

  // Handles Inbox press, updates category and title
  const handleInbox = () => {
    setTitle('Inbox');
    setDisplay(false);
    fetchMails(setMails, setError, 'Inbox');
  };
  // Handles Trash press, updates category and title
  const handleTrash = () => {
    setTitle('Trash');
    setDisplay(false);
    fetchMails(setMails, setError, 'Trash');
  };

  // Handles Trash press, updates category and title
  const handleSent = () => {
    setTitle('Sent');
    setDisplay(false);
    fetchMails(setMails, setError, 'Sent');
  };

  // Code for search below taken from below website
  // https://mui.com/material-ui/react-app-bar/
  const Search = styled('div')(({theme}) => ({
    'position': 'relative',
    'borderRadius': theme.shape.borderRadius,
    'backgroundColor': alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    'marginRight': theme.spacing(2),
    'marginLeft': 0,
    'width': '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({theme}) => ({
    'color': 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

  // Drawer component on left side, definitions here.
  // Some of the lines are taken from https://mui.com/material-ui/react-drawer/
  const drawer = (
    <div>
      <Toolbar />
      <ListItem key = {'nameDrawer'}>
        <Typography key = {'name'} variant ='h6'>
          {name}
        </Typography>
      </ListItem>
      <ListItem key={'Inbox'} disablePadding>
        <ListItemButton onClick={()=>handleInbox()}
          aria-label="inboxButton">
          <ListItemIcon>
            {<MailIcon />}
          </ListItemIcon>
          <ListItemText primary={'Inbox'} />
        </ListItemButton>
      </ListItem>
      <Divider />
      <List>
        <ListItem key={'Starred'} disablePadding>
          <ListItemButton aria-label="starredButton">
            <ListItemIcon>
              {<StarIcon/>}
            </ListItemIcon>
            <ListItemText primary={'Starred '+numStarred} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'Sent'} disablePadding>
          <ListItemButton onClick={()=>handleSent()}
            aria-label="sentButton">
            <ListItemIcon>
              {<ArrowCircleRightIcon />}
            </ListItemIcon>
            <ListItemText primary={'Sent'} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'Trash'} disablePadding>
          <ListItemButton onClick={()=>handleTrash()}
            aria-label="trashButton">
            <ListItemIcon>
              {<InboxIcon />}
            </ListItemIcon>
            <ListItemText primary={'Trash'} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  /**
   * Creates display to show email contents when clicking on specific
   * email. Code for box and appbar is influenced by the code found on
   * https://mui.com/material-ui/react-drawer/
   * Similar style to title appbar and box
   * @return {*} String containing display elements
   */
  const createDisplay = () => {
    return (
      <Box z-index='appBar'
        hidden={!display}
        sx={{
          flexgrow: 1,
          height: '95%',
          width: {sm: `calc(100%)`},
          position: 'fixed',
          bottom: 0,
          right: 0,
          backgroundColor: 'white'}}>
        <AppBar
          sx={{
            flexgrow: 1,
            height: '55px',
            width: {sm: `calc(100%)`},
            position: 'fixed',
            top: '0%',
            right: 0,
            backgroundColor: 'primary.dark'}}
        >
          <Toolbar>
            <IconButton
              aria-label='close mobile reader'
              onClick={()=>{
                setDisplay(false);
              }}>
              <NavigateBeforeIcon
                fontSize = 'large'
              /></IconButton>
            <Typography variant='h4' component='div'
              sx={{flexGrow: 1}}>
            </Typography>
            <MailOutlineIcon fontSize = 'large'/>
            <MoveToInboxIcon fontSize = 'large'/>
            <DeleteIcon fontSize = 'large'/>
          </Toolbar>
        </AppBar>
        <Typography variant='h4' component='div'
          sx={{flexGrow: 1,
            borderTop: 1,
            color: '#000000',
            backgroundColor: '#E5E5E5'}}>
          {subject}
        </Typography>
        <Box sx={{backgroundColor: '#E0E0E0'}}>
          <List>
            <ListItem key = {'display title'}
              sx={{flexGrow: 1, backgroundColor: '#E0E0E0',
                borderBottom: 1,
                borderTop: 1}}>
              <Typography variant = 'h5'>{title}</Typography>
              <ListItemText></ListItemText>
              <StarIcon style={{color: favorite}} />
            </ListItem>
            <ListItem key = {'Contents of it'}
              sx={{flexGrow: 1, backgroundColor: '#F0F0F0',
                borderBottom: 1}}
              alignItems="center">
              <Avatar/>
              <ListItemText primary={from + ' ' + getReceived(received)}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{display: 'inline'}}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {fromAddress}
                    </Typography>
                  </React.Fragment>
                }></ListItemText>
              <ArrowBackIcon />
            </ListItem>
          </List>
        </Box>
        <Typography variant='body1'>
          {content}
        </Typography>
      </Box>
    );
  };
  /**
   * Updates display with the contents of an email
   * Also sets display to true
   * @param {string} mail email being used to update display
   * @return {*} Returns nothing, only needs to update display
   */
  const updateDisplay = (mail) => {
    setFavorite(mail.mail.favorite);
    mail.mail.read = 300;
    setDisplay(true);
    setSubject(mail.mail.subject);
    setFrom(mail.mail.from.name);
    setFromAddress(mail.mail.from.email);
    setContent(mail.mail.content);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let e = '';
    const current = new Date(mail.mail.received);
    e=months[current.getMonth()]+' '+current.getDate()+', '+
      current.getFullYear()+' @ '+current.getHours()+':'+current.getMinutes();
    setReceived(e);
    return '';
  };

  /**
   * creates  row for the current email being looked at
   * Determines the category the email is in from email.mailbox
   * Has onClick function to display email contents and
   * getReceived() function to determine display dates
   * @param {string} mail email row is being created for
   * @return {string} String containing TableRow elements
   */
  const createRow = (mail) => {
    let item = localStorage.getItem('user');
    item = JSON.parse(item);
    let from = mail.mail.from.name;
    if (from.length > 25) {
      from = from.substring(0, 22) + '...';
    }
    let s = mail.mail.subject + ' - ' + mail.mail.content;
    if (s.length>50) {
      s = s.substring(0, 47) + '...';
    }
    // https://mui.com/material-ui/react-list/
    if (item['name'] === mail.mailbox['Name']) {
      return (
        <Grid item xs={12} key = {Math.random()*100000000000000}>
          <ListItem key = {mail}
            sx={{flexGrow: 1, backgroundColor: '#F0F0F0',
              border: 2}}
            alignItems="flex-start">
            <Avatar/>
            <ListItemText onClick={()=>updateDisplay(mail)}
              aria-label='clickRow'
              primary={
                <React.Fragment>
                  <Typography
                    sx={{fontWeight: mail.mail.read}}
                  >
                    {from}
                  </Typography>
                </React.Fragment>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{display: 'inline',
                      fontWeight: mail.mail.read}}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {s}
                  </Typography>
                </React.Fragment>
              }></ListItemText>
            <Typography>
              {getReceived(mail.mail.received)}
            </Typography>
            <IconButton aria-label = 'StarIcon'
              onClick={()=>{
                if (mail.mail.favorite === 'grey') {
                  mail.mail.favorite = 'yellow';
                  setFavorite(mail.mail.favorite);
                  setNumStarred(numStarred+1);
                  return;
                } else {
                  mail.mail.favorite ='grey';
                  setFavorite(mail.mail.favorite);
                  setNumStarred(numStarred-1);
                  return;
                }
              }}>
              <StarIcon
                style={{color: mail.mail.favorite}}/></IconButton>
          </ListItem>
        </Grid>
      );
    } else {
      console.log(error);
      return;
    }
  };

  /**
   * Updates the received date to proper display for table cell
   * @param {string} received Received string to convert to date
   * @return {string} returns string to put in cell.
   */
  const getReceived = (received) => {
    const d = new Date(received);
    const current = new Date();
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    if (current.getFullYear() - d.getFullYear()>0) { // Greater than one year
      return d.getFullYear();
    } else if ((current.getMonth() - d.getMonth() !== 0 ||
        Math.abs(current.getDate() - d.getDate()) > 1) && d.getDate() !== 25) {
      if (Number(d.getDate())<10) {
        return months[d.getMonth()] + ' 0' + d.getDate();
      }
      return months[d.getMonth()] + ' ' + d.getDate();
    } else if (current.getDate() - d.getDate() === 1 ||
      d.getDate() === 25) { // Yesterday
      return 'Yesterday';
    } else {
      const hours = d.getHours() % 12;
      const minutes = d.getMinutes() < 10 ? '0'+d.getMinutes() : d.getMinutes();
      const ampm = d.getHours()>=12 ? 'PM' : 'AM';
      return hours + ':' + minutes + ' ' + ampm;
    }
  };

  return (
    <div>
      {/* Box and all code inside taken except title taken from https://mui.com/material-ui/react-drawer/*/}
      <Box sx={{flexGrow: 1}}>
        <CssBaseline />
        <AppBar
          position="static"
        >
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="toggle drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{mr: 2}}
              >
                <MenuIcon />
              </IconButton>
              {/* Search field and all code taken except title taken from https://mui.com/material-ui/react-app-bar/*/}
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{'aria-label': 'search'}}
                />
              </Search>
            </Toolbar>
            <IconButton
              aria-label='logout'
              onClick={logout}
              role='button'
              href='/Login'>
              <Avatar/></IconButton>
          </Box>
        </AppBar>
        <Box sx={{bgcolor: '#eff1f1', borderBottom: 1, borderTop: 1}}>
          <Typography aria-label='titleText' variant="h4" sx={{p: 1}}>
            {title}
          </Typography>
        </Box>
        {/* Box taken from https://mui.com/material-ui/react-drawer/*/}
        <Box
          component="nav"
          sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
          aria-label="mailbox folders"
        >
          {/* Drawer taken from https://mui.com/material-ui/react-drawer/*/}
          <Drawer
            variant="temporary"
            sx={{
              'display': {xs: 'block', sm: 'block'},
              '& .MuiDrawer-paper':
              {boxSizing: 'border-box', width: drawerWidth},
            }}
            open={mobileOpen}
            onClose={handleDrawerToggle}
          >
            {drawer}
          </Drawer>
        </Box>
        {/* Box declaration and attributes taken from https://mui.com/material-ui/react-drawer/*/}
        <Box
          component="main"
          sx={{'flexGrow': 1, 'paddingTop': 1}}
        >
          <Grid container spacing={1}>
            {mails.map((mail) => (createRow(mail)
            ))}
            {createDisplay()}
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default Home;
