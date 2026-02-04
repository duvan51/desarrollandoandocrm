import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import Board from "react-trello";
import { i18n } from "../../translate/i18n";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import toastError from "../../errors/toastError";
import openSocket from "../../services/socket-io";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: theme.spacing(1),
  },
  boardContainer: {
    flex: 1,
    overflow: "hidden",
  },
}));

const Kanban = () => {
  const classes = useStyles();
  const [boardData, setBoardData] = useState({ lanes: [] });

  const fetchTickets = async () => {
    try {
      const { data: tags } = await api.get("/tags");
      const { data: ticketsData } = await api.get("/tickets", {
        params: { status: "open" },
      });

      const lanes = tags.map((tag) => {
        const filteredTickets = ticketsData.tickets.filter((ticket) =>
          ticket.tags?.some((t) => t.id === tag.id)
        ).map(ticket => ({
          id: ticket.id.toString(),
          title: ticket.contact.name,
          description: ticket.lastMessage || "Sin mensajes",
          label: ticket.whatsapp?.name,
          metadata: { ticketId: ticket.id },
          style: { borderLeft: `5px solid ${tag.color}` }
        }));

        return {
          id: tag.id.toString(),
          title: tag.name,
          label: filteredTickets.length.toString(),
          cards: filteredTickets,
          style: { backgroundColor: "#f4f4f4", width: 280 }
        };
      });

      setBoardData({ lanes });
    } catch (err) {
      toastError(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const socket = openSocket();

    socket.on("ticket", (data) => {
      if (data.action === "update" || data.action === "create") {
        fetchTickets();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDragEnd = async (cardId, sourceLaneId, targetLaneId) => {
    if (sourceLaneId === targetLaneId) return;

    try {
      const { data: tags } = await api.get("/tags");
      const targetTag = tags.find(t => t.id.toString() === targetLaneId);
      
      if (targetTag) {
        // Sync tags replace or add? For now, we'll replace for simplicity in Kanban
        await api.post(`/tags/sync/${cardId}`, { tags: [targetTag] });
      }
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <MainContainer>
      <MainHeader>
        <Title>Pipeline (Kanban)</Title>
      </MainHeader>
      <div className={classes.boardContainer}>
        <Board
          data={boardData}
          handleDragEnd={handleDragEnd}
          draggable
          style={{ backgroundColor: "transparent", padding: "10px" }}
        />
      </div>
    </MainContainer>
  );
};

export default Kanban;
