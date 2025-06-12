import { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "src/hooks/useAuth";
import { useConversations } from "src/hooks/useConversations";

import type { Conversation } from "../types";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { conversationId } = useParams<{ conversationId: string }>();
  const { conversations, loadConversations } = useConversations(
    user,
    Number(conversationId)
  );
  const navigate = useNavigate();

  // Refresh conversations when navigating to a new conversation
  useEffect(() => {
    if (conversationId) {
      loadConversations();
    }
  }, [conversationId, loadConversations]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      return "Today";
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const getConversationTitle = (conversation: Conversation) => {
    // Generate a title based on conversation timing or use a default
    const isActive = conversation.end_time === null;
    const timeLabel = formatDate(new Date(conversation.start_time));
    return isActive
      ? `Active Conversation - ${timeLabel}`
      : `Conversation - ${timeLabel}`;
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ p: 3 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => navigate("/new")}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
          }}
        >
          New Conversation
        </Button>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight="500"
          sx={{ px: 2, py: 1, mb: 1 }}
        >
          Recent
        </Typography>

        <List sx={{ p: 0 }}>
          {[...conversations]
            .sort(
              (a, b) =>
                new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
            )
            .map(conversation => (
              <ListItemButton
                key={conversation.conversation_id}
                selected={Number(conversationId) === conversation.conversation_id}
                onClick={() => {
                  navigate(`/chat/${conversation.conversation_id}`);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.5,
                  px: 2,
                  "&.Mui-selected": {
                    bgcolor: "primary.50",
                    "&:hover": {
                      bgcolor: "primary.100",
                    },
                  },
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      fontWeight={
                        Number(conversationId) === conversation.conversation_id
                          ? 500
                          : 400
                      }
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {getConversationTitle(conversation)}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(new Date(conversation.start_time))}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
        </List>
      </Box>
      <Divider />

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            alt={user?.username}
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontSize: "0.875rem",
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              fontWeight="500"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.username}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
              }}
            >
              {user?.email}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={logout}
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "error.main",
                bgcolor: "error.50",
              },
            }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
