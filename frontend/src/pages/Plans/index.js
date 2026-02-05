import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import ConfirmationModal from "../../components/ConfirmationModal";
import PlanModal from "../../components/PlanModal";

import api from "../../services/api";
import toastError from "../../errors/toastError";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
}));

const Plans = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, [planModalOpen]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/plans");
      setPlans(data);
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  };

  const handleOpenPlanModal = () => {
    setSelectedPlan(null);
    setPlanModalOpen(true);
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setPlanModalOpen(true);
  };

  const onClosePlanModal = () => {
    setSelectedPlan(null);
    setPlanModalOpen(false);
  };

  const handleDeletePlan = async (planId) => {
    try {
      await api.delete(`/plans/${planId}`);
      toast.success("Plan eliminado satisfactoriamente.");
      fetchPlans();
    } catch (err) {
      toastError(err);
    }
    setConfirmModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={selectedPlan && `¿Desea eliminar el plan ${selectedPlan.name}?`}
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => handleDeletePlan(selectedPlan.id)}
      >
        Esta acción no se puede deshacer.
      </ConfirmationModal>
      <PlanModal
        open={planModalOpen}
        onClose={onClosePlanModal}
        planId={selectedPlan?.id}
      />
      <MainHeader>
        <Title>Planes SaaS</Title>
        <MainHeaderButtonsWrapper>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenPlanModal}
          >
            Agregar Plan
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Usuarios</TableCell>
              <TableCell align="center">Whatsapps</TableCell>
              <TableCell align="center">Filas/Queues</TableCell>
              <TableCell align="center">Valor</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell align="center">{plan.name}</TableCell>
                <TableCell align="center">{plan.users}</TableCell>
                <TableCell align="center">{plan.whatsapps}</TableCell>
                <TableCell align="center">{plan.queues}</TableCell>
                <TableCell align="center">{plan.value}</TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleEditPlan(plan)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                        setSelectedPlan(plan);
                        setConfirmModalOpen(true);
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Plans;
