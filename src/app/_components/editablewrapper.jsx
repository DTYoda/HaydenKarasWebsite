"use client";

import { useAuth } from "./authprovider";
import EditButton from "./editbutton";
import DeleteButton from "./deletebutton";
import AddButton from "./addbutton";

export default function EditableWrapper({
  children,
  onEdit,
  onDelete,
  onAdd,
  addLabel = "Add",
  className = "",
  showAdd = false,
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {onEdit && <EditButton onClick={onEdit} />}
      {onDelete && <DeleteButton onClick={onDelete} />}
      {showAdd && onAdd && (
        <div className="absolute top-2 left-2 z-10">
          <AddButton onClick={onAdd} label={addLabel} />
        </div>
      )}
      {children}
    </div>
  );
}

