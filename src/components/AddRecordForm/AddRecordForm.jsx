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
    this.state = {
      data: {
        title: "",
        amount: "",
        category: ""
      },
      validation: { form: true }
    };
  }

  checkFormValidation(name) {
    const { data, validation } = this.state;

    let newValidation = { ...validation, form: false };
    for (let fieldName in data) {
      let filedIntValue = parseInt(data[fieldName]);
      let fieldStatus = isNaN(filedIntValue)
        ? data[fieldName].length === 0
        : filedIntValue < 1;

      if (name === fieldName) {
        newValidation[fieldName] = fieldStatus;
      }
      newValidation.form = newValidation.form || fieldStatus;
    }

    this.setState({ validation: newValidation });
  }

  handleChange = name => event => {
    let { data } = this.state;
    data[name] = event.target.value;

    this.setState(
      {
        data: data
      },
      () => this.checkFormValidation(name)
    );
  };

  cleanState() {
    this.setState({
      data: {
        title: "",
        amount: "",
        category: ""
      },
      validation: { form: true }
    });
    this.titleInput.focus();
  }

  setBalanceDoc(balanceRef) {
    const {
      data: { title, amount, category }
    } = this.state;
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
    const {
      data: { title, amount, category }
    } = this.state;
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

  handleSubmit = e => {
    e.preventDefault();
    const { firestore, auth } = this.props;
    const {
      validation: { form }
    } = this.state;
    if (form) {
      return;
    }

    const balanceRef = firestore.collection("balance").doc(auth.uid);

    this.updateBalanceDoc(balanceRef);
  };

  render() {
    const { classes } = this.props;
    const {
      data: { title, amount, category },
      validation
    } = this.state;

    return (
      <form onSubmit={e => this.handleSubmit(e)}>
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
                    value: title,
                    autoFocus: true,
                    inputRef: el => (this.titleInput = el)
                  }}
                  error={validation.title}
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
                  error={validation.category}
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
                    value: amount,
                    type: "number"
                  }}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter>
            <Button type="submit" color="primary" disabled={validation.form}>
              Add
            </Button>
          </CardFooter>
        </Card>
      </form>
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
