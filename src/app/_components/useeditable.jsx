"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./authprovider";
import EditModal from "./editmodal";

export function useEditable(type, onSaveCallback) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [editModal, setEditModal] = useState({ isOpen: false, data: null, fields: [] });

  const handleSave = async (data) => {
    try {
      let endpoint = "";
      let payload = { ...data };

      switch (type) {
        case "project":
          endpoint = "/api/projectshandler";
          payload.type = editModal.data ? "edit" : "new";
          if (payload.type === "edit") payload.id = editModal.data.id;
          // Convert projectType back to type for the API (but keep projectType in payload for clarity)
          if (payload.projectType) {
            payload.projectType = payload.projectType;
          }
          break;
        case "skill":
          endpoint = "/api/skillshandler";
          payload.type = editModal.data ? "edit" : "new";
          if (payload.type === "edit") {
            payload.oldName = editModal.data.name;
            payload.id = editModal.data.id;
          }
          break;
        case "education":
          endpoint = "/api/educationhandler";
          payload.type = editModal.data ? "edit" : "new";
          if (payload.type === "edit") {
            payload.oldName = editModal.data.name;
            payload.id = editModal.data.id;
          }
          break;
        case "educationtimeline":
          endpoint = "/api/educationtimelinehandler";
          payload.type = editModal.data ? "edit" : "new";
          if (payload.type === "edit") payload.id = editModal.data.id;
          break;
        case "workresearch":
          endpoint = "/api/workresearchhandler";
          payload.type = editModal.data ? "edit" : "new";
          if (payload.type === "edit") payload.id = editModal.data.id;
          break;
        case "topskill":
          endpoint = "/api/topskills";
          payload.type = editModal.data ? "edit" : "new";
          if (payload.type === "edit") payload.id = editModal.data.id;
          break;
        case "quickstat":
          endpoint = "/api/quickstats";
          payload.type = editModal.data ? "edit" : "new";
          if (payload.type === "edit") payload.id = editModal.data.id;
          break;
        case "static":
          endpoint = "/api/staticcontent";
          payload.type = editModal.data ? "edit" : "new";
          break;
        case "pagecontent":
          endpoint = "/api/pagecontent";
          const operationType = editModal.data ? "edit" : "new";
          // For pagecontent, we need to preserve key, page, section, contentType
          if (editModal.data) {
            payload.key = editModal.data.key;
            payload.page = editModal.data.page;
            payload.section = editModal.data.section;
            payload.contentType = editModal.data.type || "text";
          }
          payload.type = operationType;
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setEditModal({ isOpen: false, data: null, fields: [] });
        if (onSaveCallback) onSaveCallback();
        router.refresh();
      } else {
        const error = await response.json();
        console.error("Save error:", error);
        alert(`Error: ${error.message || error.error?.message || "Failed to save"}\n\nDetails: ${JSON.stringify(error, null, 2)}`);
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving data");
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      let endpoint = "";
      let payload = { type: "delete" };

      switch (type) {
        case "project":
          endpoint = "/api/projectshandler";
          payload.id = id;
          break;
        case "skill":
          endpoint = "/api/skillshandler";
          payload.name = name;
          break;
        case "education":
          endpoint = "/api/educationhandler";
          payload.name = name;
          break;
        case "educationtimeline":
          endpoint = "/api/educationtimelinehandler";
          payload.id = id;
          break;
        case "workresearch":
          endpoint = "/api/workresearchhandler";
          payload.id = id;
          break;
        case "topskill":
          endpoint = "/api/topskills";
          payload.id = id;
          break;
        case "quickstat":
          endpoint = "/api/quickstats";
          payload.id = id;
          break;
        case "static":
          endpoint = "/api/staticcontent";
          payload.key = id;
          break;
        case "pagecontent":
          endpoint = "/api/pagecontent";
          payload.key = id;
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        if (onSaveCallback) onSaveCallback();
        router.refresh();
      } else {
        alert("Error deleting data");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting data");
    }
  };

  const openEditModal = (data, fields) => {
    setEditModal({ isOpen: true, data, fields });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, data: null, fields: [] });
  };

  const EditModalComponent = editModal.isOpen ? (
    <EditModal
      isOpen={editModal.isOpen}
      onClose={closeEditModal}
      onSave={handleSave}
      title={`${editModal.data ? "Edit" : "Add"} ${type}`}
      fields={editModal.fields || []}
      initialData={editModal.data || {}}
    />
  ) : null;

  return {
    isAuthenticated,
    openEditModal,
    handleDelete,
    EditModalComponent,
  };
}

