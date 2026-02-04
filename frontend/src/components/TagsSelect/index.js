import React, { useState, useEffect } from "react";
import { 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  CircularProgress,
  useTheme
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  chip: {
    cursor: "pointer",
  },
  tagChip: {
    margin: theme.spacing(0.5),
  }
}));

const TagsSelect = ({ ticket, onUpdated }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchTags = async () => {
        setLoading(true);
        try {
          const { data } = await api.get("/tags");
          setTags(data);
          setSelectedTags(ticket.tags || []);
        } catch (err) {
          toastError(err);
        }
        setLoading(false);
      };
      fetchTags();
    }
  }, [open, ticket]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post(`/tags/sync/${ticket.id}`, { tags: selectedTags });
      if (onUpdated) onUpdated();
      setOpen(false);
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  };

  const handleSelectTag = (tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    if (isSelected) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <>
      <div className={classes.root} onClick={() => setOpen(true)}>
        {ticket.tags?.length > 0 ? (
          ticket.tags.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              size="small"
              style={{ backgroundColor: tag.color, color: "#FFF" }}
            />
          ))
        ) : (
          <Chip
            variant="outlined"
            size="small"
            label="Sin etiquetas"
            icon={<LocalOfferOutlinedIcon />}
            className={classes.chip}
          />
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Seleccionar Etiquetas</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <CircularProgress />
          ) : (
            <div className={classes.root}>
              {tags.map((tag) => {
                const isSelected = selectedTags.some((t) => t.id === tag.id);
                return (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    className={classes.tagChip}
                    variant={isSelected ? "default" : "outlined"}
                    onClick={() => handleSelectTag(tag)}
                    style={{
                      backgroundColor: isSelected ? tag.color : "transparent",
                      color: isSelected ? "#FFF" : tag.color,
                      borderColor: tag.color,
                    }}
                  />
                );
              })}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TagsSelect;
