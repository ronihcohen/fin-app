import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import GoogleButton from "react-google-button";

import iconsStyle from "assets/jss/material-dashboard-react/views/iconsStyle.jsx";
import { Button } from "@material-ui/core";
import { Redirect } from "react-router-dom";

function LoginPage(props) {
  const { classes, firebase, auth } = props;
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>
              Material Design LoginPage
            </h4>
            <p className={classes.cardCategoryWhite}>
              Handcrafted by our friends from{" "}
              <a
                href="https://design.google.com/LoginPage/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google
              </a>
            </p>
          </CardHeader>
          <CardBody>
            <div>
              <h2>Auth</h2>
              {!isLoaded(auth) ? (
                <span>Loading...</span>
              ) : isEmpty(auth) ? (
                <span>Not Authed</span>
              ) : (
                <Redirect
                  to={{
                    pathname: "/dashboard"
                  }}
                />
              )}
            </div>
            <GoogleButton
              onClick={() =>
                firebase.login({ provider: "google", type: "popup" })
              }
            />
            <Button onClick={() => firebase.logout()}>Logout</Button>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  withStyles(iconsStyle),
  firestoreConnect(), // withFirebase can also be used
  connect(({ firebase: { auth } }) => ({ auth }))
)(LoginPage);
