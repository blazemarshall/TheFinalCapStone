import React, { useState } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from "./newReservationPage/NewReservation.js";
import NewTable from "./Tables/NewTable";
import ReadReservation from "./readReservationPage/ReadReservation";
import Search from "./search/Search";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [tables, setTables] = useState([]);
  const [refresh, setRefresh] = useState(true);

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTable />
      </Route>
      <Route exact={true} path="/search">
        <Search />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <ReadReservation
          tables={tables}
          refresh={refresh}
          setRefresh={setRefresh}
          setTables={setTables}
        />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          setTables={setTables}
          refresh={refresh}
          tables={tables}
          setRefresh={setRefresh}
          dateParam={today()}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
