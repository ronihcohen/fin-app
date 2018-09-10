import React, { Component } from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

class AddRecordForm extends Component {
  constructor(props) {
    super(props);
    this.state = { title: "", amount: "", category: "" };
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  cleanState() {
    this.setState({ title: "", amount: "", category: "" });
  }

  setBalanceDoc(balanceRef) {
    const { title, amount, category } = this.state;
    const { firebase } = this.props;

    balanceRef
      .set({
        records: firebase.firestore.FieldValue.arrayUnion({
          title: title,
          amount: amount,
          category: category
        })
      })
      .then(() => {
        this.cleanState();
      })
      .catch(error => {
        console.error("Error writing document: ", error);
      });
  }

  updateBalanceDoc(balanceRef) {
    const { title, amount, category } = this.state;
    const { firebase } = this.props;

    balanceRef
      .update({
        records: firebase.firestore.FieldValue.arrayUnion({
          title: title,
          amount: amount,
          category: category
        })
      })
      .then(() => {
        this.cleanState();
      })
      .catch(error => {
        this.setBalanceDoc(balanceRef);
      });
  }

  handleClick() {
    const { firestore, auth } = this.props;
    const balanceRef = firestore.collection("balance").doc(auth.uid);

    this.updateBalanceDoc(balanceRef);
  }

  render() {
    const { classes } = this.props;
    const { title, amount, category } = this.state;

    return (
      <div>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
            <p className={classes.cardCategoryWhite}>Complete your profile</p>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={3}>
                <CustomInput
                  labelText="Ttile"
                  id="title"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: this.handleChange("title"),
                    value: title
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={3}>
                <CustomInput
                  labelText="Category"
                  id="category"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: this.handleChange("category"),
                    value: category
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={3}>
                <CustomInput
                  labelText="Amount"
                  id="amount"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: this.handleChange("amount"),
                    value: amount
                  }}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter>
            <Button onClick={e => this.handleClick()} color="primary">
              Add
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

export default compose(
  firestoreConnect(),
  connect(state => ({
    auth: state.firebase.auth
  })),
  withStyles(styles)
)(AddRecordForm);
