import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  TextField,
  makeStyles
} from "@material-ui/core";

import { green } from "@material-ui/core/colors";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  multFieldLine: {
    display: "flex",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
  btnWrapper: {
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const PlanSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Demasiado corto")
    .max(50, "Demasiado largo")
    .required("Obligatorio"),
  users: Yup.number().required("Obligatorio"),
  whatsapps: Yup.number().required("Obligatorio"),
  queues: Yup.number().required("Obligatorio"),
  value: Yup.number().required("Obligatorio"),
});

const PlanModal = ({ open, onClose, planId }) => {
  const classes = useStyles();

  const initialState = {
    name: "",
    users: 0,
    whatsapps: 0,
    queues: 0,
    value: 0,
  };

  const [plan, setPlan] = useState(initialState);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) return;
      try {
        const { data } = await api.get("/plans");
        const planFound = data.find((p) => p.id === planId);
        if (planFound) {
            setPlan(planFound);
        }
      } catch (err) {
        toastError(err);
      }
    };

    fetchPlan();
  }, [planId, open]);

  const handleClose = () => {
    onClose();
    setPlan(initialState);
  };

  const handleSavePlan = async (values) => {
    try {
      if (planId) {
        await api.put(`/plans/${planId}`, values);
      } else {
        await api.post("/plans", values);
      }
      toast.success("Plan guardado satisfactoriamente.");
      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">
          {planId ? "Editar Plan" : "Agregar Plan"}
        </DialogTitle>
        <Formik
          initialValues={plan}
          enableReinitialize={true}
          validationSchema={PlanSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSavePlan(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <Field
                  as={TextField}
                  label="Nombre"
                  autoFocus
                  name="name"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  variant="outlined"
                  margin="dense"
                  fullWidth
                />
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    label="Usuarios"
                    name="users"
                    type="number"
                    error={touched.users && Boolean(errors.users)}
                    helperText={touched.users && errors.users}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                  <Field
                    as={TextField}
                    label="Whatsapps"
                    name="whatsapps"
                    type="number"
                    error={touched.whatsapps && Boolean(errors.whatsapps)}
                    helperText={touched.whatsapps && errors.whatsapps}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                </div>
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    label="Filas/Queues"
                    name="queues"
                    type="number"
                    error={touched.queues && Boolean(errors.queues)}
                    helperText={touched.queues && errors.queues}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                  <Field
                    as={TextField}
                    label="Valor"
                    name="value"
                    type="number"
                    error={touched.value && Boolean(errors.value)}
                    helperText={touched.value && errors.value}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {planId ? "Guardar" : "Agregar"}
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default PlanModal;
