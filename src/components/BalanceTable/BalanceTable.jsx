import React from "react";

import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Table from "components/Table/Table.jsx";
import withStyles from "@material-ui/core/styles/withStyles";

import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";

import moment from "moment";

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

const BalanceTable = ({ auth, balance, classes }) => {
  return (
    <Card>
      <CardHeader color="warning">
        <h4 className={classes.cardTitleWhite}>Balance</h4>
        <p className={classes.cardCategoryWhite} />
      </CardHeader>
      <CardBody>
        {!isLoaded(balance) ? (
          "Loading"
        ) : !balance[auth.uid] || !balance[auth.uid].records ? (
          "Balance is empty"
        ) : (
          <Table
            tableHeaderColor="warning"
            tableHead={["Title", "Category", "Amount", "Date"]}
            tableData={balance[auth.uid].records
              .reverse()
              .map(record => [
                record.title,
                record.category,
                record.amount,
                record.date
                  ? moment(record.date.toDate()).format("DD-MM HH:mm")
                  : null
              ])}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default compose(
  connect(({ firebase: { auth }, firestore: { data } }) => ({
    balance: data.balance,
    auth
  })),
  firestoreConnect(props => [
    {
      collection: "balance",
      doc: props.auth.uid
    }
  ]),

  withStyles(styles)
)(BalanceTable);
