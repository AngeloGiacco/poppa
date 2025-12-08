"use client";

interface ChatControlsProps {
  showEditButton: boolean;
  isEditingInstructions: boolean;
  onToggleEdit: () => void;
}

export function ChatControls({
  showEditButton,
  isEditingInstructions,
  onToggleEdit,
}: ChatControlsProps) {
  if (!showEditButton) {
    return null;
  }

  return (
    <div className="flex justify-end mb-2">
      {/* Chat controls can be added here if needed */}
    </div>
  );
}
