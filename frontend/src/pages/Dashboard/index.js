import React, { useContext, useState, useEffect } from "react";

import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { AuthContext } from "../../context/Auth/AuthContext";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";

import LeadsChart from "./LeadsChart";

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 240,
  },
  customFixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 120,
  },
  customFixedHeightPaperLg: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
  },
  card: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({
    leadsByUser: [],
    newLeads: [],
    userTimes: {}
  });

  useEffect(() => {
    if (user.profile === "admin") {
      api.get("/dashboard/analytics")
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching analytics", err);
        });
    }
  }, [user]);

  if (user.profile !== "admin") {
      return (
          <Container maxWidth="lg" className={classes.container}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  {i18n.t("dashboard.noAccess")}
              </Typography>
          </Container>
      );
  }

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
            {/* Leads Accepted by User */}
            <Grid item xs={12} md={6}>
                <Paper className={classes.card}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Leads Aceptados por Usuario
                    </Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Usuario</TableCell>
                                <TableCell>Cantidad</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.leadsByUser.map((row) => (
                                <TableRow key={row.userId}>
                                    <TableCell>{row.User?.name || "N/A"}</TableCell>
                                    <TableCell>{row.count}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>

            {/* Time Online */}
            <Grid item xs={12} md={6}>
                <Paper className={classes.card}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Tiempo en Plataforma
                    </Typography>
                     <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Usuario</TableCell>
                                <TableCell>Tiempo Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(data.userTimes).map(([userId, stats]) => (
                                <TableRow key={userId}>
                                    <TableCell>{stats.name}</TableCell>
                                    <TableCell>{formatTime(stats.seconds)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>

           {/* New Leads Chart */}
           <Grid item xs={12}>
                <Paper className={classes.fixedHeightPaper}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Nuevos Leads (Últimos 7 días)
                    </Typography>
                    <LeadsChart data={data.newLeads} />
                </Paper>
           </Grid>

        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;