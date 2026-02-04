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

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import ColorPicker from "../ColorPicker";

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
    color: "green",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  colorContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
  colorBox: {
    width: 30,
    height: 30,
    borderRadius: 4,
    cursor: "pointer",
    marginRight: theme.spacing(1),
    border: "1px solid #ccc",
  },
}));

const TagSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Mínimo 3 caracteres")
    .max(20, "Máximo 20 caracteres")
    .required("Obligatorio"),
  color: Yup.string().required("Obligatorio"),
});

const TagModal = ({ open, onClose, tagId }) => {
  const classes = useStyles();

  const initialState = {
    name: "",
    color: "#7C7C7C",
  };

  const [tag, setTag] = useState(initialState);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  useEffect(() => {
    const fetchTag = async () => {
      if (!tagId) return;
      try {
        const { data } = await api.get(`/tags/${tagId}`);
        setTag(data);
      } catch (err) {
        toastError(err);
      }
    };

    fetchTag();
  }, [tagId, open]);

  const handleClose = () => {
    onClose();
    setTag(initialState);
  };

  const handleSaveTag = async (values) => {
    try {
      if (tagId) {
        await api.put(`/tags/${tagId}`, values);
        toast.success("Etiqueta actualizada");
      } else {
        await api.post("/tags", values);
        toast.success("Etiqueta creada");
      }
      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div className={classes.root}>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          {tagId ? "Editar Etiqueta" : "Nueva Etiqueta"}
        </DialogTitle>
        <Formik
          initialValues={tag}
          enableReinitialize={true}
          validationSchema={TagSchema}
          onSubmit={(values, actions) => {
            handleSaveTag(values);
            actions.setSubmitting(false);
          }}
        >
          {({ touched, errors, isSubmitting, values, setFieldValue }) => (
            <Form>
              <DialogContent dividers>
                <Field
                  as={TextField}
                  label="Nombre"
                  name="name"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  variant="outlined"
                  margin="dense"
                  fullWidth
                />
                <div className={classes.colorContainer}>
                  <div
                    className={classes.colorBox}
                    style={{ backgroundColor: values.color }}
                    onClick={() => setColorPickerOpen(true)}
                  />
                  <TextField
                    label="Color"
                    name="color"
                    value={values.color}
                    variant="outlined"
                    margin="dense"
                    disabled
                    fullWidth
                  />
                  <ColorPicker
                    open={colorPickerOpen}
                    handleClose={() => setColorPickerOpen(false)}
                    onChange={(color) => setFieldValue("color", color)}
                    currentColor={values.color}
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
                  {tagId ? "Guardar" : "Crear"}
                  {isSubmitting && (
                    <CircularProgress size={24} className={classes.buttonProgress} />
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

export default TagModal;
