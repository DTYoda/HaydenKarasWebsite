"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./authprovider";
import EditModal from "./editmodal";

export function useEditable(type, onSaveCallback) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [editModal, setEditModal] = useState({
    isOpen: false,
    data: null,
    fields: [],
    title: null,
  });

  const handleSave = async (data) => {
    try {
      let endpoint = "";
      let payload = { ...data };

      switch (type) {
        case "project":
          endpoint = "/api/projectshandler";
          payload.action = editModal.data ? "edit" : "new";
          if (payload.action === "edit") payload.id = editModal.data.id;
          if (payload.type && payload.type !== "edit" && payload.type !== "new") {
            payload.projectType = payload.projectType || payload.type;
          }
          delete payload.type;
          break;
        case "skill":
          endpoint = "/api/skillshandler";
          payload.action = editModal.data ? "edit" : "new";
          if (payload.action === "edit") {
            payload.oldName = editModal.data.name;
            payload.id = editModal.data.id;
          }
          delete payload.type;
          break;
        case "education":
          endpoint = "/api/educationhandler";
          payload.action = editModal.data ? "edit" : "new";
          if (payload.action === "edit") {
            payload.oldName = editModal.data.name;
            payload.id = editModal.data.id;
          }
          delete payload.type;
          break;
        case "educationtimeline":
          endpoint = "/api/educationtimelinehandler";
          payload.action = editModal.data ? "edit" : "new";
          if (payload.action === "edit") payload.id = editModal.data.id;
          delete payload.type;
          break;
        case "workresearch":
          endpoint = "/api/workresearchhandler";
          payload.action = editModal.data ? "edit" : "new";
          if (payload.action === "edit") payload.id = editModal.data.id;
          delete payload.type;
          break;
        case "quickstat":
          endpoint = "/api/quickstats";
          payload.action = editModal.data ? "edit" : "new";
          if (payload.action === "edit") payload.id = editModal.data.id;
          delete payload.type;
          break;
        case "static":
          endpoint = "/api/staticcontent";
          payload.action = editModal.data ? "edit" : "new";
          delete payload.type;
          break;
        case "pagecontent":
          endpoint = "/api/pagecontent";
          payload.action = editModal.data ? "edit" : "new";
          if (editModal.data) {
            payload.key = editModal.data.key;
            payload.page = editModal.data.page;
            payload.section = editModal.data.section;
            payload.contentType =
              editModal.data.contentType ||
              (["text", "json", "html", "number"].includes(editModal.data.type)
                ? editModal.data.type
                : "text");
          }
          delete payload.type;
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        setEditModal({ isOpen: false, data: null, fields: [], title: null });
        if (onSaveCallback) onSaveCallback(result);
        router.refresh();
      } else {
        console.error("Save error:", result);
        alert(`Error: ${result.message || result.error?.message || "Failed to save"}`);
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
      let payload = { action: "delete" };

      switch (type) {
        case "project":
          endpoint = "/api/projectshandler";
          payload.id = id;
          break;
        case "skill":
          endpoint = "/api/skillshandler";
          payload.id = id;
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
        cache: "no-store",
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

  const openEditModal = (data, fields, title = null) => {
    setEditModal({ isOpen: true, data, fields, title });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, data: null, fields: [], title: null });
  };

  const defaultTitle = `${editModal.data ? "Edit" : "Add"} ${type}`;
  const EditModalComponent = editModal.isOpen ? (
    <EditModal
      isOpen={editModal.isOpen}
      onClose={closeEditModal}
      onSave={handleSave}
      title={editModal.title || defaultTitle}
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
