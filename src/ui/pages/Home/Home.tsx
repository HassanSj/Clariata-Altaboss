import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {List, ListItem, ListItemText} from '@material-ui/core';
import Link from 'next/link';

const Home = () => {
  return (
    <>
      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Home - Use links below to view a page
          </Typography>
          <List component="nav" aria-label="main mailbox folders">
            <Link href="/register">
              <ListItem button>
                <ListItemText primary="Register" />
              </ListItem>
            </Link>
            <Link href="/password">
              <ListItem button>
                <ListItemText primary="Reset Password" />
              </ListItem>
            </Link>
            <Link href="/verification">
              <ListItem button>
                <ListItemText primary="Resend Verification" />
              </ListItem>
            </Link>
            <Link href="/login">
              <ListItem button>
                <ListItemText primary="Login" />
              </ListItem>
            </Link>
          </List>
        </CardContent>
      </Card>
    </>
  );
};

export default Home;
