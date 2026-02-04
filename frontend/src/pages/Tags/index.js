import React, { useState, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
// import openSocket from "../../services/socket-io"; // Placeholder for future socket implementation

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import TagModal from "../../components/TagModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";

const reducer = (state, action) => {
  if (action.type === "LOAD_TAGS") {
    return [...action.payload];
  }

  if (action.type === "UPDATE_TAGS") {
    const tag = action.payload;
    const tagIndex = state.findIndex((t) => t.id === tag.id);

    if (tagIndex !== -1) {
      state[tagIndex] = tag;
      return [...state];
    } else {
      return [tag, ...state];
    }
  }

  if (action.type === "DELETE_TAG") {
    const tagId = action.payload;
    const tagIndex = state.findIndex((t) => t.id === tagId);
    if (tagIndex !== -1) {
      state.splice(tagIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
  return state;
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  tagColor: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    margin: "0 auto",
  },
}));

const Tags = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deletingTag, setDeletingTag] = useState(null);
  const [searchParam, setSearchParam] = useState("");
  const [tags, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    setLoading(true);
    const fetchTags = async () => {
      try {
        const { data } = await api.get("/tags", {
          params: { searchParam },
        });
        dispatch({ type: "LOAD_TAGS", payload: data });
        setLoading(false);
      } catch (err) {
        toastError(err);
      }
    };
    fetchTags();
  }, [searchParam, tagModalOpen]); // Refresh on close too

  const handleOpenTagModal = () => {
    setSelectedTag(null);
    setTagModalOpen(true);
  };

  const handleCloseTagModal = () => {
    setSelectedTag(null);
    setTagModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditTag = (tag) => {
    setSelectedTag(tag);
    setTagModalOpen(true);
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await api.delete(`/tags/${tagId}`);
      toast.success("Etiqueta eliminada");
      dispatch({ type: "DELETE_TAG", payload: tagId });
    } catch (err) {
      toastError(err);
    }
    setDeletingTag(null);
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={deletingTag && `Eliminar etiqueta ${deletingTag.name}?`}
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => handleDeleteTag(deletingTag.id)}
      >
        Esta acción no se puede deshacer. Se eliminará el vínculo de esta etiqueta con todos los tickets.
      </ConfirmationModal>
      <TagModal
        open={tagModalOpen}
        onClose={handleCloseTagModal}
        tagId={selectedTag && selectedTag.id}
      />
      <MainHeader>
        <Title>Etiquetas</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder="Buscar..."
            type="search"
            value={searchParam}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenTagModal}
          >
            Agregar
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Color</TableCell>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell align="center">
                    <div
                      className={classes.tagColor}
                      style={{ backgroundColor: tag.color }}
                    />
                  </TableCell>
                  <TableCell align="center">{tag.name}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleEditTag(tag)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => {
                        setConfirmModalOpen(true);
                        setDeletingTag(tag);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={3} />}
            </>
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Tags;
